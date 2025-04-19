import { converter } from "@/utils/converters/translationConverter";
import { useState } from "react";
import { text } from "stream/consumers";

export default function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);

  const translateText = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch translation");
      }

      const data = await response.json();

      const result = converter(data, text);

      if (!result || !result.result) {
        setError("Failed to convert translation data");
      }

      if (result.result === text) {
        setError(
          "Translation is the same as input text or no translation found"
        );
      }

      if (result.result === "") {
        setError("Translation result is empty");
      }

      setTranslation(result);
    } catch (error) {
      setError(
        "Error translating text: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { translateText, isLoading, error, translation };
}
