import React from 'react';
import { BarChart2, Clock, Hash, KeyRound, Type } from 'lucide-react';
import { ContentStatistics } from '@/utils/types';

interface ContentStatsProps {
  statistics: ContentStatistics;
}

export const ContentStats: React.FC<ContentStatsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Word Count</h4>
        </div>
        <p className="text-2xl font-bold">{statistics.wordCount}</p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Reading Time</h4>
        </div>
        <p className="text-2xl font-bold">{statistics.readingTimeMinutes} min</p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Avg. Sentence</h4>
        </div>
        <p className="text-2xl font-bold">{statistics.averageSentenceLength} words</p>
      </div>
      
      <div className="col-span-2 md:col-span-3 bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Top Keywords</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {statistics.topKeywords.map((keyword, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}