export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';

export type GenerationMode = 'all' | 'flashcards_only' | 'quiz_only';

export interface QuickCheck {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isMastered?: boolean;
  needsReview?: boolean;
  quickCheck?: QuickCheck;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  userSelectedIndex?: number | null;
}

export interface KeyConcept {
  term: string;
  definition: string;
  importance?: 'Core Concept' | 'Key Detail' | 'Advanced Concept';
}

export interface StudySet {
  id: string;
  createdAt: string;
  topicPrompt: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  estimatedTimeMinutes: number;
  generationMode?: GenerationMode;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  keyConcepts: KeyConcept[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  completedAt: string;
  wrongQuestionIds: string[];
}

export interface FailureDetail {
  type: 'NETWORK_ERROR' | 'MALFORMED_JSON' | 'SCHEMA_MISMATCH' | 'STALE_RESPONSE' | 'SERVER_ERROR';
  title: string;
  message: string;
  rawResponseSnippet?: string;
  suggestedAction: string;
}
