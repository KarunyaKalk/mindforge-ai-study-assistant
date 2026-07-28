import React from 'react';
import { Sparkles, Moon, Sun, History, Cpu, ShieldCheck } from 'lucide-react';

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
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-navy-950/90 border-b border-slate-200 dark:border-navy-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent-400 text-navy-950 flex items-center justify-center font-black text-xl shadow-lg shadow-accent-400/25 border border-accent-300">
            <Sparkles className="w-5 h-5 text-navy-950 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-xl tracking-tight text-navy-950 dark:text-white">
                MindForge AI
              </h1>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-900 dark:bg-accent-950/60 dark:text-accent-300 border border-accent-300 dark:border-accent-800/80">
                v1.0 SDE Ref
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Structured AI Learning Suite & Interactive Knowledge Studio
            </p>
          </div>
        </div>

        {/* Center Indicator */}
        {activeTopic && (
          <div className="hidden md:flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-navy-900 text-xs font-semibold text-navy-800 dark:text-slate-200 border border-slate-200 dark:border-navy-800 max-w-xs truncate">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-ping"></span>
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
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isMockMode
                ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isMockMode ? <Cpu className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{isMockMode ? 'Mock Fallback' : 'Live Gemini AI'}</span>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
            title="View Saved Sessions"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-400 text-navy-950 font-black text-xs rounded-full flex items-center justify-center shadow-sm">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-accent-400" /> : <Moon className="w-5 h-5 text-navy-900" />}
          </button>
        </div>
      </div>
    </header>
  );
};
