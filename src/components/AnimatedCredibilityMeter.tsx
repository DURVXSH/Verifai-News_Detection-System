import React, { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface AnimatedCredibilityMeterProps {
  score: number;
}

export const AnimatedCredibilityMeter: React.FC<AnimatedCredibilityMeterProps> = ({ score }) => {
  const { t } = useTranslation();
  const [color, setColor] = useState({ r: 239, g: 68, b: 68 }); // Start with red
  const controls = useAnimation();

  useEffect(() => {
    // Animate color based on score
    let targetColor;
    if (score >= 80) {
      targetColor = { r: 34, g: 197, b: 94 }; // green
    } else if (score >= 60) {
      targetColor = { r: 234, g: 179, b: 8 }; // yellow
    } else {
      targetColor = { r: 239, g: 68, b: 68 }; // red
    }

    controls.start({
      backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
      transition: { duration: 1, ease: "easeInOut" }
    });

    setColor(targetColor);
  }, [score, controls]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
        className="relative"
      >
        <motion.div
          animate={controls}
          className="absolute inset-0 rounded-full blur-lg opacity-20"
        />
        <Gauge 
          className="w-16 h-16 relative"
          style={{
            color: `rgb(${color.r}, ${color.g}, ${color.b})`
          }}
        />
      </motion.div>
      
      <div className="text-2xl font-bold flex items-center gap-1">
        <motion.span
          style={{
            color: `rgb(${color.r}, ${color.g}, ${color.b})`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              color: `rgb(${color.r}, ${color.g}, ${color.b})`
            }}
            transition={{ duration: 1 }}
          >
            {score}
          </motion.span>
        </motion.span>
        <motion.span
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          /100
        </motion.span>
      </div>
      <motion.div
        className="text-sm text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {t('analysis.credibility.score')}
      </motion.div>
    </div>
  );
};