import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu } from 'lucide-react';

const LOADING_TIPS = [
  'Requesting structured JSON output from model server proxy...',
  'Running Zod schema validation to ensure type safety...',
  'Extracting 3D flashcards, interactive quiz questions, and key terms...',
  'Preparing AbortController to safeguard against stale request race conditions...',
];

export const LoadingSkeleton: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Loading Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Generating Interactive Study Suite...
        </h3>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-brand-600 dark:text-brand-400 mb-6">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>{LOADING_TIPS[tipIndex]}</span>
        </div>

        {/* Pulse Skeleton Mock Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse p-4 flex flex-col justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
          <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse p-4 flex flex-col justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
          <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse p-4 flex flex-col justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
          </div>
        </div>
      </div>
    </div>
  );
};
