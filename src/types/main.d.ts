interface StorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
}

interface Translation {
  result: string;
  inputText: string;
  from: {
    pronunciation: string | null;
  };
  examples: string[];
}

interface TranslationResponse {
  translation: string;
  pronunciation: string;
  examples: string[];
}
