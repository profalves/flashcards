import { logger } from "./logger";
import { PRELOADED_TRANSLATIONS } from "./preloadedTranslations";

const FETCH_TIMEOUT = 8000;

interface TranslateRequest {
  text: string;
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

async function fetchTranslation(text: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch("https://translate-api.goog/translate_a/single", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error("Translation API returned error", { status: response.status });
      return null;
    }

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
      const translation = result[0]
        .map((item: any[]) => item[0])
        .join("");
      return translation;
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

    const translation = await fetchTranslation(text);

    if (!translation) {
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
      translation,
      source: "en",
      target: "pt",
      provider: "Google Translate",
    };

    translationCache.set(cacheKey, translationData);

    logger.success("Translation completed successfully", {
      textLength: text.length,
      translation: translation.substring(0, 50),
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
