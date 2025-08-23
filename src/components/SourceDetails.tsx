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
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-start justify-between gap-4">
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium flex items-center gap-2 break-all"
                >
                  {source.title || new URL(source.url).hostname}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
                <div className={`flex items-center gap-1 ${getReliabilityColor(source.reliability)} whitespace-nowrap`}>
                  {source.reliability >= 90 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {getReliabilityLabel(source.reliability)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {source.publishDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(source.publishDate).toLocaleDateString()}
                  </span>
                )}
                {source.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {source.author}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Trust Score: {source.reliability}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {source.verificationDetails.map((detail, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {sources.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No verified sources available for this content.
        </div>
      )}
    </div>
  );
}