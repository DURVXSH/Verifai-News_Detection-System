import React, { useMemo } from 'react';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { AnalysisResult } from '@/utils/types';

interface PatternAnalysisProps {
  analyses: {
    id: string;
    timestamp: string;
    result: AnalysisResult;
    text: string;
  }[];
}

export const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ analyses }) => {
  const patterns = useMemo(() => {
    if (analyses.length < 2) return null;

    const commonKeywords = new Set(
      analyses[0].result.statistics.topKeywords.filter(keyword =>
        analyses.every(analysis =>
          analysis.result.statistics.topKeywords.includes(keyword)
        )
      )
    );

    const credibilityTrend = analyses.reduce(
      (acc, curr, idx, arr) => {
        if (idx === 0) return acc;
        const prevScore = arr[idx - 1].result.credibilityScore;
        const currScore = curr.result.credibilityScore;
        const diff = currScore - prevScore;
        
        if (Math.abs(diff) > 10) {
          acc.significantChanges.push({
            timestamp: curr.timestamp,
            change: diff,
            reason: curr.result.factCheck.explanation
          });
        }
        return acc;
      },
      { significantChanges: [] as Array<{ timestamp: string; change: number; reason: string }> }
    );

    const commonWarnings = analyses.reduce((acc, curr) => {
      curr.result.warnings.forEach(warning => {
        acc[warning] = (acc[warning] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      commonKeywords: Array.from(commonKeywords),
      credibilityTrend,
      commonWarnings: Object.entries(commonWarnings)
        .filter(([_, count]) => count > 1)
        .sort(([_, a], [__, b]) => b - a)
    };
  }, [analyses]);

  if (!patterns || analyses.length < 2) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground text-sm">
          Add more analyses to detect patterns and trends.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Pattern Analysis
      </h3>

      <div className="grid gap-6">
        {/* Common Keywords */}
        {patterns.commonKeywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Consistent Themes
            </h4>
            <div className="flex flex-wrap gap-2">
              {patterns.commonKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Significant Changes */}
        {patterns.credibilityTrend.significantChanges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Significant Changes
            </h4>
            <div className="space-y-3">
              {patterns.credibilityTrend.significantChanges.map((change, index) => (
                <div key={index} className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={change.change > 0 ? 'text-success' : 'text-destructive'}>
                      {change.change > 0 ? '+' : ''}{change.change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      on {new Date(change.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{change.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Warnings */}
        {patterns.commonWarnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Recurring Issues
            </h4>
            <div className="space-y-2">
              {patterns.commonWarnings.map(([warning, count], index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-warning text-sm">{count}×</span>
                  <span className="text-sm text-muted-foreground">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};