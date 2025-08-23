import * as tf from '@tensorflow/tfjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, ContentStatistics, ImageAnalysis } from './types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define trusted news sources with their search URLs
const TRUSTED_SOURCES = {
  reuters: {
    domain: 'reuters.com',
    searchUrl: 'https://www.reuters.com/site-search/?query=',
    reliability: 95
  },
  ap: {
    domain: 'apnews.com',
    searchUrl: 'https://apnews.com/search?q=',
    reliability: 95
  },
  bbc: {
    domain: 'bbc.com',
    searchUrl: 'https://www.bbc.co.uk/search?q=',
    reliability: 90
  },
  nature: {
    domain: 'nature.com',
    searchUrl: 'https://www.nature.com/search?q=',
    reliability: 98
  },
  who: {
    domain: 'who.int',
    searchUrl: 'https://www.who.int/home/search?indexCatalogue=genericsearchindex1&searchQuery=',
    reliability: 95
  }
};

// Enhanced content statistics with more metrics
const calculateContentStatistics = (text: string): ContentStatistics => {
  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const readingTimeMinutes = Math.ceil(words.length / 200);
  
  // Enhanced keyword extraction with TF-IDF
  const wordFrequency = words.reduce((acc: Record<string, number>, word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanWord.length > 3) {
      acc[cleanWord] = (acc[cleanWord] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Calculate emotional tone indicators
  const emotionalWords = {
    positive: ['good', 'great', 'excellent', 'amazing', 'wonderful'],
    negative: ['bad', 'terrible', 'awful', 'horrible', 'poor'],
    urgent: ['breaking', 'urgent', 'emergency', 'crisis', 'immediately']
  };

  const emotionalTone = Object.entries(emotionalWords).reduce((acc, [tone, words]) => {
    const count = words.reduce((sum, word) => 
      sum + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0), 0);
    return { ...acc, [tone]: count };
  }, {} as Record<string, number>);

  const topKeywords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return {
    wordCount: words.length,
    averageSentenceLength: Math.round(words.length / sentences.length),
    paragraphCount: paragraphs.length,
    complexWords: words.filter(word => word.length > 6).length,
    readingTimeMinutes,
    topKeywords,
    emotionalTone,
    uniqueWords: Object.keys(wordFrequency).length,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
  };
};

// Function to get search URLs for relevant articles based on content
const getRelevantArticleSearches = (keywords: string[]): Array<{url: string, title: string, reliability: number}> => {
  const searchQuery = encodeURIComponent(keywords.slice(0, 3).join(' '));
  
  return [
    {
      url: `${TRUSTED_SOURCES.reuters.searchUrl}${searchQuery}`,
      title: 'Search Reuters for related articles',
      reliability: TRUSTED_SOURCES.reuters.reliability
    },
    {
      url: `${TRUSTED_SOURCES.ap.searchUrl}${searchQuery}`,
      title: 'Find related AP News coverage',
      reliability: TRUSTED_SOURCES.ap.reliability
    },
    {
      url: `${TRUSTED_SOURCES.bbc.searchUrl}${searchQuery}`,
      title: 'Search BBC News for similar stories',
      reliability: TRUSTED_SOURCES.bbc.reliability
    }
  ];
};

// New function to detect potential timeline inconsistencies
const analyzeTimeline = (text: string) => {
  const datePattern = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?\s*,?\s*\d{4}\b/gi;
  const dates = text.match(datePattern) || [];
  
  return {
    datesFound: dates,
    hasInconsistencies: dates.length > 1 && new Set(dates).size !== dates.length,
    timespan: dates.length > 0 ? {
      earliest: new Date(dates[0]),
      latest: new Date(dates[dates.length - 1])
    } : null
  };
};

// New function to analyze citation patterns
const analyzeCitations = (text: string) => {
  const citations = {
    academic: text.match(/\b(?:doi:|10\.\d{4,}\/[-._;()\/:A-Z0-9]+)\b/gi) || [],
    quotes: text.match(/"([^"]*)"|\u201C([^\u201D]*)\u201D/g) || [],
    urls: text.match(/https?:\/\/[^\s<>)"]+/g) || []
  };

  return {
    hasCitations: Object.values(citations).some(arr => arr.length > 0),
    citationCount: Object.values(citations).reduce((sum, arr) => sum + arr.length, 0),
    citations
  };
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return {
      credibilityScore: 0,
      warnings: ['API key not configured. Please add your Gemini API key to the .env file.'],
      suggestions: ['Get an API key from Google AI Studio (https://makersuite.google.com/app/apikey)'],
      factCheck: {
        isFactual: false,
        explanation: 'Unable to perform analysis: Missing API key'
      },
      statistics: calculateContentStatistics(text)
    };
  }

  const warnings: string[] = [];
  const suggestions: string[] = [];
  let credibilityScore = 100;

  const statistics = calculateContentStatistics(text);
  const timelineAnalysis = analyzeTimeline(text);
  const citationAnalysis = analyzeCitations(text);

  // Add warnings based on enhanced analysis
  if (timelineAnalysis.hasInconsistencies) {
    warnings.push('Potential timeline inconsistencies detected in the dates mentioned.');
    credibilityScore -= 15;
  }

  if (!citationAnalysis.hasCitations) {
    warnings.push('No citations or external references found.');
    suggestions.push('Consider adding references to support the claims.');
    credibilityScore -= 10;
  }

  if (statistics.emotionalTone.urgent > 2) {
    warnings.push('High usage of urgency-indicating language detected.');
    suggestions.push('Check if the urgency is warranted by the facts.');
    credibilityScore -= 5;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a fact-checking system that ONLY responds with valid JSON.

Your task is to analyze the following news article for credibility and misinformation.

CRITICAL: Your response MUST be a single JSON object with EXACTLY this structure:
{
  "isFactual": boolean,
  "credibilityScore": number between 0 and 100,
  "warnings": string[],
  "explanation": string,
  "suggestions": string[],
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

Article to analyze: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();
    
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      analysis = JSON.parse(jsonString);
      
      // Get search URLs for relevant articles based on content keywords
      const relevantSources = getRelevantArticleSearches(statistics.topKeywords);
      
      // Add verification details for each source
      const sources = relevantSources.map(source => ({
        ...source,
        verificationDetails: [
          "Click to search for related articles from this trusted source",
          "Compare the content with verified news coverage",
          "Check dates and details for accuracy",
          "Verify claims against multiple sources"
        ]
      }));

      return {
        credibilityScore: Math.min(100, Math.max(0, analysis.credibilityScore)),
        warnings: [...new Set(warnings.concat(analysis.warnings))],
        suggestions: [...new Set(suggestions.concat(analysis.suggestions))],
        factCheck: {
          isFactual: analysis.isFactual,
          explanation: analysis.explanation,
          sources
        },
        sentiment: analysis.sentiment,
        readability: analysis.readability,
        bias: analysis.bias,
        statistics,
        timeline: timelineAnalysis,
        citations: citationAnalysis
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error(`Invalid response format: ${parseError.message}`);
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    return {
      credibilityScore: 0,
      warnings: [
        'Unable to perform analysis due to an API error.',
        'Please ensure your API key is valid and has sufficient quota.'
      ],
      suggestions: [
        'Check your API key configuration',
        'Try again in a few moments',
        'If the problem persists, verify your API key at https://makersuite.google.com/app/apikey'
      ],
      factCheck: {
        isFactual: false,
        explanation: 'Analysis unavailable: ' + (error.message || 'API Error')
      },
      statistics,
      timeline: timelineAnalysis,
      citations: citationAnalysis
    };
  }
};