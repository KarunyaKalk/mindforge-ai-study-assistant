import React from 'react';
import { StudySet } from '../types/study';
import { CheckCircle2, Clock, AlertCircle, Flame, Layers, Award } from 'lucide-react';

interface DashboardStripProps {
  studySet: StudySet;
  streakDays?: number;
}

export const DashboardStrip: React.FC<DashboardStripProps> = ({ studySet, streakDays = 5 }) => {
  const masteredCount = studySet.flashcards.filter((c) => c.isMastered).length;
  const reviewCount = studySet.flashcards.filter((c) => c.needsReview).length;
  const remainingCount = Math.max(0, studySet.flashcards.length - masteredCount);
  const completionPercentage = studySet.flashcards.length
    ? Math.round((masteredCount / studySet.flashcards.length) * 100)
    : 0;

  // Animated Circular SVG Progress variables
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="w-full max-w-[1280px] mx-auto mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Metric 1: Mastered */}
        <div className="saas-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Mastered</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{masteredCount}</div>
          </div>
        </div>

        {/* Metric 2: Remaining */}
        <div className="saas-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#111827] text-slate-500 dark:text-white/60 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-white/[0.06]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Remaining</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{remainingCount}</div>
          </div>
        </div>

        {/* Metric 3: Review Today */}
        <div className="saas-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Review Today</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{reviewCount}</div>
          </div>
        </div>

        {/* Metric 4: Est. Completion */}
        <div className="saas-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Est. Completion</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">~12m</div>
          </div>
        </div>

        {/* Metric 5: Weekly Streak */}
        <div className="saas-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Weekly Streak</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{streakDays} Days</div>
          </div>
        </div>

        {/* Metric 6: Animated Circular Progress Indicator */}
        <div className="saas-card p-4 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <div className="text-[13px] font-medium text-slate-500 dark:text-white/60">Completion</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{completionPercentage}%</div>
          </div>

          {/* SVG Circular Progress Meter */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="text-slate-200 dark:text-[#111827]"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="text-[#F4C430] transition-all duration-700 ease-out"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <Award className="w-5 h-5 text-[#F4C430] absolute" />
          </div>
        </div>
      </div>
    </div>
  );
};
