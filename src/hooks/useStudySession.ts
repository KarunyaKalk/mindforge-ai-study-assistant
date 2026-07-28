import { useState, useRef, useCallback } from 'react';
import { StudySet, FailureDetail, QuizResult } from '../types/study';
import { generateStudySet, refineStudySet } from '../services/aiService';
import { useLocalStorage } from './useLocalStorage';

import { generateMockStudySet } from '../services/mockGenerator';

const DEFAULT_SET = generateMockStudySet('React 18 & Frontend Architecture');

export function useStudySession() {
  const [activeStudySet, setActiveStudySet] = useState<StudySet | null>(DEFAULT_SET);
  const [savedHistory, setSavedHistory] = useLocalStorage<StudySet[]>('mindforge_study_history', [DEFAULT_SET]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorDetail, setErrorDetail] = useState<FailureDetail | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Active quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<any[]>(DEFAULT_SET.quiz);
  const [isReTestingWrong, setIsReTestingWrong] = useState<boolean>(false);

  // AbortController reference for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save session to history
  const saveToHistory = useCallback((set: StudySet) => {
    setSavedHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== set.id);
      return [set, ...filtered].slice(0, 15); // store up to 15 recent sets
    });
  }, [setSavedHistory]);

  // Generate new Study Set
  const createStudySet = async (
    prompt: string,
    options?: { simulateFailure?: boolean; forcedErrorType?: string }
  ) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorDetail(null);

    try {
      const result = await generateStudySet(prompt, {
        signal: controller.signal,
        simulateFailure: options?.simulateFailure,
        forcedErrorType: options?.forcedErrorType,
      });

      setActiveStudySet(result.studySet);
      setActiveQuizQuestions(result.studySet.quiz);
      setQuizAnswers({});
      setQuizCompleted(false);
      setIsReTestingWrong(false);
      setIsMockMode(result.isMock);

      saveToHistory(result.studySet);
    } catch (err: any) {
      if (err.type === 'STALE_RESPONSE') {
        console.log('Stale request cancelled safely.');
        return;
      }
      setErrorDetail(err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Refine current Study Set
  const handleRefine = async (refinementPrompt: string) => {
    if (!activeStudySet) return;
    setIsRefining(true);
    try {
      const result = await refineStudySet(activeStudySet, refinementPrompt);
      setActiveStudySet(result.studySet);
      setActiveQuizQuestions(result.studySet.quiz);
      saveToHistory(result.studySet);
    } catch (err: any) {
      setErrorDetail({
        type: 'SERVER_ERROR',
        title: 'Refinement Failed',
        message: err.message || 'Could not apply refinement.',
        suggestedAction: 'Try rephrasing your refinement request.',
      });
    } finally {
      setIsRefining(false);
    }
  };

  // Toggle flashcard mastered / review status
  const toggleFlashcardStatus = useCallback((cardId: string, statusType: 'mastered' | 'review') => {
    setActiveStudySet((prev) => {
      if (!prev) return null;
      const updatedCards = prev.flashcards.map((card) => {
        if (card.id === cardId) {
          if (statusType === 'mastered') {
            return { ...card, isMastered: !card.isMastered, needsReview: false };
          } else {
            return { ...card, needsReview: !card.needsReview, isMastered: false };
          }
        }
        return card;
      });
      const updatedSet = { ...prev, flashcards: updatedCards };
      saveToHistory(updatedSet);
      return updatedSet;
    });
  }, [saveToHistory]);

  // Record quiz answer
  const answerQuizQuestion = useCallback((questionId: string, selectedIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }));
  }, []);

  // Submit quiz and calculate results
  const submitQuiz = useCallback((): QuizResult | null => {
    if (!activeQuizQuestions.length) return null;

    let correctCount = 0;
    const wrongIds: string[] = [];

    activeQuizQuestions.forEach((q) => {
      const selected = quizAnswers[q.id];
      if (selected === q.correctOptionIndex) {
        correctCount++;
      } else {
        wrongIds.push(q.id);
      }
    });

    setQuizCompleted(true);

    return {
      totalQuestions: activeQuizQuestions.length,
      correctAnswers: correctCount,
      scorePercentage: Math.round((correctCount / activeQuizQuestions.length) * 100),
      completedAt: new Date().toISOString(),
      wrongQuestionIds: wrongIds,
    };
  }, [activeQuizQuestions, quizAnswers]);

  // Re-test wrong answers workflow (PDF Requirement!)
  const retestWrongAnswers = useCallback((wrongQuestionIds: string[]) => {
    if (!activeStudySet) return;
    const filteredQuestions = activeStudySet.quiz.filter((q) => wrongQuestionIds.includes(q.id));
    if (filteredQuestions.length > 0) {
      setActiveQuizQuestions(filteredQuestions);
      setQuizAnswers({});
      setQuizCompleted(false);
      setIsReTestingWrong(true);
    }
  }, [activeStudySet]);

  // Reset quiz to full set
  const resetFullQuiz = useCallback(() => {
    if (!activeStudySet) return;
    setActiveQuizQuestions(activeStudySet.quiz);
    setQuizAnswers({});
    setQuizCompleted(false);
    setIsReTestingWrong(false);
  }, [activeStudySet]);

  // Load a session from history or clear active session
  const loadSavedSession = useCallback((set: StudySet | null) => {
    setActiveStudySet(set);
    setActiveQuizQuestions(set ? set.quiz : []);
    setQuizAnswers({});
    setQuizCompleted(false);
    setIsReTestingWrong(false);
    setErrorDetail(null);
  }, []);

  // Clear current error
  const clearError = useCallback(() => {
    setErrorDetail(null);
  }, []);

  return {
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
  };
}
