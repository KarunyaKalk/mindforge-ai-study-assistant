import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import { GlossaryView } from './components/GlossaryView';
import { RefinementBar } from './components/RefinementBar';
import { SessionHistory } from './components/SessionHistory';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useStudySession } from './hooks/useStudySession';
import { Layers, HelpCircle, BookOpen, Clock, Sparkles, PlusCircle } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz' | 'glossary'>('flashcards');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState<string>('');

  const {
    activeStudySet,
    isLoading,
    isRefining,
    errorDetail,
    isMockMode,
    savedHistory,
    quizAnswers,
    quizCompleted,
    activeQuizQuestions,
    isReTestingWrong,
    createStudySet,
    handleRefine,
    toggleFlashcardStatus,
    answerQuizQuestion,
    submitQuiz,
    retestWrongAnswers,
    resetFullQuiz,
    loadSavedSession,
    clearError,
  } = useStudySession();

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFormSubmit = (prompt: string, options?: { simulateFailure?: boolean; forcedErrorType?: string }) => {
    setLastSubmittedPrompt(prompt);
    createStudySet(prompt, options);
  };

  const handleRetry = () => {
    if (lastSubmittedPrompt) {
      createStudySet(lastSubmittedPrompt);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedHistory.length}
        isMockMode={isMockMode}
        activeTopic={activeStudySet?.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert Display */}
        {errorDetail && (
          <ErrorAlert error={errorDetail} onRetry={handleRetry} onDismiss={clearError} />
        )}

        {/* Input Section (Always available if no set or requested) */}
        {!activeStudySet && !isLoading && (
          <InputSection onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {/* Loading State Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Active Study Set Dashboard */}
        {activeStudySet && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar for Topic Summary & New Topic Trigger */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {activeStudySet.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {activeStudySet.difficulty} Level
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{activeStudySet.estimatedTimeMinutes} min study</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeStudySet.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {activeStudySet.summary}
                </p>
              </div>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Clear active set to return to input prompt view
                  loadSavedSession(null);
                }}
                className="shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                <PlusCircle className="w-4 h-4 text-brand-500" />
                <span>New Topic</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    activeTab === 'flashcards'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Flashcards ({activeStudySet.flashcards.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    activeTab === 'quiz'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Quiz ({activeStudySet.quiz.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    activeTab === 'glossary'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Key Terms ({activeStudySet.keyConcepts.length})</span>
                </button>
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-2">
              {activeTab === 'flashcards' && (
                <FlashcardDeck
                  cards={activeStudySet.flashcards}
                  onToggleStatus={toggleFlashcardStatus}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizView
                  questions={activeQuizQuestions}
                  quizAnswers={quizAnswers}
                  quizCompleted={quizCompleted}
                  isReTestingWrong={isReTestingWrong}
                  onAnswerQuestion={answerQuizQuestion}
                  onSubmitQuiz={submitQuiz}
                  onRetestWrongAnswers={retestWrongAnswers}
                  onResetFullQuiz={resetFullQuiz}
                />
              )}

              {activeTab === 'glossary' && (
                <GlossaryView concepts={activeStudySet.keyConcepts} />
              )}
            </div>

            {/* AI Refinement Loop Section */}
            <RefinementBar onRefine={handleRefine} isRefining={isRefining} />
          </div>
        )}
      </main>

      {/* History Drawer */}
      <SessionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={savedHistory}
        onSelectSession={loadSavedSession}
        activeSessionId={activeStudySet?.id}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Built for Senior SDE Internship Reference • Powered by React 18, TypeScript, Zod & Gemini AI
        </p>
      </footer>
    </div>
  );
}
