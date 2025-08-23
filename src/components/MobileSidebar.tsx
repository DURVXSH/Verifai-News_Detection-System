import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, History, Sun, Moon, Info, Zap } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  showHistory: boolean;
  onHistoryClick: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  showHistory,
  onHistoryClick,
}) => {
  const { theme, setTheme } = useTheme();

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
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b pb-4 mb-4">
            <SheetTitle className="flex items-center gap-2 px-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">Verifai</span>
            </SheetTitle>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2 h-11',
                  showHistory && 'bg-accent'
                )}
                onClick={onHistoryClick}
              >
                <History className="h-4 w-4" />
                Analysis History
              </Button>

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
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t">
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