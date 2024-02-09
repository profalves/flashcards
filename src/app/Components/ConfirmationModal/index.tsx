import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-black">{message}</p>
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Sim
              </button>
              <button
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
