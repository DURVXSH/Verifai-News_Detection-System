export interface SourceVerification {
  url: string;
  reliability: number;
  lastUpdated: string;
  domain: string;
  category: 'News' | 'Academic' | 'Government' | 'Social Media' | 'Blog' | 'Other';
}

export interface ContentStatistics {
  wordCount: number;
  averageSentenceLength: number;
  paragraphCount: number;
  complexWords: number;
  readingTimeMinutes: number;
  topKeywords: string[];
  emotionalTone: {
    positive: number;
    negative: number;
    urgent: number;
  };
  uniqueWords: number;
  averageWordLength: number;
}

export interface TimelineAnalysis {
  datesFound: string[];
  hasInconsistencies: boolean;
  timespan: {
    earliest: Date;
    latest: Date;
  } | null;
}

export interface CitationAnalysis {
  hasCitations: boolean;
  citationCount: number;
  citations: {
    academic: string[];
    quotes: string[];
    urls: string[];
  };
}

export interface HistoricalAnalysis {
  id: string;
  timestamp: string;
  text: string;
  result: AnalysisResult;
  statistics: ContentStatistics;
}

export interface DetailedSource {
  url: string;
  title: string;
  publishDate?: string;
  author?: string;
  reliability: number;
  verificationDetails: string[];
  snippet?: string;
}

export interface AnalysisResult {
  credibilityScore: number;
  warnings: string[];
  suggestions: string[];
  factCheck: {
    isFactual: boolean;
    explanation: string;
    sources?: DetailedSource[];
  };
  sentiment?: {
    score: number;
    label: 'negative' | 'neutral' | 'positive';
  };
  readability?: {
    score: number;
    level: 'Easy' | 'Medium' | 'Hard';
    suggestions: string[];
  };
  bias?: {
    score: number;
    type: string;
    explanation: string;
  };
  statistics: ContentStatistics;
  timeline?: TimelineAnalysis;
  citations?: CitationAnalysis;
  sourceVerification?: SourceVerification[];
  extractedText?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  credibilityScore: number;
  summary: string;
  warnings: string[];
  verifiedClaims: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}