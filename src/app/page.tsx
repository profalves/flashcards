"use client";
import React, { useState } from "react";
import useTranslation from "./hooks/useTranslate";
import InputModal from "./Components/InputModal";
import FloatingButton from "./Components/FloatingButton";
import TranslationCard from "./Components/Card";

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translations, setTranslations] = useState<T[]>([]);
  const { translateText, isLoading, error, translation } = useTranslation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTranslation = async (text: string) => {
    await translateText(text);
    setTranslations([...translations, translation]);
    handleCloseModal();
  };

  console.log({ translations });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Translation App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {translations.map((infos, index) => (
          <TranslationCard key={index} translation={infos} />
        ))}
      </div>
      <FloatingButton onClick={handleOpenModal} />
      <InputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveTranslation}
      />
    </div>
  );
};

export default Home;
