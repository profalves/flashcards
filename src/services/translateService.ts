import { logger } from "./logger";

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 30000;

interface TranslateRequest {
  text: string;
}

interface TranslateResponse {
  [key: string]: any;
}

interface TranslateResult {
  success: boolean;
  data?: TranslateResponse;
  error?: string;
  statusCode?: number;
}

const translationCache = new Map<string, TranslateResponse>();

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

export function validateConfig(): {
  valid: boolean;
  error?: string;
} {
  if (!ENDPOINT) {
    logger.error("NEXT_PUBLIC_API_URL not configured");
    return {
      valid: false,
      error: "Server configuration is invalid.",
    };
  }

  return { valid: true };
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

  const configValidation = validateConfig();
  if (!configValidation.valid) {
    return {
      success: false,
      error: configValidation.error,
      statusCode: 500,
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
      endpoint: `${ENDPOINT}/translate`,
      textLength: text.length,
      preview: text.substring(0, 50),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(`${ENDPOINT}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error("Error from external API", {
        status: response.status,
        statusText: response.statusText,
      });

      return {
        success: false,
        error: `External API returned error: ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();

    translationCache.set(cacheKey, data);

    logger.success("Translation completed successfully", {
      textLength: text.length,
      cached: false,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        logger.error("Request timeout", {
          timeout: FETCH_TIMEOUT,
          message: `External API is too slow (>${FETCH_TIMEOUT}ms)`,
        });

        return {
          success: false,
          error: `Request timeout. External API is too slow (>${FETCH_TIMEOUT}ms)`,
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
