import React, { useState } from 'react';
import QRCode from 'qrcode';
import { FileDown, Share2, Badge, Check, Copy, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { AnalysisResult } from '@/utils/types';
import * as htmlToImage from 'html-to-image';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';

interface ReportGeneratorProps {
  result: AnalysisResult;
  text: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ result, text }) => {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share !== 'undefined' && window.isSecureContext;

  const generateQRCode = async (data: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('QR Code generation failed:', err);
      return '';
    }
  };

  const generateWordDoc = async () => {
    try {
      // Create verification QR code
      const verificationData = {
        text: text.substring(0, 100) + '...',
        credibilityScore: result.credibilityScore,
        timestamp: new Date().toISOString(),
        warnings: result.warnings,
        suggestions: result.suggestions,
      };
      const qrCode = await generateQRCode(JSON.stringify(verificationData));

      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "AI Fake News Analysis Report",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            // Report Info
            new Paragraph({
              children: [
                new TextRun({
                  text: `Report Generated: ${new Date().toLocaleString()}`,
                  size: 20,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Credibility Score
            new Paragraph({
              text: "Credibility Assessment",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Score: ${result.credibilityScore}/100`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Analyzed Content
            new Paragraph({
              text: "Analyzed Content",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              text: text,
              spacing: {
                after: 200,
              },
            }),

            // Factual Assessment
            new Paragraph({
              text: "Factual Assessment",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.factCheck.isFactual ? "✓ Verified" : "⚠ Unverified",
                  bold: true,
                  color: result.factCheck.isFactual ? "008000" : "FF0000",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
            new Paragraph({
              text: result.factCheck.explanation,
              spacing: {
                after: 400,
              },
            }),

            // Statistics
            new Paragraph({
              text: "Content Statistics",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun("Word Count: "),
                new TextRun({
                  text: `${result.statistics.wordCount}\n`,
                  bold: true,
                }),
                new TextRun("Reading Time: "),
                new TextRun({
                  text: `${result.statistics.readingTimeMinutes} minutes\n`,
                  bold: true,
                }),
                new TextRun("Average Sentence Length: "),
                new TextRun({
                  text: `${result.statistics.averageSentenceLength} words\n`,
                  bold: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Warnings
            ...(result.warnings.length > 0 ? [
              new Paragraph({
                text: "Warnings",
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),
              ...result.warnings.map(
                warning =>
                  new Paragraph({
                    text: `• ${warning}`,
                    spacing: {
                      after: 100,
                    },
                  })
              ),
            ] : []),

            // Suggestions
            ...(result.suggestions.length > 0 ? [
              new Paragraph({
                text: "Suggestions",
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),
              ...result.suggestions.map(
                suggestion =>
                  new Paragraph({
                    text: `• ${suggestion}`,
                    spacing: {
                      after: 100,
                    },
                  })
              ),
            ] : []),

            // Sources
            ...(result.factCheck.sources ? [
              new Paragraph({
                text: "Verified Sources",
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),
              ...result.factCheck.sources.map(source => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: source.title,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text: source.url,
                          style: "Hyperlink",
                        }),
                      ],
                      link: source.url,
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                }),
              ]).flat(),
            ] : []),

            // Footer
            new Paragraph({
              text: "Generated by AI Fake News Detector",
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 400,
              },
            }),
          ],
        }],
      });

      // Generate and save document
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, 'fake-news-analysis.docx');
    } catch (error) {
      console.error('Word document generation failed:', error);
    }
  };

  const generateVerificationBadge = async () => {
    const badgeData = {
      score: result.credibilityScore,
      date: new Date().toISOString(),
      verified: result.credibilityScore >= 80,
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    ctx.scale(2, 2);

    const gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 90);
    if (badgeData.verified) {
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(1, '#16a34a');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${badgeData.score}`, 100, 85);

    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('Credibility Score', 100, 120);

    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText(badgeData.verified ? 'VERIFIED' : 'UNVERIFIED', 100, 140);

    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), 100, 160);

    const link = document.createElement('a');
    link.download = 'verification-badge.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getShareText = () => {
    return `Content Analysis Results:

Credibility Score: ${result.credibilityScore}/100
Factual Assessment: ${result.factCheck.isFactual ? '✓ Verified' : '⚠ Unverified'}

Key Findings:
${result.factCheck.explanation}

Analysis Details:
${result.sentiment ? `- Sentiment: ${result.sentiment.label} (${result.sentiment.score.toFixed(2)})` : ''}
${result.readability ? `- Readability: ${result.readability.level} (Score: ${result.readability.score})` : ''}
${result.bias ? `- Bias Assessment: ${result.bias.explanation}` : ''}

Generated by AI Fake News Detector`;
  };

  const handleShare = async () => {
    const shareText = getShareText();

    try {
      if (canShare) {
        await navigator.share({
          title: 'AI Fake News Analysis',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={generateWordDoc} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export to Word
        </Button>
        <Button onClick={generateVerificationBadge} variant="outline" className="flex items-center gap-2">
          <Badge className="h-4 w-4" />
          Get Verification Badge
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {canShare ? 'Share Analysis' : 'Copy Analysis'}
            </>
          )}
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">About Reports</h3>
        <p className="text-sm text-muted-foreground">
          Word documents include detailed analysis, verification QR code, and timestamped results.
          Verification badges can be embedded in websites or shared on social media.
        </p>
      </div>
    </div>
  );
};