import {
  Translation,
  TranslationResponse,
} from "@/pages/api/translation/types";

/**
 * Converts the raw API response data into the expected Translation format.
 * @param data - The raw data returned from the translation API.
 * @param inputText - The original input text that was translated.
 * @returns {Translation} - The formatted translation object.
 */
export function converter(
  data: TranslationResponse,
  input: string
): Translation {
  return {
    result: data.translation[0] ?? "", // Main translated text
    examples: Array.isArray(data.contextResults.results[0].sourceExamples)
      ? data.contextResults.results[0].sourceExamples
      : [], // List of source examples if provided by the API
    inputText: input ?? data.input[0], // Original input text
    from: {
      pronunciation: data.pronunciation ?? "", // Pronunciation, if provided by the API
    },
  };
}
