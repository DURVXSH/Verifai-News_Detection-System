import * as tf from '@tensorflow/tfjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, ContentStatistics, ImageAnalysis } from './types';
import i18n from '../i18n';

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

// Enhanced content statistics with Gemini-powered keyword extraction
const calculateContentStatistics = async (text: string): Promise<ContentStatistics> => {
  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const readingTimeMinutes = Math.ceil(words.length / 200);

  // Use Gemini to extract keywords
  let topKeywords: string[] = [];
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze this text and extract the 5 most important keywords or key phrases that best represent its main topics and themes. Consider both single words and multi-word phrases. Format your response as a JSON array of strings.

Text to analyze: "${text}"

Response format example:
["artificial intelligence", "climate change", "renewable energy", "policy reform", "economic impact"]`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();
    
    try {
      // Extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      topKeywords = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini keywords response:', parseError);
      // Fallback to basic keyword extraction if Gemini fails
      topKeywords = extractBasicKeywords(text);
    }
  } catch (error) {
    console.error('Gemini keyword extraction failed:', error);
    // Fallback to basic keyword extraction
    topKeywords = extractBasicKeywords(text);
  }

  // Calculate emotional tone indicators
  const emotionalWords = {
    positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive', 'success', 'breakthrough'],
    negative: ['bad', 'terrible', 'awful', 'horrible', 'poor', 'negative', 'failure', 'crisis'],
    urgent: ['breaking', 'urgent', 'emergency', 'crisis', 'immediately', 'critical', 'vital', 'crucial']
  };

  const emotionalTone = Object.entries(emotionalWords).reduce((acc, [tone, words]) => {
    const count = words.reduce((sum, word) => 
      sum + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0), 0);
    return { ...acc, [tone]: count };
  }, {} as Record<string, number>);

  return {
    wordCount: words.length,
    averageSentenceLength: Math.round(words.length / sentences.length),
    paragraphCount: paragraphs.length,
    complexWords: words.filter(word => word.length > 6).length,
    readingTimeMinutes,
    topKeywords,
    emotionalTone,
    uniqueWords: new Set(words.map(w => w.toLowerCase())).size,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
  };
};

// Fallback keyword extraction function
const extractBasicKeywords = (text: string): string[] => {
  const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
    'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
  ]);

  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  
  // Process single words and phrases
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^a-z0-9']/g, '');
    if (cleanWord && cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
      // Single words
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      
      // Phrases (bigrams and trigrams)
      if (index < words.length - 1) {
        const nextWord = words[index + 1].replace(/[^a-z0-9']/g, '');
        if (nextWord && !STOP_WORDS.has(nextWord)) {
          const bigram = `${cleanWord} ${nextWord}`;
          wordFrequency[bigram] = (wordFrequency[bigram] || 0) + 1;
        }
      }
      
      if (index < words.length - 2) {
        const nextWord = words[index + 1].replace(/[^a-z0-9']/g, '');
        const nextNextWord = words[index + 2].replace(/[^a-z0-9']/g, '');
        if (nextWord && nextNextWord && !STOP_WORDS.has(nextWord) && !STOP_WORDS.has(nextNextWord)) {
          const trigram = `${cleanWord} ${nextWord} ${nextNextWord}`;
          wordFrequency[trigram] = (wordFrequency[trigram] || 0) + 1;
        }
      }
    }
  });

  return Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
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

// Function to detect potential timeline inconsistencies
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

// Function to analyze citation patterns
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
      statistics: await calculateContentStatistics(text)
    };
  }

  const warnings: string[] = [];
  const suggestions: string[] = [];
  let credibilityScore = 100;

  const statistics = await calculateContentStatistics(text);
  const timelineAnalysis = analyzeTimeline(text);
  const citationAnalysis = analyzeCitations(text);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `You are a fact-checking system that ONLY responds with valid JSON. Analyze the following content in ${i18n.language === 'hi' ? 'Hindi' : 'English'} language.

Your task is to analyze the following text for credibility and misinformation.

CRITICAL: Your response MUST be a single JSON object with EXACTLY this structure, and ALL text fields must be in ${i18n.language === 'hi' ? 'Hindi' : 'English'}:
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

Text to analyze: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();
    
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      analysis = JSON.parse(jsonString);
      
      const relevantSources = getRelevantArticleSearches(statistics.topKeywords);
      
      const sources = relevantSources.map(source => ({
        ...source,
        verificationDetails: [
          i18n.language === 'hi' 
            ? "इस विश्वसनीय स्रोत से संबंधित लेखों की खोज के लिए क्लिक करें"
            : "Click to search for related articles from this trusted source",
          i18n.language === 'hi'
            ? "सत्यापित समाचार कवरेज के साथ सामग्री की तुलना करें"
            : "Compare the content with verified news coverage",
          i18n.language === 'hi'
            ? "सटीकता के लिए तिथियों और विवरणों की जांच करें"
            : "Check dates and details for accuracy",
          i18n.language === 'hi'
            ? "कई स्रोतों के खिलाफ दावों की पुष्टि करें"
            : "Verify claims against multiple sources"
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
        i18n.language === 'hi'
          ? 'API त्रुटि के कारण विश्लेषण करने में असमर्थ।'
          : 'Unable to perform analysis due to an API error.',
        i18n.language === 'hi'
          ? 'कृपया सुनिश्चित करें कि आपकी API कुंजी मान्य है और पर्याप्त कोटा है।'
          : 'Please ensure your API key is valid and has sufficient quota.'
      ],
      suggestions: [
        i18n.language === 'hi'
          ? 'अपनी API कुंजी कॉन्फ़िगरेशन की जाँच करें'
          : 'Check your API key configuration',
        i18n.language === 'hi'
          ? 'कुछ क्षणों में पुनः प्रयास करें'
          : 'Try again in a few moments',
        i18n.language === 'hi'
          ? 'यदि समस्या बनी रहती है, तो अपनी API कुंजी को यहां सत्यापित करें: https://makersuite.google.com/app/apikey'
          : 'If the problem persists, verify your API key at https://makersuite.google.com/app/apikey'
      ],
      factCheck: {
        isFactual: false,
        explanation: i18n.language === 'hi'
          ? 'विश्लेषण उपलब्ध नहीं: ' + (error.message || 'API त्रुटि')
          : 'Analysis unavailable: ' + (error.message || 'API Error')
      },
      statistics,
      timeline: timelineAnalysis,
      citations: citationAnalysis
    };
  }
};