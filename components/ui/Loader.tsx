import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoaderProps {
  className?: string;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ className = '', size = 20 }) => {
  return (
    <FiLoader 
      size={size} 
      className={`animate-spin ${className}`} 
    />
  );
};
