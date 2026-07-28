import React, { useState } from 'react';
import { GenerationMode } from '../types/study';
import { BookOpen, AlertTriangle, Play, RefreshCw, Zap, Layers, HelpCircle, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (prompt: string, options?: { generationMode?: GenerationMode; simulateFailure?: boolean; forcedErrorType?: string }) => void;
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
  const [selectedMode, setSelectedMode] = useState<GenerationMode>('all');
  const [showFailureDemoMenu, setShowFailureDemoMenu] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSubmit(inputPrompt.trim(), { generationMode: selectedMode });
  };

  const handleSelectPreset = (presetText: string) => {
    setInputPrompt(presetText);
    onSubmit(presetText, { generationMode: selectedMode });
  };

  const handleSimulateFailure = (errorType: string) => {
    onSubmit(inputPrompt || 'Simulated Test Prompt', {
      generationMode: selectedMode,
      simulateFailure: true,
      forcedErrorType: errorType,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm transition">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Source Input & Generation Mode</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Enter lecture notes, code, or study topic
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs mb-5">
          Select what output components you want generated from your input topic.
        </p>

        {/* Generation Mode Option Selector */}
        <div className="mb-4">
          <div className="text-[11px] font-mono text-slate-400 mb-2">
            Select Output Package Mode:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMode('all')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                selectedMode === 'all'
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-[#070b14] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Full Package (Cards + Quiz)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('flashcards_only')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                selectedMode === 'flashcards_only'
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-[#070b14] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-950" />
              <span>Flashcards Only</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode('quiz_only')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                selectedMode === 'quiz_only'
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-[#070b14] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-950" />
              <span>Quiz Only</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. Paste notes on React 18 hooks, or type 'System Design Caching'..."
              disabled={isLoading}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition min-h-[100px]"
            />

            <div className="absolute bottom-2.5 right-3">
              <span className="text-[10px] text-slate-400 font-mono">
                {inputPrompt.length} chars
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Failure Mode Demo Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFailureDemoMenu(!showFailureDemoMenu)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Test Failure Handling</span>
              </button>

              {showFailureDemoMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-20 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                    Simulate Bad AI Output
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('MALFORMED_JSON');
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Malformed JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('WRONG_SHAPE');
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Schema Mismatch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFailureDemoMenu(false);
                      handleSimulateFailure('SERVER_500');
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>HTTP 500 Failure</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="sde-button-primary"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Output...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>
                    Generate {selectedMode === 'flashcards_only' ? 'Flashcards' : selectedMode === 'quiz_only' ? 'Quiz' : 'Full Suite'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 mb-2.5">
            Quick Preset Topics:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.prompt)}
                disabled={isLoading}
                className="text-left p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800 hover:border-yellow-400 transition group flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {preset.prompt}
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-500 transition mt-0.5 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
