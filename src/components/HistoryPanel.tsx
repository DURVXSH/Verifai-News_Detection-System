import React from 'react';
import { History, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { formatDate } from '@/lib/utils';
import { HistoricalAnalysis } from '@/utils/types';
import { useAuth } from './AuthProvider';

interface HistoryPanelProps {
  history: HistoricalAnalysis[];
  onSelect: (analysis: HistoricalAnalysis) => void;
  onDelete: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onDelete,
}) => {
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    if (!user) return;
    onDelete(id);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Analysis History</h2>
      </div>
      
      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm">No previous analyses yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium line-clamp-1">{item.text}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatDate(new Date(item.timestamp))}</span>
                    <span>Score: {item.result.credibilityScore}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSelect(item)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}