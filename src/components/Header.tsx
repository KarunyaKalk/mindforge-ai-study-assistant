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
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-[#070b14]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm border border-yellow-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              MindForge <span className="font-normal text-slate-400 dark:text-slate-500">Study AI</span>
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              v1.0
            </span>
          </div>
        </div>

        {/* Center Active Topic Indicator */}
        {activeTopic && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 max-w-sm truncate font-mono">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="truncate">{activeTopic}</span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Mode Indicator Badge */}
          <div
            title={
              isMockMode
                ? 'Running with local mock generator. Set GROQ_API_KEY for live AI calls.'
                : 'Connected to live Groq AI API server proxy (Llama 3.3)'
            }
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium font-mono border ${
              isMockMode
                ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isMockMode ? <Cpu className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{isMockMode ? 'Mock Engine' : 'Live Groq AI'}</span>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Saved Sessions"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
