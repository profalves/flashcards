import { ITranslationService, TranslationServiceResult } from "./types";

/**
 * Concrete implementation of ITranslationService using the new translation API.
 */
export class TranslationService implements ITranslationService {
  private apiUrl: string;
  private apiKey: string;
  private apiHost: string;
  private apiEndpoint: string;
  private from: string;
  private to: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
    this.apiHost = process.env.NEXT_PUBLIC_API_HOST || "";
    this.apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "";
    this.from = process.env.NEXT_PUBLIC_API_FROM_LANG || "eng";
    this.to = process.env.NEXT_PUBLIC_API_TO_LANG || "por";
  }

  /**
   * Translates the given text from one language to another using the API.
   * @param {string} text - The text to be translated.
   * @param {string} from - The source language code.
   * @param {string} to - The target language code.
   * @returns {Promise<TranslationServiceResult>} - A promise resolving to the translation result.
   */
  public async translate(
    text: string,
    from: string = this.from,
    to: string = this.to
  ): Promise<TranslationServiceResult> {
    const headers = new Headers({
      "x-apihub-key": this.apiKey,
      "x-apihub-host": this.apiHost,
      "x-apihub-endpoint": this.apiEndpoint,
      "Content-Type": "application/json",
    });

    const body = JSON.stringify({
      input: text,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${this.apiUrl}?translated_from=${from}&translated_to=${to}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        inputText: text,
        result,
      };
    } catch (error) {
      console.error("Error during translation:", error);
      throw new Error("Failed to translate text.");
    }
  }
}
