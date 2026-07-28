import React, { useState } from 'react';
import { FailureDetail } from '../types/study';
import { AlertOctagon, RotateCcw, ChevronDown, ChevronUp, Terminal, X, ShieldAlert } from 'lucide-react';

interface ErrorAlertProps {
  error: FailureDetail;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, onDismiss }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">
                {error.type}
              </span>
              <h3 className="text-lg font-extrabold text-red-900 dark:text-red-200">{error.title}</h3>
            </div>

            <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">{error.message}</p>

            <div className="mt-3 text-xs font-semibold text-red-800 dark:text-red-200 flex items-center space-x-1">
              <span>Suggested Resolution: </span>
              <span className="font-normal text-red-700 dark:text-red-300">{error.suggestedAction}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 text-red-400 hover:text-red-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Raw Snippet Inspector for Interns */}
      {error.rawResponseSnippet && (
        <div className="mt-4 pt-3 border-t border-red-200/60 dark:border-red-900/60">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-xs font-semibold text-red-800 dark:text-red-300 hover:underline"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Hide Raw Response Diagnostics' : 'Inspect Raw AI Output Snippet'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-red-400 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-48">
              {error.rawResponseSnippet}
            </pre>
          )}
        </div>
      )}

      {/* Retry Action Bar */}
      <div className="mt-5 flex items-center justify-end space-x-3">
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
        >
          Dismiss
        </button>
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Generation</span>
        </button>
      </div>
    </div>
  );
};
