import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';

interface RefinementBarProps {
  onRefine: (refinementPrompt: string) => void;
  isRefining: boolean;
}

const SAMPLE_REFINEMENTS = [
  'Add 3 harder flashcards on edge cases',
  'Simplify quiz explanations for beginners',
  'Add key terms on performance optimization',
];

export const RefinementBar: React.FC<RefinementBarProps> = ({ onRefine, isRefining }) => {
  const [refinementInput, setRefinementInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || isRefining) return;
    onRefine(refinementInput.trim());
    setRefinementInput('');
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto saas-card p-6 border border-slate-200/80 dark:border-white/[0.06]">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#F4C430] mb-3">
        <SlidersHorizontal className="w-4 h-4 text-[#F4C430]" />
        <span>Refinement Engine (Update Active Study Suite)</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={refinementInput}
          onChange={(e) => setRefinementInput(e.target.value)}
          placeholder="e.g. 'Add 3 flashcards on memory leaks'..."
          disabled={isRefining}
          className="flex-1 h-12 px-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.08] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F4C430] transition"
        />

        <button
          type="submit"
          disabled={isRefining || !refinementInput.trim()}
          className="saas-button-primary shrink-0"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Apply Refinement</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Refinement Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
        <span className="text-slate-400 font-mono">Quick Refine:</span>
        {SAMPLE_REFINEMENTS.map((text, i) => (
          <button
            key={i}
            onClick={() => onRefine(text)}
            disabled={isRefining}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#111827] hover:bg-slate-200 dark:hover:bg-[#1f293d] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/[0.08] transition"
          >
            + {text}
          </button>
        ))}
      </div>
    </div>
  );
};
