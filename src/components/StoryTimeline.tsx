import React from 'react';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '@/utils/types';

interface StoryTimelineProps {
  analyses: {
    id: string; // Add id to interface
    timestamp: string;
    result: AnalysisResult;
    text: string;
  }[];
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ analyses }) => {
  const sortedAnalyses = [...analyses].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getCredibilityTrend = () => {
    if (sortedAnalyses.length < 2) return 'neutral';
    const firstScore = sortedAnalyses[0].result.credibilityScore;
    const lastScore = sortedAnalyses[sortedAnalyses.length - 1].result.credibilityScore;
    return lastScore > firstScore ? 'improving' : lastScore < firstScore ? 'declining' : 'stable';
  };

  const trend = getCredibilityTrend();

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Story Evolution Timeline
        </h3>
        <div className="flex items-center gap-2">
          <TrendingUp className={`h-5 w-5 ${
            trend === 'improving' ? 'text-success' :
            trend === 'declining' ? 'text-destructive' :
            'text-muted-foreground'
          }`} />
          <span className="text-sm font-medium capitalize">{trend} credibility</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        
        {sortedAnalyses.map((analysis, index) => (
          <motion.div
            key={analysis.id} // Use the unique id instead of timestamp
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10 pb-8 last:pb-0"
          >
            <div className="absolute left-[14px] top-2 w-2 h-2 rounded-full bg-primary" />
            
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <time className="text-sm text-muted-foreground">
                  {new Date(analysis.timestamp).toLocaleDateString()} at{' '}
                  {new Date(analysis.timestamp).toLocaleTimeString()}
                </time>
                <span className="text-sm font-medium">
                  Score: {analysis.result.credibilityScore}%
                </span>
              </div>
              
              <p className="text-sm line-clamp-2">{analysis.text}</p>
              
              <div className="space-y-2">
                {analysis.result.warnings.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="text-sm space-y-1">
                      {analysis.result.warnings.map((warning, i) => (
                        <p key={`${analysis.id}-warning-${i}`} className="text-muted-foreground">{warning}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {analysis.result.factCheck.explanation}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};