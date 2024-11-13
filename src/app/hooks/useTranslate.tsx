import { useState } from "react";

export default function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);

  const translateText = async (input: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      console.log({ data });
      const result = converter(data);
      setTranslation(result);
    } catch (error) {
      setError("Error translating text");
    } finally {
      setIsLoading(false);
    }
  };

  return { translateText, isLoading, error, translation };
}

const converter = (data: TranslationResponse): Translation => {
  return {
    inputText: data.input[0],
    result: data.translation[0],
    from: {
      pronunciation: null,
    },
    examples: data.contextResults.results[0].sourceExamples,
  };
};
