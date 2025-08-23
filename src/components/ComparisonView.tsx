import React from 'react';
import { AnalysisResult } from '@/utils/newsAnalyzer';
import { CredibilityMeter } from './CredibilityMeter';
import { Button } from './ui/button';
import { Download, Share2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

interface ComparisonViewProps {
  results: AnalysisResult[];
  texts: string[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ results, texts }) => {
  const exportToPDF = async () => {
    const element = document.getElementById('comparison-view');
    if (!element) return;

    try {
      const dataUrl = await htmlToImage.toPng(element);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('comparison-analysis.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  return (
    <div id="comparison-view" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Comparison</h2>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <div key={index} className="bg-card rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Source {index + 1}</h3>
            
            <div className="space-y-6">
              <div className="flex justify-center">
                <CredibilityMeter score={result.credibilityScore} />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Sentiment</h4>
                  <div className="text-sm text-muted-foreground">
                    {result.sentiment?.label} ({result.sentiment?.score.toFixed(2)})
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Readability</h4>
                  <div className="text-sm text-muted-foreground">
                    {result.readability?.level} (Score: {result.readability?.score})
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Bias Analysis</h4>
                  <div className="text-sm text-muted-foreground">
                    {result.bias?.explanation}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Findings</h4>
                  <div className="text-sm text-muted-foreground">
                    {result.factCheck.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};