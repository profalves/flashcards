"use client";

import React, { Key, useEffect, useState } from "react";
import useTranslation from "./hooks/useTranslate";
import InputModal from "./Components/InputModal";
import FloatingButton from "./Components/FloatingButton";
import TranslationCard from "./Components/Card";
import Loading from "./Components/Loading";

const Home: React.FC<{ storageService: StorageService }> = ({
  storageService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { translateText, isLoading, error, translation } = useTranslation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTranslation = async (text: string) => {
    console.log({ text });
    await translateText(text);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setInputText(text);
    handleCloseModal();
  };

  const handleRemoveTranslation = (index: Key | null | undefined) => {
    const updatedTranslations = [...translations];
    updatedTranslations.splice(Number(index), 1);
    setTranslations(updatedTranslations);
  };

  useEffect(() => {
    if (translation?.result) {
      setTranslations((prevTranslations: Translation[]) => [
        ...prevTranslations,
        { ...translation, inputText },
      ]);
    }
  }, [inputText, translation]);

  useEffect(() => {
    if (translations.length) {
      storageService?.setItem("translations", translations);
    }
  }, [storageService, translations]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">FlashCards</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 card-section p-4">
          {translations
            .map((infos: any, index: React.Key | null | undefined) => (
              <TranslationCard
                key={index}
                translation={infos}
                onRemove={() => handleRemoveTranslation(index)}
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
    </div>
  );
};

export default Home;
