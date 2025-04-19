"use client";

import { useEffect, useState } from "react";

import TranslationCard from "./components/Card";
import FloatingButton from "./components/FloatingButton";
import InputModal from "./components/InputModal";
import Loading from "./components/Loading";
import MainContainer from "./components/MainContainer";

import useHealthCheck from "./hooks/useHealthCheck";
import useTranslation from "./hooks/useTranslate";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { translateText, isLoading, translation, error } = useTranslation();

  const { loading: isHealthCheckLoading, error: healthCheckError } =
    useHealthCheck();

  const isLoadingState = isLoading || isHealthCheckLoading;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleSaveTranslation = async (text: string) => {
    if (hasDuplicateTranslation(text)) {
      handleOpenModal();
      setErrorMessage("This text already exists");
      searchTranslation(text);
      return;
    }

    if (!text) {
      setErrorMessage("Please enter a text");
      return;
    }

    setErrorMessage("");
    handleCloseModal();

    try {
      await translateText(text);
    } catch (error) {
      handleOpenModal();
      if (error) {
        handleOpenModal();
        setErrorMessage(error.toString());
        return;
      }
      setErrorMessage("Error translating text: " + error);
      return;
    } finally {
      setInputText(text);
    }
  };

  const searchTranslation = (searchText: string) => {
    const foundTranslation = translations.findIndex(
      (translation) =>
        translation.inputText.toLowerCase() === searchText.toLowerCase()
    );
    if (foundTranslation !== -1) {
      const element = document.querySelector(
        `.card-section > div:nth-child(${
          translations.length - foundTranslation
        })`
      );
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasDuplicateTranslation = (inputText: string) =>
    translations.some((translation) => translation.inputText === inputText);

  const handleRemoveTranslation = (infos: Translation) => {
    const updatedTranslations = translations.filter(
      (card) => infos.inputText !== card.inputText
    );
    setTranslations(updatedTranslations);
    window.localStorage.setItem(
      "translations",
      JSON.stringify(updatedTranslations)
    );
  };

  useEffect(() => {
    const data = window.localStorage.getItem("translations");

    if (data) {
      setTranslations(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (translation) {
      setTranslations((prevTranslations: Translation[]) => [
        ...prevTranslations,
        { ...translation, inputText },
      ]);
    }
  }, [inputText, translation]);

  useEffect(() => {
    if (translations.length) {
      window.localStorage.setItem("translations", JSON.stringify(translations));
    }
  }, [translations]);

  if (healthCheckError) {
    return (
      <MainContainer>
        <h1 className="text-3xl font-bold my-8 text-center mx-4">
          ⚠️ {healthCheckError}
        </h1>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <h1 className="text-3xl font-bold my-8">🇺🇸 FlashCards 🇬🇧</h1>
      {isLoadingState ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 card-section p-4">
          {translations
            .map((infos, index) => (
              <TranslationCard
                key={index}
                translation={infos}
                onRemove={() => handleRemoveTranslation(infos)}
              />
            ))
            .reverse()}
        </div>
      )}
      <FloatingButton onClick={handleOpenModal} />
      <InputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveTranslation}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </MainContainer>
  );
}
