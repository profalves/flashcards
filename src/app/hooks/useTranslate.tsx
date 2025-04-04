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
      const data = await response.json();
      const result = converter(data, text);
      setTranslation(result);
    } catch (error) {
      setError("Error translating text");
    } finally {
      setIsLoading(false);
    }
  };

  return { translateText, isLoading, error, translation };
}
