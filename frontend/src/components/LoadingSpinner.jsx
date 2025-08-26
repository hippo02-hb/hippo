import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Đang tải...", size = "default" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-orange-500 mb-4`} />
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingSpinner;