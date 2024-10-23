import {
  ITranslationService,
  Translation,
  TranslationResponse,
} from "@/pages/api/translation/types";
import { converter } from "@/utils/converters/translationConverter";
import { useState } from "react";

/**
 * Hook that manages text translation using a provided translation service.
 * @param {ITranslationService} service - The translation service implementing ITranslationService interface.
 */
export default function useTranslation(service: ITranslationService) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);

  /**
   * Function that requests text translation using the injected translation service.
   * @param {string} text - The text to be translated.
   * @param {string} from - The source language code.
   * @param {string} to - The target language code.
   */

  const translateText = async (text: string, from: string, to: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.translate(text, from, to);

      const translationResponse: TranslationResponse = JSON.parse(
        response.result
      );

      console.log({ response, translationResponse });
      const translation = converter(translationResponse, text);

      setTranslation(translation);
    } catch (err) {
      setError("Error translating text.");
    } finally {
      setIsLoading(false);
    }
  };

  return { translateText, isLoading, error, translation };
}
