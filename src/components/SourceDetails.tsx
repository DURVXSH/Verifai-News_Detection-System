import React from 'react';
import { ExternalLink, Shield, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { DetailedSource } from '@/utils/types';

interface SourceDetailsProps {
  sources: DetailedSource[];
}

export const SourceDetails: React.FC<SourceDetailsProps> = ({ sources }) => {
  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getReliabilityLabel = (score: number) => {
    if (score >= 90) return 'Highly Reliable';
    if (score >= 70) return 'Moderately Reliable';
    return 'Exercise Caution';
  };

  return (
    <div className="space-y-4">
      {sources.map((source, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors">
          <div className="flex flex-col space-y-3">
            {/* Header with title and reliability */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium flex items-start gap-2 break-words leading-relaxed"
                >
                  <span className="break-words flex-1 min-w-0">
                    {source.title || new URL(source.url).hostname}
                  </span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
                </a>
              </div>
              <div className={`flex items-center gap-1 ${getReliabilityColor(source.reliability)} flex-shrink-0`}>
                {source.reliability >= 90 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium whitespace-nowrap">
                  {getReliabilityLabel(source.reliability)}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {source.publishDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {new Date(source.publishDate).toLocaleDateString()}
                  </span>
                </span>
              )}
              {source.author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{source.author}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Trust Score: {source.reliability}%</span>
              </span>
            </div>

            {/* Snippet if available */}
            {source.snippet && (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3">
                <p className="break-words leading-relaxed">{source.snippet}</p>
              </div>
            )}

            {/* Verification details */}
            <div className="space-y-2">
              {source.verificationDetails.map((detail, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="break-words leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {sources.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
            <p>No verified sources available for this content.</p>
          </div>
        </div>
      )}
    </div>
  );
}