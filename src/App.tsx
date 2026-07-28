import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DashboardStrip } from './components/DashboardStrip';
import { InputSection } from './components/InputSection';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import { GlossaryView } from './components/GlossaryView';
import { NotesView } from './components/NotesView';
import { InterviewView } from './components/InterviewView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { RefinementBar } from './components/RefinementBar';
import { SessionHistory } from './components/SessionHistory';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useStudySession } from './hooks/useStudySession';
import { ActiveTabType, GenerationMode } from './types/study';
import { Layers, HelpCircle, BookOpen, FileText, Award, Building2, Keyboard } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('flashcards');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [showInputSection, setShowInputSection] = useState<boolean>(false);
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

  const handleFormSubmit = (
    prompt: string,
    options?: { generationMode?: GenerationMode; simulateFailure?: boolean; forcedErrorType?: string }
  ) => {
    setLastSubmittedPrompt(prompt);
    setShowInputSection(false);
    createStudySet(prompt, options);
  };

  const handleRetry = () => {
    if (lastSubmittedPrompt) {
      createStudySet(lastSubmittedPrompt);
    }
  };

  const scrollToFlashcards = () => {
    setActiveTab('flashcards');
    const el = document.getElementById('tab-view-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-[#F3F4F6] flex flex-col transition-colors duration-150">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedHistory.length}
        isMockMode={isMockMode}
        activeTopic={activeStudySet?.title}
        category={activeStudySet?.category}
        xpCount={1240}
        streakDays={5}
      />

      {/* Main Container - 1280px max width, 40-56px section spacing */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Error Alert Display */}
        {errorDetail && (
          <ErrorAlert error={errorDetail} onRetry={handleRetry} onDismiss={clearError} />
        )}

        {/* Input Generator Section */}
        {(showInputSection || !activeStudySet) && !isLoading && (
          <InputSection onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {/* Loading State Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Active Study Set Workspace */}
        {activeStudySet && !isLoading && (
          <div className="space-y-10 animate-fade-in">
            {/* 1. Hero Section (42px title, statistics strip, progress bar, CTAs) */}
            <HeroSection
              studySet={activeStudySet}
              onToggleInput={() => setShowInputSection(!showInputSection)}
              showInput={showInputSection}
              onContinueLearning={scrollToFlashcards}
            />

            {/* 2. Dashboard Strip (Mastered, Remaining, Review Today, Weekly Streak, Circular Progress) */}
            <DashboardStrip studySet={activeStudySet} streakDays={5} />

            {/* 3. Segmented Control Tabs */}
            <div id="tab-view-container" className="flex justify-center pt-2">
              <div className="inline-flex p-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06] shadow-sm flex-wrap justify-center gap-1">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`segmented-tab ${
                    activeTab === 'flashcards' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#F4C430]" />
                  <span>Flashcards ({activeStudySet.flashcards.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`segmented-tab ${
                    activeTab === 'quiz' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#F4C430]" />
                  <span>Quiz ({activeStudySet.quiz.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`segmented-tab ${
                    activeTab === 'glossary' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#F4C430]" />
                  <span>Key Terms ({activeStudySet.keyConcepts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`segmented-tab ${
                    activeTab === 'notes' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#F4C430]" />
                  <span>Notes</span>
                </button>

                <button
                  onClick={() => setActiveTab('interview')}
                  className={`segmented-tab ${
                    activeTab === 'interview' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#F4C430]" />
                  <span>Interview Prep</span>
                </button>

                <button
                  onClick={() => setActiveTab('case_studies')}
                  className={`segmented-tab ${
                    activeTab === 'case_studies' ? 'segmented-tab-active' : 'segmented-tab-inactive'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#F4C430]" />
                  <span>Case Studies</span>
                </button>
              </div>
            </div>

            {/* 4. Tab Panel View */}
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

              {activeTab === 'notes' && (
                <NotesView studySet={activeStudySet} />
              )}

              {activeTab === 'interview' && (
                <InterviewView studySet={activeStudySet} />
              )}

              {activeTab === 'case_studies' && (
                <CaseStudiesView studySet={activeStudySet} />
              )}
            </div>

            {/* 5. AI Refinement Engine Loop */}
            <RefinementBar onRefine={handleRefine} isRefining={isRefining} />
          </div>
        )}
      </main>

      {/* Session History Drawer */}
      <SessionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={savedHistory}
        onSelectSession={loadSavedSession}
        activeSessionId={activeStudySet?.id}
      />

      {/* Keyboard Shortcuts Bottom Bar & Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.06] py-6 text-center text-xs text-slate-500 dark:text-white/40 font-mono space-y-2">
        <div className="flex items-center justify-center space-x-4 text-[12px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Keyboard className="w-3.5 h-3.5 text-[#F4C430]" />
            <span>Shortcuts:</span>
          </span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111827] border border-slate-300 dark:border-white/[0.1]">Space</kbd> Flip</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111827] border border-slate-300 dark:border-white/[0.1]">← →</kbd> Navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111827] border border-slate-300 dark:border-white/[0.1]">1-4</kbd> Grade</span>
        </div>
        <p>
          MindForge Study AI • Built for Senior SDE Reference • Production SaaS Architecture
        </p>
      </footer>
    </div>
  );
}
