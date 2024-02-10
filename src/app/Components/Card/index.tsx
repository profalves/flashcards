import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";

interface CardProps {
  translation: Translation;
  onRemove: () => void;
}

const Card: React.FC<CardProps> = ({ translation, onRemove }) => {
  const [isFront, setIsFront] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsFront(!isFront);
  };

  const handleRemove = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-40 bg-gray-800 text-white p-4 rounded shadow-md mb-4">
      {isFront ? (
        <div
          className="grid place-content-center w-full h-full"
          onClick={handleClick}
        >
          <p className="text-4xl font-bold">{translation?.inputText}</p>
        </div>
      ) : (
        <section onClick={handleClick}>
          <div className="flex justify-between flex-wrap">
            <p className="text-4xl font-bold cursor-pointer ">
              {translation?.result}
            </p>
            <p className="flex items-end">
              (pron. <i>&quot;{translation?.from?.pronunciation}&quot;</i>)
            </p>
          </div>
          <hr className="text-white" />
          <ul className="flex flex-col py-2">
            {translation?.examples?.map((example, index) => (
              <code key={index}>* {example}</code>
            ))}
          </ul>
        </section>
      )}
      <button
        className="text-gray-200 bg-gray-500 p-2 rounded"
        onClick={handleRemove}
      >
        Excluir
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={onRemove}
        message="Deseja realmente excluir este card?"
      />
    </div>
  );
};

export default Card;
