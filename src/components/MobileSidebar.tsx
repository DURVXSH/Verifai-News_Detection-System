import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, History, Sun, Moon, Info, Zap, ArrowLeft, Languages } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { LanguageSelector } from './LanguageSelector';

interface MobileSidebarProps {
  showHistory: boolean;
  onHistoryClick: () => void;
  onBackHome?: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  showHistory,
  onHistoryClick,
  onBackHome
}) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const isAnalyzerVisible = !isAboutPage && onBackHome;

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
          {/* Header */}
          <div className="border-b border-border/40 pb-4 mb-4">
            <SheetTitle className="flex items-center gap-2 px-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">Verifai</span>
            </SheetTitle>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2">
            <div className="space-y-1">
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

              {isAboutPage && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-11"
                  asChild
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Analysis
                  </Link>
                </Button>
              )}

              {!isAboutPage && (
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

              <div className="flex items-center gap-2 px-3 py-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Language</span>
              </div>
              <div className="px-3">
                <LanguageSelector />
              </div>
            </div>
          </div>

          {/* Footer */}
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