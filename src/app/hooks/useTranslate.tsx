import { useState } from "react";

const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<Translation | any>({});

  const translateText = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/translate?text=${text}`);
      const data = await response.json();
      setTranslation(data);
    } catch (error) {
      setError("Error translating text");
    } finally {
      setIsLoading(false);
    }
  };

  return { translateText, isLoading, error, translation };
};

export default useTranslation;
