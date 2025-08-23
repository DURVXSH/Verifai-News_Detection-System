import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Loader2, 
  BookOpen, 
  Share2, 
  FileText, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  History, 
  GitCompare, 
  Plus, 
  ArrowLeft, 
  Camera, 
  Newspaper // Added for News Page
} from 'lucide-react';
import { analyzeText } from '@/utils/newsAnalyzer';
import { AnalysisResult, HistoricalAnalysis } from '@/utils/types';
import { CredibilityMeter } from '@/components/CredibilityMeter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { EducationalResources } from '@/components/EducationalResources';
import { ContentStats } from '@/components/ContentStats';
import { SourceDetails } from '@/components/SourceDetails';
import { HistoryPanel } from '@/components/HistoryPanel';
import { StoryTimeline } from '@/components/StoryTimeline';
import { PatternAnalysis } from '@/components/PatternAnalysis';
import { SimilarityMatrix } from '@/components/SimilarityMatrix';
import { ReportGenerator } from '@/components/ReportGenerator';
import { MobileSidebar } from '@/components/MobileSidebar';
import { LandingPage } from './LandingPage';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState<HistoricalAnalysis[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonTexts, setComparisonTexts] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<AnalysisResult[]>([]);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('analysis-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const skipLanding = localStorage.getItem('skipLanding') === 'true';
    if (skipLanding) {
      setShowLanding(false);
      setShowAnalyzer(true);
    }
  }, []);

  const handleStartAnalyzing = () => {
    setShowLanding(false);
    setShowAnalyzer(true);
    localStorage.setItem('skipLanding', 'true');
  };

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      const gridSize = 4;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const horizontalLines = Math.floor(viewportHeight / (gridSize * 16));
      const verticalLines = Math.floor(viewportWidth / (gridSize * 16));
      
      const sparkleCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < sparkleCount; i++) {
        const isHorizontal = Math.random() > 0.5;
        
        if (isHorizontal) {
          const lineIndex = Math.floor(Math.random() * horizontalLines);
          newSparkles.push({
            id: `sparkle-${Date.now()}-${i}`,
            x: Math.random() * viewportWidth,
            y: lineIndex * gridSize * 16,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 2 + 1,
            direction: Math.random() > 0.5 ? 1 : -1,
            isHorizontal: true,
          });
        } else {
          const lineIndex = Math.floor(Math.random() * verticalLines);
          newSparkles.push({
            id: `sparkle-${Date.now()}-${i}`,
            x: lineIndex * gridSize * 16,
            y: Math.random() * viewportHeight,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 2 + 1,
            direction: Math.random() > 0.5 ? 1 : -1,
            isHorizontal: false,
          });
        }
      }
      
      setSparkles(newSparkles);
    };
    
    generateSparkles();
    const interval = setInterval(generateSparkles, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sparkles.length === 0) return;
    
    const animateSparkles = () => {
      setSparkles(prevSparkles => 
        prevSparkles.map(sparkle => {
          if (sparkle.isHorizontal) {
            let newX = sparkle.x + (sparkle.speed * sparkle.direction);
            if (newX < 0 || newX > window.innerWidth) {
              sparkle.direction *= -1;
              newX = sparkle.x + (sparkle.speed * sparkle.direction);
            }
            return { ...sparkle, x: newX };
          } else {
            let newY = sparkle.y + (sparkle.speed * sparkle.direction);
            if (newY < 0 || newY > window.innerHeight) {
              sparkle.direction *= -1;
              newY = sparkle.y + (sparkle.speed * sparkle.direction);
            }
            return { ...sparkle, y: newY };
          }
        })
      );
    };
    
    const animationFrame = requestAnimationFrame(animateSparkles);
    const interval = setInterval(animateSparkles, 50);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [sparkles]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleAnalysis = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeText(text);
      setResult(analysis);
      
      const newAnalysis: HistoricalAnalysis = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        text,
        result: analysis,
        statistics: analysis.statistics
      };
      
      const updatedHistory = [newAnalysis, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddComparison = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeText(text);
      setComparisonTexts([...comparisonTexts, text]);
      setComparisonResults([...comparisonResults, analysis]);
      setText('');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    
    const shareText = `
      Content Analysis Results:
      
      Credibility Score: ${result.credibilityScore}/100
      Factual Assessment: ${result.factCheck.isFactual ? '✓ Verified' : '⚠ Unverified'}
      
      Key Findings:
      ${result.factCheck.explanation}
      
      Analysis Details:
      ${result.sentiment ? `- Sentiment: ${result.sentiment.label} (${result.sentiment.score.toFixed(2)})` : ''}
      ${result.readability ? `- Readability: ${result.readability.level} (Score: ${result.readability.score})` : ''}
      ${result.bias ? `- Bias Assessment: ${result.bias.explanation}` : ''}
      
      Generated by Verifai
    `.trim();
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Analysis copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleHistorySelect = (analysis: HistoricalAnalysis) => {
    setText(analysis.text);
    setResult(analysis.result);
    setCharCount(analysis.text.length);
    setShowHistory(false);
  };

  const handleHistoryDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80" />
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#93c5fd_1px,transparent_1px),linear-gradient(to_bottom,#93c5fd_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear_gradient(to_bottom,#334155_1px,transparent_1px)] opacity-50 transition-opacity duration-300" />
      
      <div className="fixed inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(100%_100%_at_50%_0%,rgba(30,41,59,0.5)_0%,rgba(30,41,59,0)_100%)]" />
      
      <div className="fixed inset-0" />
      
      <div className="fixed inset-0 pointer-events-none z-10">
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-blue-400 dark:bg-blue-500 animate-pulse"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              opacity: sparkle.opacity,
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.size}px rgba(59, 130, 246, 0.5)`,
              transition: 'transform 0.2s linear'
            }}
          />
        ))}
      </div>

      {showLanding && !showAnalyzer ? (
        <LandingPage onStartAnalyzing={handleStartAnalyzing} />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen relative z-20"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-5xl mx-auto">
                <motion.div 
                  className="text-center mb-12 relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAnalyzer(false);
                      setShowLanding(true);
                      localStorage.removeItem('skipLanding');
                    }}
                    className="absolute left-0 top-0 hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('common.back')}
                  </Button>
                  
                  <div className="absolute right-0 top-0 flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowHistory(!showHistory)}
                        className="relative"
                      >
                        <History className="h-5 w-5" />
                        {history.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {history.length}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="relative"
                      >
                        <Link to="/article-analysis">
                          <Camera className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="relative"
                      >
                        <Link to="/news">
                          <Newspaper className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/about">
                          <Info className="h-5 w-5" />
                        </Link>
                      </Button>
                      <LanguageSelector />
                      <ThemeToggle />
                    </div>
                    <div className="md:hidden">
                      <MobileSidebar
                        showHistory={showHistory}
                        onHistoryClick={() => setShowHistory(!showHistory)}
                        onBackHome={() => {
                          setShowAnalyzer(false);
                          setShowLanding(true);
                          localStorage.removeItem('skipLanding');
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <Zap className="h-12 w-12 text-primary relative" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">
                      {t('header.title')}
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('header.subtitle')}
                  </p>
                </motion.div>

                <div className="space-y-8">
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <HistoryPanel
                          history={history}
                          onSelect={handleHistorySelect}
                          onDelete={handleHistoryDelete}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-border/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                      <div className="relative">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <label 
                                  htmlFor="content" 
                                  className="text-xl font-semibold text-foreground block"
                                >
                                  {t('input.title')}
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {t('input.subtitle')}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowHelp(!showHelp)}
                              className="hover:bg-primary/10 transition-colors"
                            >
                              <HelpCircle className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <div className="relative group/input">
                            <div className="absolute -inset-px bg-gradient-to-r from-primary/50 via-primary/25 to-primary/50 rounded-lg opacity-0 group-focus-within/input:opacity-100 blur transition-all duration-500"></div>
                            
                            <div className="relative">
                              <textarea
                                id="content"
                                rows={8}
                                className="w-full px-4 py-3 rounded-lg bg-background/80 backdrop-blur-sm border border-input focus:ring-0 focus:border-primary/50 transition-all duration-300 text-base shadow-sm relative placeholder:text-muted-foreground/50"
                                placeholder={t('input.placeholder')}
                                value={text}
                                onChange={handleTextChange}
                                style={{ resize: 'vertical' }}
                              />
                              
                              <div className="absolute bottom-3 right-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60 blur-sm rounded-md"></div>
                                  <div className="relative px-2 py-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                                    {charCount} {t('input.characters')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={handleAnalysis}
                            disabled={isAnalyzing || !text.trim()}
                            size="lg"
                            className="relative overflow-hidden group/button"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="animate-spin mr-2" />
                                {t('common.analyzing')}
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {t('common.analyze')}
                              </>
                            )}
                          </Button>
                          
                          {text.trim() && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setText('');
                                setCharCount(0);
                                setResult(null);
                              }}
                              size="lg"
                              className="group/clear"
                            >
                              <span className="relative">
                                <span className="absolute inset-0 bg-destructive/10 blur opacity-0 group-hover/clear:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative">{t('common.clear')}</span>
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setComparisonMode(!comparisonMode);
                        if (!comparisonMode) {
                          setComparisonTexts([]);
                          setComparisonResults([]);
                        }
                      }}
                      className="flex items-center gap-2 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <GitCompare className="h-4 w-4" />
                      {comparisonMode ? t('comparison.exit') : t('comparison.start')}
                    </Button>
                    
                    {comparisonMode && (
                      <Button
                        onClick={handleAddComparison}
                        disabled={isAnalyzing || !text.trim()}
                        className="relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Plus className="h-4 w-4 mr-2" />
                        {t('comparison.add')}
                      </Button>
                    )}
                  </motion.div>

                  {comparisonMode && comparisonResults.length > 0 && (
                    <div className="space-y-8">
                      <SimilarityMatrix
                        texts={comparisonTexts}
                        results={comparisonResults}
                      />
                      <StoryTimeline
                        analyses={comparisonTexts.map((text, i) => ({
                          id: `version-${i}`,
                          timestamp: new Date().toISOString(),
                          text,
                          result: comparisonResults[i]
                        }))}
                      />
                      <PatternAnalysis
                        analyses={comparisonTexts.map((text, i) => ({
                          id: `version-${i}`,
                          timestamp: new Date().toISOString(),
                          text,
                          result: comparisonResults[i]
                        }))}
                      />
                    </div>
                  )}

                  <AnimatePresence>
                    {showHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            {t('help.title')}
                          </h2>
                          <EducationalResources />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-card rounded-xl shadow-lg p-8 border border-border/50"
                        id="analysis-results"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            {t('results.title')}
                          </h2>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            {t('results.share')}
                          </Button>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-4">{t('results.overview')}</h3>
                          <ContentStats statistics={result.statistics} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg shadow-sm">
                            <CredibilityMeter score={result.credibilityScore} />
                            <p className="text-sm font-medium mt-4 text-center">
                              {result.credibilityScore >= 80 ? t('results.credibility.high') :
                               result.credibilityScore >= 60 ? t('results.credibility.medium') :
                               t('results.credibility.low')}
                            </p>
                          </div>

                          <div className="flex flex-col justify-center">
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <BookOpen className="text-primary mr-2" />
                              {t('results.factCheck')}
                            </h3>
                            <div className={`p-4 rounded-lg border ${
                              result.factCheck.isFactual 
                                ? 'bg-success/10 border-success/30 text-success-foreground dark:border-success/50' 
                                : 'bg-destructive/10 border-destructive/30 text-destructive-foreground dark:border-destructive/50'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                {result.factCheck.isFactual ? (
                                  <CheckCircle className="h-5 w-5 text-success" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                )}
                                <span className="font-medium text-foreground">
                                  {result.factCheck.isFactual ? t('results.factCheck.verified') : t('results.factCheck.unverified')}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {result.factCheck.explanation}
                              </p>
                            </div>
                          </div>
                        </div>

                        {result.factCheck.sources && result.factCheck.sources.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">{t('results.sources')}</h3>
                            <SourceDetails sources={result.factCheck.sources} />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {['Warnings', 'Analysis', 'Suggestions'].map((section, index) => (
                            <div key={section} className="bg-card border border-border rounded-lg p-4 shadow-sm">
                              <h3 className="text-lg font-semibold mb-3 flex items-center">
                                {index === 0 && <AlertTriangle className="text-warning mr-2 h-5 w-5" />}
                                {index === 1 && <Info className="text-primary mr-2 h-5 w-5" />}
                                {index === 2 && <Sparkles className="text-primary mr-2 h-5 w-5" />}
                                {t(`results.${section.toLowerCase()}.title`)}
                              </h3>
                              {index === 0 && (
                                <ul className="space-y-2">
                                  {result.warnings.map((warning, i) => (
                                    <li key={i} className="flex items-start text-sm">
                                      <span className="mr-2 text-warning">•</span>
                                      <span className="text-foreground">{warning}</span>
                                    </li>
                                  ))}
                                  {result.warnings.length === 0 && (
                                    <li className="flex items-center text-sm text-success">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      {t('results.warnings.none')}
                                    </li>
                                  )}
                                </ul>
                              )}
                              {index === 1 && (
                                <div className="space-y-4">
                                  {[
                                    { label: t('results.analysis.sentiment'), value: `${result.sentiment?.label} (${result.sentiment?.score.toFixed(2)})` },
                                    { label: t('results.analysis.readability'), value: `${result.readability?.level} (${t('results.analysis.score')}: ${result.readability?.score})` },
                                    { label: t('results.analysis.bias'), value: result.bias?.explanation }
                                  ].map((item, i) => (
                                    <div key={i}>
                                      <p className="text-sm font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                                        {item.label}
                                      </p>
                                      <p className="text-sm text-foreground ml-4">
                                        {item.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {index === 2 && (
                                <ul className="space-y-2">
                                  {result.suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start text-sm">
                                      <span className="mr-2 text-primary">•</span>
                                      <span className="text-foreground">{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-border">
                          <h3 className="text-lg font-semibold mb-4">{t('results.export')}</h3>
                          <ReportGenerator result={result} text={text} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};