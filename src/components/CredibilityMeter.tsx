import React from 'react';
import { Gauge } from 'lucide-react';

interface CredibilityMeterProps {
  score: number;
}

export const CredibilityMeter: React.FC<CredibilityMeterProps> = ({ score }) => {
  const getColorClass = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Gauge className={`w-16 h-16 ${getColorClass()}`} />
      <div className="text-2xl font-bold">
        <span className={getColorClass()}>{score}</span>
        <span className="text-gray-500">/100</span>
      </div>
      <div className="text-sm text-gray-600">
        Credibility Score
      </div>
    </div>
  );
};