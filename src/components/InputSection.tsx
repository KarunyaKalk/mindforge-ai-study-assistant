import React, { useState } from 'react';
import { Sparkles, BookOpen, AlertTriangle, Play, RefreshCw, Zap } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (prompt: string, options?: { simulateFailure?: boolean; forcedErrorType?: string }) => void;
  isLoading: boolean;
}

const PRESET_TOPICS = [
  {
    title: 'React 18 & Architecture',
    prompt: 'React 18 Fiber reconciliation, virtual DOM diffing, useLayoutEffect vs useEffect, and AbortController race condition prevention in state management.',
  },
  {
    title: 'System Design & CAP Theorem',
    prompt: 'Distributed system design principles covering CAP theorem, eventual consistency, database sharding, caching strategies, and consistent hashing.',
  },
  {
    title: 'Quantum Computing Basics',
    prompt: 'Introduction to Quantum Computing: Qubits, Superposition, Entanglement, Quantum Logic Gates, and Shor Algorithm applications in modern cryptography.',
  },
  {
    title: 'Photosynthesis & Biology',
    prompt: 'Plant Biology: Light-dependent reactions in chloroplasts, Calvin cycle, ATP synthase, electron transport chain, and cellular respiration comparison.',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [showFailureDemoMenu, setShowFailureDemoMenu] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSubmit(inputPrompt.trim());
  };

  const handleSelectPreset = (presetText: string) => {
    setInputPrompt(presetText);
    onSubmit(presetText);
  };

  const handleSimulateFailure = (errorType: string) => {
    onSubmit(inputPrompt || 'Simulated Test Prompt', {
      simulateFailure: true,
      forcedErrorType: errorType,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-all">
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Input Lecture Notes, Articles, or Study Topics</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          What would you like to master today?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Paste lecture notes, code snippets, or a topic description. Our AI transforms it into structured 3D flashcards, an interactive quiz, and key concepts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. Paste lecture notes on React reconciliation and hooks, or type 'System Design Caching'..."
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition duration-200 resize-y min-h-[110px]"
            />

            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">
                {inputPrompt.length} chars
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Failure Mode Demo Dropdown for Intern Evaluation */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFailureDemoMenu(!showFailureDemoMenu)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Test Failure Handling</span>
              </button>

              {showFailureDemoMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-20 space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Simulate Bad AI Output
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('MALFORMED_JSON');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Malformed JSON Output</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('WRONG_SHAPE');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Schema Mismatch / Wrong Shape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('SERVER_500');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>HTTP 500 Server Failure</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Study Package...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Study Package</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Prompt Suggestions */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Try one of these sample topics:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.prompt)}
                disabled={isLoading}
                className="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 transition group flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {preset.prompt}
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition mt-0.5 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
