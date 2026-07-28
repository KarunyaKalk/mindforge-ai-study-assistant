import React from 'react';
import { StudySet } from '../types/study';
import { X, History, ArrowRight, Calendar, BookOpen } from 'lucide-react';

interface SessionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: StudySet[];
  onSelectSession: (set: StudySet) => void;
  activeSessionId?: string;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSession,
  activeSessionId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 h-full p-6 shadow-2xl border-l border-slate-200 dark:border-navy-800 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-4">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-accent-500" />
              <h3 className="text-lg font-black text-navy-950 dark:text-white">Saved Study Sessions</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Reload any past generated flashcard deck and quiz session stored locally in your browser.
          </p>

          {/* Session List */}
          {history.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No saved study sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((set) => {
                const isActive = set.id === activeSessionId;
                const formattedDate = new Date(set.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={set.id}
                    onClick={() => {
                      onSelectSession(set);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-accent-50 dark:bg-accent-950/40 border-accent-400 text-navy-950 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center space-x-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="font-bold text-accent-700 dark:text-accent-400">
                          {set.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-navy-950 dark:text-white line-clamp-1">
                        {set.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {set.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-3 mt-3 border-t border-slate-200/60 dark:border-navy-800">
                      <span className="text-slate-400 font-mono">
                        {set.flashcards.length} Cards • {set.quiz.length} Questions
                      </span>
                      <span className="font-black text-accent-700 dark:text-accent-400 flex items-center space-x-1">
                        <span>Load</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-navy-800 text-center">
          <p className="text-[11px] text-slate-400">
            Sessions persist automatically in browser LocalStorage.
          </p>
        </div>
      </div>
    </div>
  );
};
