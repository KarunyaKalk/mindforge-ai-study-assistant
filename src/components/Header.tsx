import React from 'react';
import { Sparkles, Moon, Sun, History, Cpu, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenHistory: () => void;
  historyCount: number;
  isMockMode: boolean;
  activeTopic?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  historyCount,
  isMockMode,
  activeTopic,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-xl">
            <Sparkles className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
                MindForge AI
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                v1.0 SDE Ref
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Structured AI Learning Hub & Interactive Study Suite
            </p>
          </div>
        </div>

        {/* Center Indicator */}
        {activeTopic && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="truncate">Topic: {activeTopic}</span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Mode Indicator Badge */}
          <div
            title={
              isMockMode
                ? 'Running with local mock generator (No API key in .env). Set GEMINI_API_KEY for live AI calls.'
                : 'Connected to live Gemini AI API server proxy'
            }
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isMockMode
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isMockMode ? <Cpu className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{isMockMode ? 'Mock Fallback' : 'Live Gemini AI'}</span>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Saved Sessions"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white font-bold text-xs rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
