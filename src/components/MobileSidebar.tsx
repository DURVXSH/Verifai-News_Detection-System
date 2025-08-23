import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, History, Sun, Moon, Info, Zap, ArrowLeft, Languages, Camera, Home, Newspaper, LogOut, User, Users, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from './AuthProvider';
import { signOut } from '@/lib/auth';

interface MobileSidebarProps {
  showHistory: boolean;
  onHistoryClick: () => void;
  onBackHome?: () => void;
  showSavedArticles?: boolean;
  onSavedArticlesClick?: () => void;
  savedArticlesCount?: number;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  showHistory,
  onHistoryClick,
  onBackHome,
  showSavedArticles = false,
  onSavedArticlesClick,
  savedArticlesCount = 0
}) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAboutPage = location.pathname === '/about';
  const isArticleAnalysisPage = location.pathname === '/article-analysis';
  const isNewsPage = location.pathname === '/news';
  const isSocialPage = location.pathname === '/social';
  const isAnalyzerVisible = !isAboutPage && !isArticleAnalysisPage && !isNewsPage && !isSocialPage && onBackHome;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-background/60 backdrop-blur-xl backdrop-saturate-150 border-r border-border/40">
        <div className="flex flex-col h-full">
          <div className="border-b border-border/40 pb-4 mb-4">
            <SheetTitle className="flex items-center gap-2 px-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">Verifai</span>
            </SheetTitle>
          </div>

          <div className="flex-1 px-2">
            <div className="space-y-1">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{user.displayName || user.email}</span>
                </div>
              )}

              {isAnalyzerVisible && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  onClick={onBackHome}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              )}

              {(isAboutPage || isArticleAnalysisPage || isNewsPage || isSocialPage) && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  asChild
                >
                  <Link to="/dashboard">
                    <Home className="h-4 w-4" />
                    Content Analyzer
                  </Link>
                </Button>
              )}

              {!isAboutPage && !isArticleAnalysisPage && !isNewsPage && !isSocialPage && (
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 h-11',
                    showHistory && 'bg-accent/50 backdrop-blur-sm'
                  )}
                  onClick={onHistoryClick}
                >
                  <History className="h-4 w-4" />
                  Analysis History
                </Button>
              )}

              {!isArticleAnalysisPage && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  asChild
                >
                  <Link to="/article-analysis">
                    <Camera className="h-4 w-4" />
                    Article Analysis
                  </Link>
                </Button>
              )}

              {!isNewsPage && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  asChild
                >
                  <Link to="/news">
                    <Newspaper className="h-4 w-4" />
                    News Analysis
                  </Link>
                </Button>
              )}

              {isNewsPage && onSavedArticlesClick && (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-11",
                    showSavedArticles && "bg-accent/50 backdrop-blur-sm"
                  )}
                  onClick={onSavedArticlesClick}
                >
                  {showSavedArticles ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  Saved Articles
                  {savedArticlesCount > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {savedArticlesCount}
                    </span>
                  )}
                </Button>
              )}

              {!isSocialPage && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  asChild
                >
                  <Link to="/social">
                    <MessageCircle className="h-4 w-4" />
                    Community Feed
                  </Link>
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-11"
                asChild
              >
                <Link to="/about">
                  <Info className="h-4 w-4" />
                  About Us
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-11"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                )}
              </Button>

              {!isNewsPage && !isSocialPage && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Language</span>
                  </div>
                  <div className="px-3">
                    <LanguageSelector />
                  </div>
                </>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-11 text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="mt-auto border-t border-border/40">
            <div className="px-2 py-4">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Verifai.
                <br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};