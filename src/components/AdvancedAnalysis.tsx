import React from 'react';
import { BarChart2, Brain, FileText, AlertTriangle, Camera, Share2, BookOpen } from 'lucide-react';
import { AnalysisResult } from '@/utils/types';

interface AdvancedAnalysisProps {
  result: AnalysisResult;
}

export const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Language Style Analysis */}
      {result.languageAnalysis && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Language Analysis</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium">Writing Style</p>
              <p className="text-sm text-muted-foreground">{result.languageAnalysis.languageStyle}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Technical Terms Used</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.languageAnalysis.jargonUsage.map((term, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expert Consensus */}
      {result.expertConsensus && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Expert Consensus</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Topic</p>
              <p className="text-sm text-muted-foreground">{result.expertConsensus.topic}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Consensus Level</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                result.expertConsensus.consensusLevel === 'High' ? 'bg-success/10 text-success' :
                result.expertConsensus.consensusLevel === 'Moderate' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {result.expertConsensus.consensusLevel} Consensus
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">Expert Sources</p>
              <ul className="mt-1 space-y-1">
                {result.expertConsensus.expertSources.map((source, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {source}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Claim Verification */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Claim Analysis</h3>
        </div>
        <div className="space-y-4">
          {result.factCheck.claimVerification.verifiedClaims.length > 0 && (
            <div>
              <p className="text-sm font-medium text-success mb-2">Verified Claims</p>
              <ul className="space-y-1">
                {result.factCheck.claimVerification.verifiedClaims.map((claim, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success">✓</span>
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {result.factCheck.claimVerification.unverifiedClaims.length > 0 && (
            <div>
              <p className="text-sm font-medium text-warning mb-2">Unverified Claims</p>
              <ul className="space-y-1">
                {result.factCheck.claimVerification.unverifiedClaims.map((claim, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Impact */}
      {result.socialMetrics && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Social Media Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Share Count</p>
              <p className="text-2xl font-bold">{result.socialMetrics.shareCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Engagement Rate</p>
              <p className="text-2xl font-bold">{result.socialMetrics.engagementRate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Spread Pattern</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                result.socialMetrics.spreadPattern === 'Organic' ? 'bg-success/10 text-success' :
                result.socialMetrics.spreadPattern === 'Bot-like' ? 'bg-destructive/10 text-destructive' :
                'bg-warning/10 text-warning'
              }`}>
                {result.socialMetrics.spreadPattern}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Analysis */}
      {result.imageAnalysis && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Image Analysis</h3>
          </div>
          <div className="space-y-4">
            {result.imageAnalysis.hasManipulationMarkers && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                <p className="text-sm font-medium">Potential Image Manipulation Detected</p>
                <ul className="mt-2 space-y-1">
                  {result.imageAnalysis.manipulationWarnings.map((warning, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.imageAnalysis.metadata && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Image Metadata</p>
                {result.imageAnalysis.metadata.source && (
                  <p className="text-sm text-muted-foreground">
                    Source: {result.imageAnalysis.metadata.source}
                  </p>
                )}
                {result.imageAnalysis.metadata.dateCreated && (
                  <p className="text-sm text-muted-foreground">
                    Date: {result.imageAnalysis.metadata.dateCreated}
                  </p>
                )}
                {result.imageAnalysis.metadata.location && (
                  <p className="text-sm text-muted-foreground">
                    Location: {result.imageAnalysis.metadata.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};