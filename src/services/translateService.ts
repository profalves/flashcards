import { logger } from "./logger";
import { PRELOADED_TRANSLATIONS } from "./preloadedTranslations";

const LINGVA_ENDPOINT = "https://lingva.ml/api/v1";
const FETCH_TIMEOUT = 15000;
const SOURCE_LANG = "en";
const TARGET_LANG = "pt";

interface TranslateRequest {
  text: string;
}

interface LingvaResponse {
  translation: string;
}

interface TranslateResponse {
  translation: string;
  [key: string]: any;
}

interface TranslateResult {
  success: boolean;
  data?: TranslateResponse;
  error?: string;
  statusCode?: number;
}

const translationCache = new Map<string, TranslateResponse>();

for (const [key, value] of Object.entries(PRELOADED_TRANSLATIONS)) {
  translationCache.set(key.toLowerCase(), value);
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

async function fetchFromLingva(text: string): Promise<LingvaResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const url = `${LINGVA_ENDPOINT}/translate?source=${SOURCE_LANG}&target=${TARGET_LANG}&text=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    if (!response.ok) {
      logger.error("Error from Lingva API", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Lingva API returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } finally {
    clearTimeout(timeoutId);
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
    });
    return {
      success: true,
      data: cachedResult,
    };
  }

  try {
    logger.info("Starting translation", {
      endpoint: LINGVA_ENDPOINT,
      textLength: text.length,
      preview: text.substring(0, 50),
      source: SOURCE_LANG,
      target: TARGET_LANG,
    });

    const lingvaResponse = await fetchFromLingva(text);

    const translationData: TranslateResponse = {
      translation: lingvaResponse.translation,
      source: SOURCE_LANG,
      target: TARGET_LANG,
      provider: "Lingva",
    };

    translationCache.set(cacheKey, translationData);

    logger.success("Translation completed successfully", {
      textLength: text.length,
      translation: lingvaResponse.translation.substring(0, 50),
      cached: false,
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
          message: `Lingva API is too slow (>${FETCH_TIMEOUT}ms)`,
        });

        return {
          success: false,
          error: `Request timeout. Translation service is too slow (>${FETCH_TIMEOUT}ms)`,
          statusCode: 504,
        };
      }

      logger.error("Error processing translation", {
        errorName: error.name,
        errorMessage: error.message,
      });

      return {
        success: false,
        error: `Error processing translation: ${error.message}`,
        statusCode: 500,
      };
    }

    logger.error("Unknown error processing translation", { error });
    return {
      success: false,
      error: "Unknown error while processing translation.",
      statusCode: 500,
    };
  }
}
