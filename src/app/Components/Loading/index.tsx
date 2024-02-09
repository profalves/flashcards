import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default LoadingSpinner;
