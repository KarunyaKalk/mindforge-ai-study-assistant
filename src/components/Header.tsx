import React from 'react';
import { Sparkles, Moon, Sun, History, Bell, Settings, Flame, Zap, ChevronRight } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenHistory: () => void;
  historyCount: number;
  isMockMode: boolean;
  activeTopic?: string;
  category?: string;
  xpCount?: number;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  historyCount,
  isMockMode,
  activeTopic,
  category = 'System Design',
  xpCount = 1240,
  streakDays = 5,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-[#090B11]/90 border-b border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Logo & Version */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#F4C430] text-slate-950 flex items-center justify-center font-black text-sm shadow-sm border border-[#E5B826]">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              MindForge <span className="font-normal text-slate-500 dark:text-white/60">Study AI</span>
            </h1>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#161B26] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/[0.08]">
              v1.0 Pro
            </span>
          </div>
        </div>

        {/* Center: Topic Breadcrumbs */}
        {activeTopic && (
          <div className="hidden md:flex items-center space-x-2 text-[13px] font-medium text-slate-600 dark:text-white/70 bg-slate-100/80 dark:bg-[#111827] px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06] max-w-md truncate">
            <span className="text-slate-400 font-normal">{category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold truncate">{activeTopic}</span>
          </div>
        )}

        {/* Right: Gamification & Profile Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Study Streak */}
          <div
            title={`${streakDays} Day Study Streak`}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[12px] font-bold font-mono"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{streakDays}d</span>
          </div>

          {/* XP Counter */}
          <div
            title="Total Study XP Earned"
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#F4C430]/10 text-[#F4C430] border border-[#F4C430]/20 text-[12px] font-bold font-mono"
          >
            <Zap className="w-3.5 h-3.5 text-[#F4C430] fill-[#F4C430]" />
            <span>{xpCount.toLocaleString()} XP</span>
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-[#161B26] transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F4C430] rounded-full"></span>
          </button>

          {/* History Sessions */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-[#161B26] transition relative"
            title="Saved Sessions"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4C430] text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-[#161B26] transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#F4C430]" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-lg text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-[#161B26] transition hidden sm:block"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center border border-slate-700 dark:border-slate-300 ml-1">
            K
          </div>
        </div>
      </div>
    </header>
  );
};
