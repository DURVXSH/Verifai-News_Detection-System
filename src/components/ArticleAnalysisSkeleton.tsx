import React from 'react';
import { AlertTriangle, BookOpen, Info, Sparkles, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const ArticleAnalysisSkeleton = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Extracted Text Section */}
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <div className="h-6 w-48 bg-primary/10 animate-pulse rounded" />
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-primary/10 animate-pulse rounded w-full" />
          ))}
        </div>
      </div>

      {/* Analysis Results Section */}
      <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <div className="h-8 w-32 bg-primary/10 animate-pulse rounded" />
          </h2>
          <div className="h-9 w-24 bg-primary/10 animate-pulse rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-32 h-32 mb-4"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ backgroundColor: "rgb(239, 68, 68)" }}
                animate={{ backgroundColor: "rgb(34, 197, 94)" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="absolute inset-2 bg-background/80 rounded-full backdrop-blur-sm" />
            </motion.div>
            <div className="h-4 w-48 bg-primary/10 animate-pulse rounded" />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="text-primary mr-2" />
              <div className="h-6 w-32 bg-primary/10 animate-pulse rounded" />
            </h3>
            <div className="p-4 rounded-lg border border-border animate-pulse">
              <div className="h-4 w-full bg-primary/10 rounded mb-2" />
              <div className="h-4 w-3/4 bg-primary/10 rounded" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('results.warnings.title'), icon: AlertTriangle, color: 'warning' },
            { title: t('results.analysis.title'), icon: Info, color: 'primary' },
            { title: t('results.suggestions.title'), icon: Sparkles, color: 'primary' }
          ].map(({ title, icon: Icon, color }, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Icon className={`text-${color} mr-2 h-5 w-5`} />
                {title}
              </h3>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-primary/10 animate-pulse rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};