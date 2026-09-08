import { logger } from "./logger";

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 5000;

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

export function validateTranslateInput(text: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!text || typeof text !== "string") {
    return {
      valid: false,
      error: "Campo 'text' é obrigatório e deve ser uma string.",
    };
  }

  if (text.trim().length === 0) {
    return {
      valid: false,
      error: "O texto não pode estar vazio.",
    };
  }

  return { valid: true };
}

export function validateConfig(): {
  valid: boolean;
  error?: string;
} {
  if (!ENDPOINT) {
    logger.error("NEXT_PUBLIC_API_URL não configurada");
    return {
      valid: false,
      error: "Configuração do servidor inválida.",
    };
  }

  return { valid: true };
}

export async function translate(request: TranslateRequest): Promise<TranslateResult> {
  const { text } = request;

  const validation = validateTranslateInput(text);
  if (!validation.valid) {
    logger.warn("Entrada inválida para tradução", { error: validation.error });
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

  try {
    logger.info("📤 Iniciando tradução", { 
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
      logger.error("Erro na resposta da API externa", {
        status: response.status,
        statusText: response.statusText,
      });

      return {
        success: false,
        error: `API externa retornou erro: ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();

    logger.success("✅ Tradução realizada com sucesso", {
      textLength: text.length,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        logger.error("⏱️ Timeout na requisição", {
          timeout: FETCH_TIMEOUT,
          message: `A API externa está muito lenta (>${FETCH_TIMEOUT}ms)`,
        });

        return {
          success: false,
          error: `Timeout na requisição. A API externa está muito lenta (>${FETCH_TIMEOUT}ms)`,
          statusCode: 504,
        };
      }

      logger.error("Erro ao processar tradução", {
        errorName: error.name,
        errorMessage: error.message,
      });

      return {
        success: false,
        error: `Erro ao processar tradução: ${error.message}`,
        statusCode: 500,
      };
    }

    logger.error("Erro desconhecido ao processar tradução", { error });
    return {
      success: false,
      error: "Erro desconhecido ao processar a tradução.",
      statusCode: 500,
    };
  }
}
