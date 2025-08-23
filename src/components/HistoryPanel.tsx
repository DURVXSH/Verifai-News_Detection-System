import React, { useState } from 'react';
import { History, ChevronRight, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { formatDate } from '@/lib/utils';
import { HistoricalAnalysis } from '@/utils/types';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryPanelProps {
  history: HistoricalAnalysis[];
  onSelect: (analysis: HistoricalAnalysis) => void;
  onDelete: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onDelete,
  onLoadMore,
  hasMore = false,
  loading = false,
}) => {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (!user || !user.uid) return;
    onDelete(id);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Analysis History</h2>
        {history.length > 0 && (
          <span className="ml-auto text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'}
          </span>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <History className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No previous analyses yet.</p>
          <p className="text-muted-foreground text-xs mt-1">Start analyzing content to build your history.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-lg hover:bg-accent/50 transition-all duration-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.result.credibilityScore >= 80 
                            ? 'bg-success/10 text-success' 
                            : item.result.credibilityScore >= 60 
                            ? 'bg-warning/10 text-warning' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          Score: {item.result.credibilityScore}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(new Date(item.timestamp))}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-sm line-clamp-2 leading-relaxed">
                          {expandedItems.has(item.id) ? item.text : truncateText(item.text, 150)}
                        </p>
                        
                        {item.text.length > 150 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(item.id)}
                            className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                          >
                            {expandedItems.has(item.id) ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Show more
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {item.result.warnings && item.result.warnings.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.result.warnings.slice(0, 2).map((warning, i) => (
                            <span key={i} className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                              {truncateText(warning, 30)}
                            </span>
                          ))}
                          {item.result.warnings.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.result.warnings.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={!user || !user.uid}
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelect(item)}
                        className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4 border-t border-border/50">
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load More
                  </>
                )}
              </Button>
            </div>
          )}
          
          {!hasMore && history.length >= 10 && (
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                You've reached the end of your analysis history
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};