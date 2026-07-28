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
    <div className="w-full max-w-4xl mx-auto bg-[#0f172a] text-white rounded-2xl p-5 border border-slate-800 shadow-md">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold text-yellow-400 mb-2">
        <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-400" />
        <span>Refinement Engine (Update Active Study Suite)</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={refinementInput}
          onChange={(e) => setRefinementInput(e.target.value)}
          placeholder="e.g. 'Add 3 flashcards on memory leaks'..."
          disabled={isRefining}
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#070b14] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />

        <button
          type="submit"
          disabled={isRefining || !refinementInput.trim()}
          className="sde-button-primary"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Refine</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Refinement Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
        <span className="text-slate-400 font-mono">Quick Refine:</span>
        {SAMPLE_REFINEMENTS.map((text, i) => (
          <button
            key={i}
            onClick={() => onRefine(text)}
            disabled={isRefining}
            className="px-2.5 py-1 rounded-lg bg-[#070b14] hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            + {text}
          </button>
        ))}
      </div>
    </div>
  );
};
