import React from 'react';
import { GitCompare } from 'lucide-react';

interface SimilarityMatrixProps {
  texts: string[];
  results: Array<{
    credibilityScore: number;
    factCheck: {
      explanation: string;
    };
  }>;
}

export const SimilarityMatrix: React.FC<SimilarityMatrixProps> = ({ texts, results }) => {
  const calculateSimilarity = (text1: string, text2: string) => {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return (intersection.size / union.size) * 100;
  };

  const similarities = texts.map((text1, i) =>
    texts.map((text2, j) => {
      if (i === j) return 100;
      return calculateSimilarity(text1, text2);
    })
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-primary" />
        Content Similarity Analysis
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-medium text-muted-foreground p-2"></th>
              {texts.map((_, i) => (
                <th key={i} className="text-sm font-medium text-muted-foreground p-2">
                  Version {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {similarities.map((row, i) => (
              <tr key={i}>
                <td className="text-sm font-medium text-muted-foreground p-2">
                  Version {i + 1}
                </td>
                {row.map((similarity, j) => (
                  <td
                    key={j}
                    className={`text-sm p-2 text-center ${
                      i === j
                        ? 'bg-primary/10 text-primary font-medium'
                        : similarity > 70
                        ? 'bg-success/10 text-success'
                        : similarity > 40
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {similarity.toFixed(1)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {texts.map((text, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Version {i + 1}</h4>
              <span className="text-sm text-muted-foreground">
                Score: {results[i].credibilityScore}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};