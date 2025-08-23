import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from './types';
import i18n from '../i18n';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeImage = async (imageData: string): Promise<AnalysisResult> => {
  try {
    // Convert base64 to Uint8Array
    const base64Data = imageData.split(',')[1];
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the image data
    const imageBlob = new Blob([bytes], { type: 'image/jpeg' });
    const imageFile = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    };

    // First, extract text from the image
    const extractionPrompt = `Extract all readable text from this image. Format it naturally with proper paragraphs and line breaks. Only include the actual text content, no descriptions or explanations.`;
    
    const extractionResult = await model.generateContent([extractionPrompt, imageFile]);
    const extractedText = extractionResult.response.text();

    // Now analyze the extracted text
    const analysisPrompt = `Analyze this article text in ${i18n.language === 'hi' ? 'Hindi' : 'English'} language. Provide a detailed analysis including credibility assessment, fact-checking, and content evaluation.

Your response must be a valid JSON object with this exact structure:
{
  "credibilityScore": number between 0 and 100,
  "isFactual": boolean,
  "explanation": string explaining the factual assessment,
  "warnings": string[] of potential issues,
  "suggestions": string[] of improvements,
  "sentiment": {
    "score": number between -1 and 1,
    "label": "negative" | "neutral" | "positive"
  },
  "readability": {
    "score": number between 0 and 100,
    "level": "Easy" | "Medium" | "Hard",
    "suggestions": string[]
  },
  "bias": {
    "score": number between 0 and 100,
    "type": string,
    "explanation": string
  }
}

Text to analyze: "${extractedText}"`;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();
    
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
      const analysis = JSON.parse(jsonString);

      // Calculate basic statistics
      const words = extractedText.trim().split(/\s+/);
      const sentences = extractedText.split(/[.!?]+/).filter(Boolean);
      const paragraphs = extractedText.split(/\n\s*\n/).filter(Boolean);
      
      const statistics = {
        wordCount: words.length,
        averageSentenceLength: Math.round(words.length / sentences.length),
        paragraphCount: paragraphs.length,
        complexWords: words.filter(word => word.length > 6).length,
        readingTimeMinutes: Math.ceil(words.length / 200),
        topKeywords: extractKeywords(extractedText),
        emotionalTone: {
          positive: countEmotionalWords(extractedText, 'positive'),
          negative: countEmotionalWords(extractedText, 'negative'),
          urgent: countEmotionalWords(extractedText, 'urgent')
        },
        uniqueWords: new Set(words.map(w => w.toLowerCase())).size,
        averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
      };

      return {
        credibilityScore: analysis.credibilityScore,
        warnings: analysis.warnings,
        suggestions: analysis.suggestions,
        factCheck: {
          isFactual: analysis.isFactual,
          explanation: analysis.explanation
        },
        sentiment: analysis.sentiment,
        readability: analysis.readability,
        bias: analysis.bias,
        statistics,
        extractedText
      };
    } catch (parseError) {
      console.error('Failed to parse analysis:', parseError);
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Image analysis failed:', error);
    throw error;
  }
};

// Helper function to extract keywords
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with']);
  const words = text.toLowerCase().split(/\W+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

// Helper function to count emotional words
function countEmotionalWords(text: string, type: 'positive' | 'negative' | 'urgent'): number {
  const emotionalWords = {
    positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive', 'success', 'breakthrough'],
    negative: ['bad', 'terrible', 'awful', 'horrible', 'poor', 'negative', 'failure', 'crisis'],
    urgent: ['breaking', 'urgent', 'emergency', 'crisis', 'immediately', 'critical', 'vital', 'crucial']
  };
  
  const words = text.toLowerCase().split(/\W+/);
  return words.filter(word => emotionalWords[type].includes(word)).length;
}