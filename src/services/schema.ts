import { z } from 'zod';

const normalizeDifficulty = (val: unknown, allowed: string[], fallback: string) => {
  if (typeof val === 'string') {
    const capitalized = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    if (allowed.includes(capitalized)) return capitalized;
  }
  return fallback;
};

export const FlashcardSchema = z.object({
  id: z.string().optional().default(() => `card_${Math.random().toString(36).substring(2, 9)}`),
  question: z.string().min(1, "Question cannot be empty"),
  answer: z.string().min(1, "Answer cannot be empty"),
  hint: z.string().optional().default("Think about the key principles of this topic."),
  category: z.string().optional().default("General"),
  difficulty: z.preprocess(
    (val) => normalizeDifficulty(val, ['Easy', 'Medium', 'Hard'], 'Medium'),
    z.enum(['Easy', 'Medium', 'Hard'])
  ),
  isMastered: z.boolean().optional().default(false),
  needsReview: z.boolean().optional().default(false),
});

export const QuizQuestionSchema = z.object({
  id: z.string().optional().default(() => `q_${Math.random().toString(36).substring(2, 9)}`),
  question: z.string().min(1, "Quiz question cannot be empty"),
  options: z.array(z.string()).min(2, "Quiz question must have at least 2 options"),
  correctOptionIndex: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof val === 'number' ? val : 0;
  }, z.number().int().min(0)),
  explanation: z.string().optional().default("Correct answer based on key principles."),
  difficulty: z.preprocess(
    (val) => normalizeDifficulty(val, ['Easy', 'Medium', 'Hard'], 'Medium'),
    z.enum(['Easy', 'Medium', 'Hard'])
  ),
});

export const KeyConceptSchema = z.object({
  term: z.string().min(1, "Term name cannot be empty"),
  definition: z.string().min(1, "Definition cannot be empty"),
  importance: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.toLowerCase().includes('core')) return 'Core Concept';
      if (val.toLowerCase().includes('key') || val.toLowerCase().includes('detail')) return 'Key Detail';
      if (val.toLowerCase().includes('adv')) return 'Advanced Concept';
    }
    return 'Core Concept';
  }, z.enum(['Core Concept', 'Key Detail', 'Advanced Concept'])),
});

export const RawStudySetSchema = z.object({
  title: z.string().optional().default("AI Generated Study Set"),
  summary: z.string().optional().default("Comprehensive overview generated from your input topic."),
  difficulty: z.preprocess(
    (val) => normalizeDifficulty(val, ['Beginner', 'Intermediate', 'Advanced'], 'Intermediate'),
    z.enum(['Beginner', 'Intermediate', 'Advanced'])
  ),
  category: z.string().optional().default("General Knowledge"),
  estimatedTimeMinutes: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 15 : parsed;
    }
    return typeof val === 'number' ? val : 15;
  }, z.number().optional().default(15)),
  flashcards: z.array(FlashcardSchema).min(1, "At least 1 flashcard required"),
  quiz: z.array(QuizQuestionSchema).min(1, "At least 1 quiz question required"),
  keyConcepts: z.array(KeyConceptSchema).optional().default([]),
});

export type RawStudySet = z.infer<typeof RawStudySetSchema>;
