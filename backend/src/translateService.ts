import { PRELOADED_TRANSLATIONS } from "./preloadedTranslations.js";
import { logger } from "./logger.js";

const FETCH_TIMEOUT = 8000;

interface TranslateRequest {
  text: string;
}

interface TranslateResponse {
  translation: string;
  pronunciation?: string;
  examples?: string[];
  source?: string;
  target?: string;
  provider?: string;
  cached?: boolean;
}

interface TranslateResult {
  success: boolean;
  data?: TranslateResponse;
  error?: string;
  statusCode?: number;
}

const translationCache = new Map<string, TranslateResponse>();

for (const [key, value] of Object.entries(PRELOADED_TRANSLATIONS)) {
  translationCache.set(key.toLowerCase(), {
    translation: value.translation,
    pronunciation: value.pronunciation,
    examples: value.examples,
    source: "en",
    target: "pt",
    provider: "Cache",
    cached: true,
  });
}

export function validateTranslateInput(text: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!text || typeof text !== "string") {
    return {
      valid: false,
      error: "Field 'text' is required and must be a string.",
    };
  }

  if (text.trim().length === 0) {
    return {
      valid: false,
      error: "Text cannot be empty.",
    };
  }

  return { valid: true };
}

interface FetchedTranslation {
  translation: string;
  pronunciation: string;
  examples: string[];
  provider: string;
}

function stripHtml(text: string): string {
  return text.replace(/<\/?b>/gi, "");
}

function parseGoogleDictionary(data: unknown): {
  translation: string;
  pronunciation: string;
  examples: string[];
} | null {
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return null;
  }

  const translation = data[0]?.[0]?.[0];
  if (typeof translation !== "string" || translation.length === 0) {
    return null;
  }

  let pronunciation = "";
  const pronunciationBlock = data[0]?.[1];
  if (Array.isArray(pronunciationBlock) && typeof pronunciationBlock[3] === "string") {
    pronunciation = `/${pronunciationBlock[3]}/`;
  }

  let examples: string[] = [];
  for (let index = data.length - 1; index >= 0; index -= 1) {
    const item = data[index];
    if (!Array.isArray(item) || !Array.isArray(item[0])) {
      continue;
    }

    const block = item[0];
    const isExampleBlock = block.every(
      (row: unknown) => Array.isArray(row) && typeof row[0] === "string"
    );

    if (!isExampleBlock) {
      continue;
    }

    const texts = block
      .map((row: string[]) => stripHtml(row[0]))
      .filter((example: string) => example.length > 0);

    if (texts.length > 0 && texts.some((example) => example.split(/\s+/).length > 1)) {
      examples = texts.slice(0, 3);
      break;
    }
  }

  return { translation, pronunciation, examples };
}

async function fetchFromGoogle(text: string, signal: AbortSignal): Promise<FetchedTranslation | null> {
  const url = `https://clients5.google.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=pt&dt=t&dt=bd&dt=ex&dt=at&dt=md&dt=rm&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "flashcards-backend/1.0",
    },
    // @ts-ignore
    signal,
  });

  if (!response.ok) {
    logger.error("Google Translate returned error", { status: response.status });
    return null;
  }

  const parsed = parseGoogleDictionary(await response.json());
  if (!parsed) {
    return null;
  }

  return {
    ...parsed,
    provider: "Google Translate",
  };
}

async function fetchFromMyMemory(text: string, signal: AbortSignal): Promise<FetchedTranslation | null> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-BR`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "flashcards-backend/1.0",
    },
    // @ts-ignore
    signal,
  });

  if (!response.ok) {
    logger.error("MyMemory returned error", { status: response.status });
    return null;
  }

  const result = (await response.json()) as {
    responseStatus?: number;
    responseData?: { translatedText?: string };
  };

  if (result.responseStatus === 200 && result.responseData?.translatedText) {
    return {
      translation: result.responseData.translatedText,
      pronunciation: "",
      examples: [],
      provider: "MyMemory",
    };
  }

  return null;
}

async function fetchTranslation(text: string): Promise<FetchedTranslation | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const googleTranslation = await fetchFromGoogle(text, controller.signal);
    if (googleTranslation) {
      clearTimeout(timeoutId);
      return googleTranslation;
    }

    const myMemoryTranslation = await fetchFromMyMemory(text, controller.signal);
    clearTimeout(timeoutId);

    if (myMemoryTranslation) {
      return myMemoryTranslation;
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      logger.debug("Translation fetch error", {
        errorName: error.name,
        message: error.message.substring(0, 100),
      });
    }
    return null;
  }
}

export async function translate(request: TranslateRequest): Promise<TranslateResult> {
  const { text } = request;

  const validation = validateTranslateInput(text);
  if (!validation.valid) {
    logger.warn("Invalid input for translation", { error: validation.error });
    return {
      success: false,
      error: validation.error,
      statusCode: 400,
    };
  }

  const cacheKey = text.toLowerCase().trim();
  const cachedResult = translationCache.get(cacheKey);

  if (cachedResult) {
    logger.info("Translation found in cache", {
      textLength: text.length,
      cacheHit: true,
      translation: cachedResult.translation.substring(0, 50),
    });
    return {
      success: true,
      data: cachedResult,
    };
  }

  try {
    logger.info("Starting translation (cache miss)", {
      textLength: text.length,
      preview: text.substring(0, 50),
    });

    const fetched = await fetchTranslation(text);

    if (!fetched) {
      logger.warn("Translation API returned empty result", {
        text: text.substring(0, 50),
      });
      return {
        success: false,
        error: "Could not translate text. Please try a simpler word.",
        statusCode: 503,
      };
    }

    const translationData: TranslateResponse = {
      translation: fetched.translation,
      pronunciation: fetched.pronunciation,
      examples: fetched.examples,
      source: "en",
      target: "pt",
      provider: fetched.provider,
      cached: false,
    };

    translationCache.set(cacheKey, translationData);

    logger.success("Translation completed successfully", {
      textLength: text.length,
      translation: fetched.translation.substring(0, 50),
      provider: fetched.provider,
    });

    return {
      success: true,
      data: translationData,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        logger.error("Request timeout", {
          timeout: FETCH_TIMEOUT,
          message: "Translation service is too slow",
        });

        return {
          success: false,
          error: "Translation request timed out. Please try another word or contact support.",
          statusCode: 504,
        };
      }

      logger.error("Error processing translation", {
        errorName: error.name,
        errorMessage: error.message.substring(0, 100),
      });
    }

    logger.error("Unknown error processing translation");
    return {
      success: false,
      error: "Unknown error while processing translation.",
      statusCode: 500,
    };
  }
}
