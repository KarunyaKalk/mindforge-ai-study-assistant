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
    <div className="w-full max-w-4xl mx-auto bg-navy-900 text-white rounded-3xl p-5 border border-navy-800 shadow-xl relative overflow-hidden">
      <div className="flex items-center space-x-2 text-xs font-black text-accent-400 mb-2">
        <SlidersHorizontal className="w-4 h-4 text-accent-400" />
        <span>AI Refinement Loop (Modify Active Study Set)</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={refinementInput}
          onChange={(e) => setRefinementInput(e.target.value)}
          placeholder="e.g. 'Add 3 flashcards on memory management', or 'Make quiz harder'..."
          disabled={isRefining}
          className="flex-1 px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
        />

        <button
          type="submit"
          disabled={isRefining || !refinementInput.trim()}
          className="px-5 py-2.5 bg-accent-400 hover:bg-accent-300 text-navy-950 text-xs font-black rounded-xl transition flex items-center space-x-1.5 border border-accent-300 disabled:opacity-50"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-navy-950" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-navy-950" />
              <span>Apply Refinement</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Refinement Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-navy-800 text-[11px]">
        <span className="text-slate-400 font-medium">Quick refinements:</span>
        {SAMPLE_REFINEMENTS.map((text, i) => (
          <button
            key={i}
            onClick={() => onRefine(text)}
            disabled={isRefining}
            className="px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-300 border border-navy-800 transition"
          >
            + {text}
          </button>
        ))}
      </div>
    </div>
  );
};
