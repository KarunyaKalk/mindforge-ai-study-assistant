import React from 'react';
import { StudySet } from '../types/study';
import { Clock, Layers, HelpCircle, BookOpen, Play, PlusCircle, Award } from 'lucide-react';

interface HeroSectionProps {
  studySet: StudySet;
  onToggleInput: () => void;
  showInput: boolean;
  onContinueLearning: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  studySet,
  onToggleInput,
  showInput,
  onContinueLearning,
}) => {
  const masteredCount = studySet.flashcards.filter((c) => c.isMastered).length;
  const progressPercent = studySet.flashcards.length
    ? Math.round((masteredCount / studySet.flashcards.length) * 100)
    : 0;

  return (
    <div className="w-full max-w-[1280px] mx-auto mb-10">
      <div className="saas-card relative overflow-hidden p-8 sm:p-10">
        {/* Subtle Background Highlight Glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#F4C430]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-3xl">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-[13px] font-medium bg-[#F4C430]/10 text-[#F4C430] border border-[#F4C430]/20">
                {studySet.category}
              </span>
              <span className="px-3 py-1 rounded-md text-[13px] font-medium bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/[0.08]">
                {studySet.difficulty} Level
              </span>
              <span className="text-[13px] text-slate-500 dark:text-white/60 flex items-center space-x-1.5 font-mono">
                <Clock className="w-4 h-4 text-[#F4C430]" />
                <span>{studySet.estimatedTimeMinutes} min study</span>
              </span>
            </div>

            {/* 42px 700 Hero Title */}
            <h1 className="text-3xl sm:text-[42px] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {studySet.title}
            </h1>

            {/* Body Summary */}
            <p className="text-[16px] font-normal text-slate-600 dark:text-white/60 leading-relaxed max-w-2xl">
              {studySet.summary}
            </p>

            {/* Quick Statistics Strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-[13px] font-medium text-slate-600 dark:text-white/70">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">{studySet.flashcards.length}</strong> flashcards</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">{studySet.quiz.length}</strong> quizzes</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-900 dark:text-white font-semibold">{studySet.keyConcepts.length}</strong> key terms</span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Progress Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-4 shrink-0">
            <div className="space-y-3 w-full sm:w-auto">
              <button
                onClick={onContinueLearning}
                className="saas-button-primary w-full justify-center"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Continue Learning</span>
              </button>

              <button
                onClick={onToggleInput}
                className="saas-button-secondary w-full justify-center"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showInput ? 'Close Content Generator' : 'Generate More Content'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar Underneath */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center justify-between text-[13px] font-medium mb-2">
            <span className="text-slate-600 dark:text-white/60">Module Mastery Progress</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#111827] overflow-hidden border border-slate-200/60 dark:border-white/[0.06]">
            <div
              className="bg-[#F4C430] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
