// src/components/Tooltip.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-10 px-3 py-1 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};