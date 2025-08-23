import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, RefreshCcw, AlertTriangle, CheckCircle, ExternalLink, Clock, ThumbsUp, MessageSquare, Share2, Bookmark, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileSidebar } from '@/components/MobileSidebar';
import { analyzeNewsArticle } from '@/utils/newsApi';
import { NewsArticle } from '@/utils/types';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await analyzeNewsArticle();
      setNews(articles);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Fetch news every 15 minutes
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={fetchNews}
                disabled={loading}
                className="hidden sm:flex items-center gap-2"
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <ThemeToggle />
              </div>
              <div className="md:hidden">
                <MobileSidebar
                  showHistory={false}
                  onHistoryClick={() => {}}
                  onBackHome={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Newspaper className="h-12 w-12 text-primary relative" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                24/7 News Analysis
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Real-time credibility analysis of trending news articles
            </p>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>

          {/* News Feed */}
          {error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {loading && news.length === 0 ? (
                  // Skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-card animate-pulse border border-border rounded-xl p-6"
                    >
                      <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                    </div>
                  ))
                ) : (
                  news.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="font-medium text-primary">
                              {article.source}
                            </span>
                            <span>•</span>
                            <span>{getTimeAgo(article.publishedAt)}</span>
                          </div>
                          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              {article.title}
                              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </h2>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCredibilityColor(article.credibilityScore)} bg-card border border-current`}>
                          {article.credibilityScore}% Credible
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {article.summary}
                      </p>

                      {article.warnings.length > 0 && (
                        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Fact-Check Warnings</span>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {article.warnings.map((warning, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {article.verifiedClaims.length > 0 && (
                        <div className="mb-4 p-3 bg-success/10 text-success rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Verified Claims</span>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {article.verifiedClaims.map((claim, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{claim}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.engagement.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            <span>{article.engagement.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>{article.engagement.shares}</span>
                          </button>
                        </div>
                        <button className="hover:text-primary transition-colors">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Verifai News Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by AI for real-time news credibility assessment
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};