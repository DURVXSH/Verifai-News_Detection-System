// Import necessary dependencies from React and external libraries
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Video,
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  Zap,
  ArrowLeft,
  Info,
  History,
  FileText,
  Camera,
  Scan,
  Eye,
  Languages,
  CheckCircle,
  BookOpen,
  Share2,
  MessageCircle,
  Home,
  Newspaper,
  Play,
  Pause,
  Shield,
  Brain,
  Clock,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MobileSidebar } from '@/components/MobileSidebar';
import { analyzeImage } from '@/utils/imageAnalyzer';
import { analyzeVideo } from '@/utils/videoAnalyzer';
import { AnalysisResult } from '@/utils/types';
import { ContentStats } from '@/components/ContentStats';
import { SourceDetails } from '@/components/SourceDetails';
import { ReportGenerator } from '@/components/ReportGenerator';
import { HistoryPanel } from '@/components/HistoryPanel';
import { Link } from 'react-router-dom';
import { ArticleAnalysisSkeleton } from '@/components/ArticleAnalysisSkeleton';
import { AnimatedCredibilityMeter } from '@/components/AnimatedCredibilityMeter';
import {Tooltip} from '@/components/Tooltip';
import { UserNav } from '@/components/UserNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// MediaAnalysisPage component: Handles both image and video analysis
export const MediaAnalysisPage: React.FC = () => {
  // Initialize hooks for translation and state management
  const { t } = useTranslation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Array<{
    id: string;
    timestamp: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    result: AnalysisResult;
  }>>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [sparkles, setSparkles] = useState([]);
  const [activeTab, setActiveTab] = useState('image');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Effect to generate animated sparkles for visual effect
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

  // Effect to animate sparkles movement
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

  // Handler for selecting media files (image or video)
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      setMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler to analyze the selected media
  const handleAnalysis = async () => {
    if (!selectedMedia || !mediaPreview || !mediaType) return;

    setIsAnalyzing(true);
    try {
      let analysisResult: AnalysisResult;
      
      if (mediaType === 'image') {
        analysisResult = await analyzeImage(mediaPreview);
      } else {
        analysisResult = await analyzeVideo(selectedMedia);
      }
      
      setResult(analysisResult);
      setExtractedText(analysisResult.extractedText || '');

      const newAnalysis = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        mediaUrl: mediaPreview,
        mediaType,
        result: analysisResult
      };
      setHistory(prev => [newAnalysis, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler for drag-and-drop media upload
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (isImage || isVideo) {
        setSelectedMedia(file);
        setMediaType(isImage ? 'image' : 'video');
        setActiveTab(isImage ? 'image' : 'video');
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handler to allow drag-over events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Handler to clear the current analysis
  const clearAnalysis = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
    setResult(null);
    setExtractedText('');
    setIsVideoPlaying(false);
  };

  // Handler to share analysis results via clipboard
  const handleShare = async () => {
    if (!result) return;
    
    const mediaTypeText = mediaType === 'video' ? 'Video' : 'Image';
    const deepfakeInfo = result.deepfakeAnalysis ? 
      `\nDeepfake Analysis: ${result.deepfakeAnalysis.isDeepfake ? '⚠ Potential Deepfake Detected' : '✓ No Deepfake Indicators'} (Confidence: ${result.deepfakeAnalysis.confidence}%)` : '';
    
    const shareText = `
      ${mediaTypeText} Analysis Results:
      
      Credibility Score: ${result.credibilityScore}/100
      Factual Assessment: ${result.factCheck.isFactual ? '✓ Verified' : '⚠ Unverified'}${deepfakeInfo}
      
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

  // Handler to select a historical analysis and display it
  const handleHistorySelect = (item: { id: string; timestamp: string; mediaUrl: string; mediaType: 'image' | 'video'; result: AnalysisResult }) => {
    setSelectedMedia(null);
    setMediaPreview(item.mediaUrl);
    setMediaType(item.mediaType);
    setActiveTab(item.mediaType);
    setResult(item.result);
    setExtractedText(item.result.extractedText || '');
    setShowHistory(false);
  };

  // Handler to toggle video playback
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render the main UI
  return (
    <div className="min-h-screen relative">
      {/* Background layers for visual styling */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80" />
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#93c5fd_1px,transparent_1px),linear-gradient(to_bottom,#93c5fd_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear_gradient(to_bottom,#334155_1px,transparent_1px)] opacity-50 transition-opacity duration-300" />
      
      <div className="fixed inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(100%_100%_at_50%_0%,rgba(30,41,59,0.5)_0%,rgba(30,41,59,0)_100%)]" />
      
      <div className="fixed inset-0" />
      
      {/* Sparkle effect layer */}
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

      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="flex items-center gap-2"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  {t('common.back')}
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                {/* Home */}
                <Tooltip text={t('Content Analyzer')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative group hover:bg-primary/10 transition-transform duration-200 transform hover:scale-110"
                  >
                    <Link to="/dashboard" state={{ skipLanding: true }}>
                      <Home className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                    </Link>
                  </Button>
                </Tooltip>

                {/* Analysis History */}
                <Tooltip text={t('Analysis History')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(!showHistory)}
                    className="relative group hover:bg-primary/10 transition-transform duration-200 transform hover:scale-110"
                  >
                    <History className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                    {history.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {history.length}
                      </span>
                    )}
                  </Button>
                </Tooltip>

                {/* News Analysis */}
                <Tooltip text={t('News Analysis')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative group hover:bg-primary/10 transition-transform duration-200 transform hover:scale-110"
                  >
                    <Link to="/news">
                      <Newspaper className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                    </Link>
                  </Button>
                </Tooltip>

                {/* Community Feed */}
                <Tooltip text={t('Community Feed')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative group hover:bg-primary/10 transition-transform duration-200 transform hover:scale-110"
                  >
                    <Link to="/social">
                      <MessageCircle className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                    </Link>
                  </Button>
                </Tooltip>

                {/* About Us */}
                <Tooltip text={t('About us')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative group hover:bg-primary/10 transition-transform duration-200 transform hover:scale-110"
                  >
                    <Link to="/about">
                      <Info className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
                    </Link>
                  </Button>
                </Tooltip>

                <LanguageSelector />
                <ThemeToggle />
                <UserNav />
              </div>
              {/* Mobile sidebar for smaller screens */}
              <div className="md:hidden">
                <MobileSidebar
                  showHistory={showHistory}
                  onHistoryClick={() => setShowHistory(!showHistory)}
                />
              </div>
            </div>
          </div>

          {/* Main title section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Monitor className="h-12 w-12 text-primary relative" />
              </div>
              <h1 className="text-4xl font-bold">
                {t('articleAnalysis.title')}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('articleAnalysis.subtitle')}
            </p>
          </motion.div>

          {/* History panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Analysis History
                  </h2>
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleHistorySelect(item)}
                      >
                        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {item.mediaType === 'video' ? (
                            <>
                              <video 
                                src={item.mediaUrl} 
                                className="w-full h-full object-cover"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <img 
                              src={item.mediaUrl} 
                              alt="Historical analysis"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.mediaType === 'video' ? (
                                <Video className="h-4 w-4 text-primary" />
                              ) : (
                                <Camera className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-sm font-medium">
                                Credibility: {item.result.credibilityScore}%
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {item.result.extractedText && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {item.result.extractedText}
                            </p>
                          )}
                          {item.result.deepfakeAnalysis && (
                            <div className="flex items-center gap-2 mt-1">
                              <Shield className={`h-4 w-4 ${item.result.deepfakeAnalysis.isDeepfake ? 'text-destructive' : 'text-success'}`} />
                              <span className="text-xs">
                                {item.result.deepfakeAnalysis.isDeepfake ? 'Deepfake Detected' : 'Authentic'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {/* Media upload and analysis section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div 
                className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-border/50 relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      {t('Image Analysis')}
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t('Video Analysis')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="image">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) => handleMediaSelect(e, 'image')}
                      accept="image/*"
                      className="hidden"
                    />

                    {!mediaPreview || mediaType !== 'image' ? (
                      <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg p-8">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {t('Upload Image')}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 text-center max-w-md">
                          {t('Description')}
                        </p>
                        <Button
                          onClick={() => imageInputRef.current?.click()}
                          className="relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Upload className="h-4 w-4 mr-2" />
                          {t('articleAnalysis.dropzone.button')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="aspect-video rounded-lg overflow-hidden bg-black/5">
                          <img
                            src={mediaPreview}
                            alt="Selected article"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="video">
                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={(e) => handleMediaSelect(e, 'video')}
                      accept="video/*"
                      className="hidden"
                    />

                    {!mediaPreview || mediaType !== 'video' ? (
                      <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg p-8">
                        <Video className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {t('Upload Video')}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 text-center max-w-md">
                          {t('Video Description')}
                        </p>
                        <Button
                          onClick={() => videoInputRef.current?.click()}
                          className="relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Upload className="h-4 w-4 mr-2" />
                          {t('Select Video')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                          <video
                            ref={videoRef}
                            src={mediaPreview}
                            className="w-full h-full object-contain"
                            controls
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                          />
                        </div>
                        
                        {/* Video metadata display */}
                        {result?.videoMetadata && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="text-center">
                              <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                              <p className="text-sm font-medium">{t('Duration')}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(result.videoMetadata.duration)}
                              </p>
                            </div>
                            <div className="text-center">
                              <Monitor className="h-5 w-5 text-primary mx-auto mb-1" />
                              <p className="text-sm font-medium">{t('Resolution')}</p>
                              <p className="text-xs text-muted-foreground">
                                {result.videoMetadata.resolution}
                              </p>
                            </div>
                            <div className="text-center">
                              <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                              <p className="text-sm font-medium">{t('Frame Rate')}</p>
                              <p className="text-xs text-muted-foreground">
                                {result.videoMetadata.frameRate} fps
                              </p>
                            </div>
                            <div className="text-center">
                              <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
                              <p className="text-sm font-medium">{t('File Size')}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(result.videoMetadata.fileSize)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {mediaPreview && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                      size="lg"
                      className="relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          {t('common.analyzing')}
                        </>
                      ) : (
                        <>
                          <Scan className="mr-2 h-4 w-4" />
                          {t('common.analyze')} {mediaType === 'video' ? t('Video') : t('Image')}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={clearAnalysis}
                      size="lg"
                      className="group/clear"
                    >
                      <span className="relative">
                        <span className="absolute inset-0 bg-destructive/10 blur opacity-0 group-hover/clear:opacity-100 transition-opacity" />
                        <span className="relative">{t('clear')}</span>
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Analysis results or loading skeleton */}
            <AnimatePresence>
              {isAnalyzing ? (
                <ArticleAnalysisSkeleton />
              ) : result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Deepfake Analysis Section (for videos) */}
                  {result.deepfakeAnalysis && mediaType === 'video' && (
                    <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {t('Deepfake Detection')}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg border ${
                            result.deepfakeAnalysis.isDeepfake 
                              ? 'bg-destructive/10 border-destructive/30' 
                              : 'bg-success/10 border-success/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {result.deepfakeAnalysis.isDeepfake ? (
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-success" />
                              )}
                              <span className="font-medium">
                                {result.deepfakeAnalysis.isDeepfake ? t('Deepfake Detected') : t('Authentic Content')}
                              </span>
                            </div>
                            <p className="text-sm">
                              {t('Confidence')}: {result.deepfakeAnalysis.confidence}%
                            </p>
                          </div>

                          {result.deepfakeAnalysis.indicators.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">{t('Detection Indicators')}</h4>
                              <ul className="space-y-1">
                                {result.deepfakeAnalysis.indicators.map((indicator, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                    <span>{indicator}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">{t('TechnicalAnalysis')}</h4>
                          <ul className="space-y-1">
                            {result.deepfakeAnalysis.technicalAnalysis.map((analysis, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{analysis}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extracted Text Section */}
                  {extractedText && (
                    <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        {t('Extracted Text')}
                      </h2>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {extractedText.split('\n').map((paragraph, index) => (
                          <React.Fragment key={index}>
                            {paragraph.trim() && (
                              <p className="mb-4 leading-relaxed text-foreground whitespace-pre-line">
                                {paragraph}
                              </p>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analysis Results Section */}
                  <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
                    <div className="flex justify-between items-start mb-8">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t('Title')}
                      </h2>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('Share')}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg shadow-sm">
                        <AnimatedCredibilityMeter score={result.credibilityScore} />
                        <p className="text-sm font-medium mt-4 text-center">
                          {result.credibilityScore >= 80 ? t('credibility high') :
                           result.credibilityScore >= 60 ? t('credibility moderate') :
                           t('credibility low')}
                        </p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <BookOpen className="text-primary mr-2" />
                          {t('results.factCheck.title')}
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
                              {result.factCheck.isFactual ? 'Verified Content' : 'Unverified Content'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">
                            {result.factCheck.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content Statistics */}
                    {result.statistics.wordCount > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">{t('overview')}</h3>
                        <ContentStats statistics={result.statistics} />
                      </div>
                    )}

                    {/* Sources */}
                    {result.factCheck.sources && result.factCheck.sources.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">{t('sources')}</h3>
                        <SourceDetails sources={result.factCheck.sources} />
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {['Warnings', 'Analysis', 'Suggestions'].map((section, index) => (
                        <div key={section} className="bg-background/50 border border-border/50 rounded-lg p-6 shadow-sm backdrop-blur-sm">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            {index === 0 && <AlertTriangle className="text-warning mr-2 h-5 w-5" />}
                            {index === 1 && <Info className="text-primary mr-2 h-5 w-5" />}
                            {index === 2 && <Sparkles className="text-primary mr-2 h-5 w-5" />}
                            {t(`results.${section.toLowerCase()}.title`)}
                          </h3>
                          {index === 0 && (
                            <ul className="space-y-3">
                              {result.warnings?.map((warning, i) => (
                                <li key={i} className="flex items-start text-sm">
                                  <span className="mr-2 text-warning mt-1">•</span>
                                  <span className="text-foreground leading-relaxed">{warning}</span>
                                </li>
                              ))}
                              {(!result.warnings || result.warnings.length === 0) && (
                                <li className="flex items-center text-sm text-success">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t('warnings.none')}
                                </li>
                              )}
                            </ul>
                          )}
                          {index === 1 && (
                            <div className="space-y-4">
                              {[
                                { label: t('results.analysis.sentiment'), value: result.sentiment ? `${result.sentiment.label} (${result.sentiment.score.toFixed(2)})` : 'N/A' },
                                { label: t('results.analysis.readability'), value: result.readability ? `${result.readability.level} (${t('results.analysis.score')}: ${result.readability.score})` : 'N/A' },
                                { label: t('results.analysis.bias'), value: result.bias?.explanation || 'N/A' }
                              ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                  <p className="text-sm font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    {item.label}
                                  </p>
                                  <p className="text-sm text-foreground ml-4 leading-relaxed">
                                    {item.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          {index === 2 && (
                            <ul className="space-y-3">
                              {result.suggestions?.map((suggestion, i) => (
                                <li key={i} className="flex items-start text-sm">
                                  <span className="mr-2 text-primary mt-1">•</span>
                                  <span className="text-foreground leading-relaxed">{suggestion}</span>
                                </li>
                              ))}
                              {(!result.suggestions || result.suggestions.length === 0) && (
                                <li className="text-sm text-muted-foreground">
                                  No specific suggestions available
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Export Options */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-semibold mb-4">{t('results.export')}</h3>
                      <ReportGenerator 
                        result={result} 
                        text={extractedText} 
                        imageUrl={mediaType === 'image' ? mediaPreview : undefined}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with new name
export { MediaAnalysisPage as ArticleAnalysisPage };