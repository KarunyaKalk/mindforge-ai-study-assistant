import { RawStudySetSchema } from './schema';
import { StudySet, FailureDetail } from '../types/study';
import { generateMockStudySet, generateMockRefinedSet } from './mockGenerator';

/**
 * Fuzzy JSON extractor and repair function.
 * LLMs frequently wrap JSON in markdown codeblocks (```json ... ```)
 * or include leading/trailing text. This function extracts and attempts to repair raw JSON.
 */
export function extractAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();

  // Remove markdown code fences if present
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  }

  // Find start of JSON object or array
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // First try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Attempt multi-stage JSON repairs:
    // 1. Remove trailing commas in objects or arrays
    let repaired = cleaned.replace(/,\s*([\}\]])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch (e1) {
      // 2. Replace literal unescaped newlines/tabs inside double-quoted string values
      try {
        repaired = repaired.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
          return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        });
        return JSON.parse(repaired);
      } catch (e2) {
        throw new Error(`JSON Syntax Error: ${(initialErr as Error).message}. Snippet: "${cleaned.slice(0, 120)}..."`);
      }
    }
  }
}

/**
 * State tracking for request sequence to prevent stale response overwrites
 */
let activeRequestId = 0;

export async function generateStudySet(
  prompt: string,
  options?: {
    signal?: AbortSignal;
    simulateFailure?: boolean;
    forcedErrorType?: string;
  }
): Promise<{ studySet: StudySet; isMock: boolean }> {
  // Increment request sequence ID
  const currentRequestId = ++activeRequestId;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        simulateFailure: options?.simulateFailure,
        forcedErrorType: options?.forcedErrorType,
      }),
      signal: options?.signal,
    });

    // Stale check
    if (currentRequestId !== activeRequestId) {
      const error = new Error('Stale response discarded because a newer request was issued.') as any;
      error.isStale = true;
      throw error;
    }

    if (!response.ok) {
      // If deployed on static hosting like GitHub Pages where /api/generate returns 404, fallback to client mock generator
      if (response.status === 404 && !options?.simulateFailure) {
        console.warn('Backend API proxy returned 404 (Static hosting detected). Activating client-side fallback.');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (currentRequestId !== activeRequestId) {
          const error = new Error('Stale request cancelled.') as any;
          error.isStale = true;
          throw error;
        }
        const mockSet = generateMockStudySet(prompt);
        return { studySet: mockSet, isMock: true };
      }

      const errJson = await response.json().catch(() => ({}));
      const failure: FailureDetail = {
        type: response.status >= 500 ? 'SERVER_ERROR' : 'NETWORK_ERROR',
        title: `API Request Failed (HTTP ${response.status})`,
        message: errJson.error || errJson.details || 'Failed to communicate with AI API backend.',
        suggestedAction: 'Please check your connection or try again in a few moments.',
      };
      throw failure;
    }

    const data = await response.json();

    // Check if server indicated fallback mock mode (e.g. no GEMINI_API_KEY)
    if (data.useMockFallback) {
      // Simulate brief network latency for realism
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (currentRequestId !== activeRequestId) {
        const error = new Error('Stale request cancelled.') as any;
        error.isStale = true;
        throw error;
      }
      const mockSet = generateMockStudySet(prompt);
      return { studySet: mockSet, isMock: true };
    }

    if (!data.rawText) {
      const failure: FailureDetail = {
        type: 'SCHEMA_MISMATCH',
        title: 'Empty Model Response',
        message: 'The AI model returned a response without valid content.',
        suggestedAction: 'Try rephrasing your topic prompt with more context.',
      };
      throw failure;
    }

    // 1. Fuzzy parse JSON
    let rawParsed: any;
    try {
      rawParsed = extractAndParseJSON(data.rawText);
    } catch (jsonErr) {
      const failure: FailureDetail = {
        type: 'MALFORMED_JSON',
        title: 'Malformed JSON Received',
        message: (jsonErr as Error).message,
        rawResponseSnippet: data.rawText.slice(0, 300),
        suggestedAction: 'The AI returned broken syntax. Click Retry to re-generate.',
      };
      throw failure;
    }

    // 2. Validate with Zod Schema
    const zodResult = RawStudySetSchema.safeParse(rawParsed);

    if (!zodResult.success) {
      const issues = zodResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      const failure: FailureDetail = {
        type: 'SCHEMA_MISMATCH',
        title: 'Structured Output Validation Failed',
        message: `The model response did not match the expected schema: ${issues}`,
        rawResponseSnippet: JSON.stringify(rawParsed, null, 2).slice(0, 300),
        suggestedAction: 'Re-running generation with updated prompt constraints.',
      };
      throw failure;
    }

    const validated = zodResult.data;

    // 3. Format into final hydrated StudySet object
    const finalStudySet: StudySet = {
      id: `set_${Date.now()}`,
      createdAt: new Date().toISOString(),
      topicPrompt: prompt,
      title: validated.title,
      summary: validated.summary,
      difficulty: validated.difficulty,
      category: validated.category,
      estimatedTimeMinutes: validated.estimatedTimeMinutes,
      flashcards: validated.flashcards.map((fc, index) => ({
        ...fc,
        id: fc.id || `card_${index + 1}`,
        isMastered: false,
        needsReview: false,
      })),
      quiz: validated.quiz.map((q, index) => ({
        ...q,
        id: q.id || `q_${index + 1}`,
        userSelectedIndex: null,
      })),
      keyConcepts: validated.keyConcepts || [],
    };

    return { studySet: finalStudySet, isMock: false };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      const failure: FailureDetail = {
        type: 'STALE_RESPONSE',
        title: 'Request Cancelled',
        message: 'The ongoing generation was cancelled by a new query.',
        suggestedAction: 'Waiting for new query to complete.',
      };
      throw failure;
    }

    if (err.type) {
      // Re-throw formatted FailureDetail object
      throw err;
    }

    const fallbackFailure: FailureDetail = {
      type: 'NETWORK_ERROR',
      title: 'Unexpected Client Error',
      message: err.message || 'An unhandled error occurred while processing the request.',
      suggestedAction: 'Try again or switch to mock mode.',
    };
    throw fallbackFailure;
  }
}

