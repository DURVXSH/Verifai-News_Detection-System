import React, { useState } from 'react';
import QRCode from 'qrcode';
import { FileDown, Share2, Badge, Check, Copy, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { AnalysisResult } from '@/utils/types';
import * as htmlToImage from 'html-to-image';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

interface ReportGeneratorProps {
  result: AnalysisResult;
  text: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ result, text }) => {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share !== 'undefined' && window.isSecureContext;
  const { t, i18n } = useTranslation();

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
      const verificationData = {
        text: text.substring(0, 100) + '...',
        credibilityScore: result.credibilityScore,
        timestamp: new Date().toISOString(),
        warnings: result.warnings,
        suggestions: result.suggestions,
      };
      const qrCode = await generateQRCode(JSON.stringify(verificationData));

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: i18n.language === 'hi' ? "एआई फेक न्यूज विश्लेषण रिपोर्ट" : "AI Fake News Analysis Report",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${i18n.language === 'hi' ? 'रिपोर्ट जनरेट की गई' : 'Report Generated'}: ${new Date().toLocaleString()}`,
                  size: 20,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            new Paragraph({
              text: i18n.language === 'hi' ? "विश्वसनीयता मूल्यांकन" : "Credibility Assessment",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${i18n.language === 'hi' ? 'स्कोर' : 'Score'}: ${result.credibilityScore}/100`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            new Paragraph({
              text: i18n.language === 'hi' ? "विश्लेषित सामग्री" : "Analyzed Content",
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

            new Paragraph({
              text: i18n.language === 'hi' ? "तथ्यात्मक मूल्यांकन" : "Factual Assessment",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.factCheck.isFactual ? 
                    (i18n.language === 'hi' ? "✓ सत्यापित" : "✓ Verified") : 
                    (i18n.language === 'hi' ? "⚠ असत्यापित" : "⚠ Unverified"),
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

            new Paragraph({
              text: i18n.language === 'hi' ? "सामग्री आंकड़े" : "Content Statistics",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun(i18n.language === 'hi' ? "शब्द गणना: " : "Word Count: "),
                new TextRun({
                  text: `${result.statistics.wordCount}\n`,
                  bold: true,
                }),
                new TextRun(i18n.language === 'hi' ? "पढ़ने का समय: " : "Reading Time: "),
                new TextRun({
                  text: `${result.statistics.readingTimeMinutes} ${i18n.language === 'hi' ? 'मिनट' : 'minutes'}\n`,
                  bold: true,
                }),
                new TextRun(i18n.language === 'hi' ? "औसत वाक्य लंबाई: " : "Average Sentence Length: "),
                new TextRun({
                  text: `${result.statistics.averageSentenceLength} ${i18n.language === 'hi' ? 'शब्द' : 'words'}\n`,
                  bold: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            ...(result.warnings.length > 0 ? [
              new Paragraph({
                text: i18n.language === 'hi' ? "चेतावनियां" : "Warnings",
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

            ...(result.suggestions.length > 0 ? [
              new Paragraph({
                text: i18n.language === 'hi' ? "सुझाव" : "Suggestions",
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

            new Paragraph({
              text: i18n.language === 'hi' ? "एआई फेक न्यूज डिटेक्टर द्वारा जनरेट किया गया" : "Generated by AI Fake News Detector",
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 400,
              },
            }),
          ],
        }],
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, i18n.language === 'hi' ? 'फेक-न्यूज-विश्लेषण.docx' : 'fake-news-analysis.docx');
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
    ctx.fillText(i18n.language === 'hi' ? 'विश्वसनीयता स्कोर' : 'Credibility Score', 100, 120);

    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText(
      badgeData.verified ? 
        (i18n.language === 'hi' ? 'सत्यापित' : 'VERIFIED') : 
        (i18n.language === 'hi' ? 'असत्यापित' : 'UNVERIFIED'), 
      100, 
      140
    );

    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), 100, 160);

    const link = document.createElement('a');
    link.download = i18n.language === 'hi' ? 'सत्यापन-बैज.png' : 'verification-badge.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getShareText = () => {
    return i18n.language === 'hi' ? 
      `सामग्री विश्लेषण परिणाम:

विश्वसनीयता स्कोर: ${result.credibilityScore}/100
तथ्यात्मक मूल्यांकन: ${result.factCheck.isFactual ? '✓ सत्यापित' : '⚠ असत्यापित'}

मुख्य निष्कर्ष:
${result.factCheck.explanation}

विश्लेषण विवरण:
${result.sentiment ? `- भावना: ${result.sentiment.label} (${result.sentiment.score.toFixed(2)})` : ''}
${result.readability ? `- पठनीयता: ${result.readability.level} (स्कोर: ${result.readability.score})` : ''}
${result.bias ? `- पक्षपात मूल्यांकन: ${result.bias.explanation}` : ''}

एआई फेक न्यूज डिटेक्टर द्वारा जनरेट किया गया` :
      `Content Analysis Results:

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
          title: i18n.language === 'hi' ? 'एआई फेक न्यूज विश्लेषण' : 'AI Fake News Analysis',
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
          {i18n.language === 'hi' ? 'वर्ड में निर्यात करें' : 'Export to Word'}
        </Button>
        <Button onClick={generateVerificationBadge} variant="outline" className="flex items-center gap-2">
          <Badge className="h-4 w-4" />
          {i18n.language === 'hi' ? 'सत्यापन बैज प्राप्त करें' : 'Get Verification Badge'}
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {i18n.language === 'hi' ? 'कॉपी किया गया!' : 'Copied!'}
            </>
          ) : (
            <>
              {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {canShare ? 
                (i18n.language === 'hi' ? 'विश्लेषण साझा करें' : 'Share Analysis') : 
                (i18n.language === 'hi' ? 'विश्लेषण कॉपी करें' : 'Copy Analysis')}
            </>
          )}
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">{i18n.language === 'hi' ? 'रिपोर्ट के बारे में' : 'About Reports'}</h3>
        <p className="text-sm text-muted-foreground">
          {i18n.language === 'hi' ? 
            'वर्ड दस्तावेज़ों में विस्तृत विश्लेषण, सत्यापन QR कोड और टाइमस्टैम्प वाले परिणाम शामिल हैं। सत्यापन बैज को वेबसाइटों में एम्बेड किया जा सकता है या सोशल मीडिया पर साझा किया जा सकता है।' : 
            'Word documents include detailed analysis, verification QR code, and timestamped results. Verification badges can be embedded in websites or shared on social media.'}
        </p>
      </div>
    </div>
  );
};