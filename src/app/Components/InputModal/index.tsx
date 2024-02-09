import React, { useState } from "react";

interface InputModalProps {
  isOpen: boolean;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  errorMessage,
  ...rest
}) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 p-2 mb-2 w-full text-gray-800 placeholder-gray-500"
          placeholder="Digite aqui..."
          {...rest}
        />
        <div className="flex justify-end">
          <span className="text-red-700 mr-2">{errorMessage}</span>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              isLoading ? `bg-gray-300` : `bg-blue-500`
            }  text-white rounded`}
            disabled={isLoading}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