export async function refineStudySet(
  currentStudySet: StudySet,
  refinementPrompt: string
): Promise<{ studySet: StudySet; isMock: boolean }> {
  try {
    const response = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        existingStudySet: currentStudySet,
        refinementPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Refinement endpoint returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.useMockFallback) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const refinedMock = generateMockRefinedSet(currentStudySet, refinementPrompt);
      return { studySet: refinedMock, isMock: true };
    }

    const rawParsed = extractAndParseJSON(data.rawText);
    const zodResult = RawStudySetSchema.safeParse(rawParsed);

    if (!zodResult.success) {
      throw new Error('Refined response failed schema validation');
    }

    const validated = zodResult.data;
    const updatedSet: StudySet = {
      ...currentStudySet,
      title: validated.title,
      summary: validated.summary,
      difficulty: validated.difficulty,
      category: validated.category,
      flashcards: validated.flashcards.map((fc, i) => ({
        ...fc,
        id: fc.id || `card_${i + 1}`,
        isMastered: false,
        needsReview: false,
      })),
      quiz: validated.quiz.map((q, i) => ({
        ...q,
        id: q.id || `q_${i + 1}`,
        userSelectedIndex: null,
      })),
      keyConcepts: validated.keyConcepts || currentStudySet.keyConcepts,
    };

    return { studySet: updatedSet, isMock: false };
  } catch (err: any) {
    // Fallback to local mock refinement if real endpoint fails
    console.warn('Refinement endpoint fallback triggered:', err.message);
    const fallbackRefined = generateMockRefinedSet(currentStudySet, refinementPrompt);
    return { studySet: fallbackRefined, isMock: true };
  }
}
