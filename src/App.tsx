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
import { Layers, HelpCircle, BookOpen, Clock, PlusCircle } from 'lucide-react';

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

  const [showInputSection, setShowInputSection] = useState<boolean>(false);

  const handleFormSubmit = (prompt: string, options?: { simulateFailure?: boolean; forcedErrorType?: string }) => {
    setLastSubmittedPrompt(prompt);
    setShowInputSection(false);
    createStudySet(prompt, options);
  };

  const handleRetry = () => {
    if (lastSubmittedPrompt) {
      createStudySet(lastSubmittedPrompt);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Error Alert Display */}
        {errorDetail && (
          <ErrorAlert error={errorDetail} onRetry={handleRetry} onDismiss={clearError} />
        )}

        {/* Input Section (Always available if toggled or no active set) */}
        {(showInputSection || !activeStudySet) && !isLoading && (
          <InputSection onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {/* Loading State Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Active Study Set Dashboard */}
        {activeStudySet && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Bar for Topic Summary & New Topic Trigger */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-yellow-950/70 dark:text-yellow-300 border border-amber-200 dark:border-amber-800">
                    {activeStudySet.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-[#070b14] dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {activeStudySet.difficulty} Level
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-yellow-500" />
                    <span>~{activeStudySet.estimatedTimeMinutes} min study</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeStudySet.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                  {activeStudySet.summary}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowInputSection((prev) => !prev);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="sde-button-secondary shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showInputSection ? 'Close Input' : 'New Topic'}</span>
              </button>
            </div>

            {/* Navigation Tabs (Soft Yellow active tab) */}
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
                    activeTab === 'flashcards'
                      ? 'bg-yellow-400 text-slate-950 shadow-sm border border-yellow-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-slate-950" />
                  <span>Flashcards ({activeStudySet.flashcards.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
                    activeTab === 'quiz'
                      ? 'bg-yellow-400 text-slate-950 shadow-sm border border-yellow-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-950" />
                  <span>Quiz ({activeStudySet.quiz.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
                    activeTab === 'glossary'
                      ? 'bg-yellow-400 text-slate-950 shadow-sm border border-yellow-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                  <span>Key Terms ({activeStudySet.keyConcepts.length})</span>
                </button>
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-1">
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
      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 font-mono">
        <p>
          MindForge AI • React 18, TypeScript, Zod Schema & Gemini Proxy
        </p>
      </footer>
    </div>
  );
}
