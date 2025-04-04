/**
 * Converts the raw API response data into the expected Translation format.
 * @param data - The raw data returned from the translation API.
 * @param inputText - The original input text that was translated.
 * @returns {Translation} - The formatted translation object.
 */
export function converter(
  data: TranslationResponse,
  inputText: string
): Translation {
  return {
    inputText,
    result: data.translation,
    from: {
      pronunciation: data.pronunciation,
    },
    examples: data.examples,
  };
}
