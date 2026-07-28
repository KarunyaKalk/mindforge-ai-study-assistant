import { StudySet } from '../types/study';

export function generateMockStudySet(topicPrompt: string): StudySet {
  const normalized = topicPrompt.toLowerCase();

  let title = "React & Frontend Architecture Masters";
  let category = "Frontend Engineering";
  let summary = "Comprehensive guide to React 18, Fiber reconciliation, hooks lifecycle, state management patterns, and browser rendering optimization.";
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';

  if (normalized.includes('quantum')) {
    title = "Fundamentals of Quantum Computing";
    category = "Physics & Computer Science";
    summary = "Explores qubits, superposition, entanglement, quantum logic gates, and Shor's algorithm applications.";
    difficulty = 'Advanced';
  } else if (normalized.includes('photo') || normalized.includes('bio') || normalized.includes('plant')) {
    title = "Cellular Respiration & Photosynthesis";
    category = "Biology";
    summary = "Detailed breakdown of light-dependent reactions, Calvin cycle, ATP synthesis, and chloroplast biochemistry.";
    difficulty = 'Beginner';
  } else if (normalized.includes('system') || normalized.includes('design') || normalized.includes('arch')) {
    title = "Distributed System Design & Scalability";
    category = "System Design";
    summary = "Core concepts in high availability, CAP theorem, consistent hashing, message queues, and database sharding.";
    difficulty = 'Advanced';
  }

  return {
    id: `set_mock_${Date.now()}`,
    createdAt: new Date().toISOString(),
    topicPrompt: topicPrompt,
    title,
    summary,
    difficulty,
    category,
    estimatedTimeMinutes: 20,
    flashcards: [
      {
        id: 'card_1',
        question: 'What is the primary role of React Fiber in React 16+?',
        answer: 'React Fiber is a complete rewrite of the reconciliation algorithm. It allows breaking down rendering work into small chunks, pausing/resuming work, and prioritizing high-priority updates like user inputs.',
        hint: 'Think about incremental rendering and concurrency.',
        category: 'Core Architecture',
        difficulty: 'Hard',
        isMastered: false,
        needsReview: false,
      },
      {
        id: 'card_2',
        question: 'Explain the key difference between useLayoutEffect and useEffect.',
        answer: 'useEffect runs asynchronously AFTER DOM mutations are painted on screen. useLayoutEffect runs synchronously BEFORE the browser paints, ideal for layout measurements to prevent UI flickering.',
        hint: 'Focus on DOM paint timing.',
        category: 'Hooks',
        difficulty: 'Medium',
        isMastered: false,
        needsReview: false,
      },
      {
        id: 'card_3',
        question: 'How does AbortController prevent race conditions in async React fetches?',
        answer: 'AbortController allows cancelling active HTTP requests when a component unmounts or a new request is triggered. This ensures out-of-order or stale network responses do not overwrite state.',
        hint: 'Prevents late responses from overwriting fresh inputs.',
        category: 'Data Fetching',
        difficulty: 'Medium',
        isMastered: false,
        needsReview: false,
      },
      {
        id: 'card_4',
        question: 'What is Zod schema validation and why is it crucial for AI outputs?',
        answer: 'Zod provides runtime type validation. Because LLM outputs are non-deterministic, Zod guarantees the received JSON strictly conforms to expected types before component rendering, avoiding app crashes.',
        hint: 'Protects components from unexpected data shapes.',
        category: 'Resilience',
        difficulty: 'Easy',
        isMastered: false,
        needsReview: false,
      },
      {
        id: 'card_5',
        question: 'What is the purpose of memoization with React.memo and useMemo?',
        answer: 'React.memo skips re-rendering a component if its props have not changed. useMemo caches the result of expensive calculations between renders based on dependency arrays.',
        hint: 'Performance optimization for component renders.',
        category: 'Performance',
        difficulty: 'Easy',
        isMastered: false,
        needsReview: false,
      },
      {
        id: 'card_6',
        question: 'What is virtual DOM diffing and reconciliation?',
        answer: 'The Virtual DOM is a lightweight JS representation of the real DOM. Reconciliation is the process of comparing the new VDOM tree with the previous tree and making minimal DOM updates.',
        hint: 'Comparing tree nodes efficiently.',
        category: 'Core Architecture',
        difficulty: 'Medium',
        isMastered: false,
        needsReview: false,
      }
    ],
    quiz: [
      {
        id: 'q_1',
        question: 'Which hook should be used to synchronously perform layout measurements before paint?',
        options: ['useEffect', 'useLayoutEffect', 'useImperativeHandle', 'useInsertionEffect'],
        correctOptionIndex: 1,
        explanation: 'useLayoutEffect fires synchronously after all DOM mutations but before the browser paints.',
        difficulty: 'Medium',
        userSelectedIndex: null,
      },
      {
        id: 'q_2',
        question: 'How do you prevent a stale asynchronous AI response from overwriting newer state in React?',
        options: [
          'Using setTimeout',
          'Using AbortController or a request ID sequence counter',
          'Wrapping the fetch in try/catch only',
          'Increasing model temperature'
        ],
        correctOptionIndex: 1,
        explanation: 'AbortController cancels active requests, and sequence tracking discards responses whose ID does not match the latest request.',
        difficulty: 'Hard',
        userSelectedIndex: null,
      },
      {
        id: 'q_3',
        question: 'What is the primary advantage of validating AI outputs with a Zod schema at runtime?',
        options: [
          'It speeds up network transmission',
          'It ensures raw text is automatically converted to markdown',
          'It guarantees structural integrity and prevents React component runtime crashes',
          'It reduces LLM pricing costs'
        ],
        correctOptionIndex: 2,
        explanation: 'Zod verifies that fields match expected types and defaults missing fields, shielding React components from malformed JSON.',
        difficulty: 'Medium',
        userSelectedIndex: null,
      },
      {
        id: 'q_4',
        question: 'In React 18, what is automatic batching?',
        options: [
          'Batching HTTP requests together',
          'Grouping multiple state updates into a single re-render, even inside promises or timeouts',
          'Batching CSS file downloads',
          'Automating webpack bundling'
        ],
        correctOptionIndex: 1,
        explanation: 'React 18 automatically batches state updates regardless of where they originate (events, promises, setTimeouts).',
        difficulty: 'Easy',
        userSelectedIndex: null,
      }
    ],
    keyConcepts: [
      {
        term: 'Reconciliation',
        definition: 'The algorithm React uses to diff one tree of elements with another to determine which parts need updating.',
        importance: 'Core Concept',
      },
      {
        term: 'Schema Validation',
        definition: 'Runtime verification enforcing that unknown external data structures match defined TypeScript types.',
        importance: 'Core Concept',
      },
      {
        term: 'AbortController',
        definition: 'A web standard interface that allows cancelling web requests as desired.',
        importance: 'Key Detail',
      },
      {
        term: 'Strict JSON Mode',
        definition: 'LLM configuration parameter (e.g. responseMimeType application/json) ensuring structured JSON outputs.',
        importance: 'Key Detail',
      }
    ]
  };
}

export function generateMockRefinedSet(currentSet: StudySet, refinementPrompt: string): StudySet {
  const newCardId = `card_refined_${Date.now()}`;
  const newFlashcard = {
    id: newCardId,
    question: `[Refined] ${refinementPrompt.slice(0, 40)}...?`,
    answer: `Additional insight generated based on your refinement request: "${refinementPrompt}".`,
    hint: 'Added via refinement loop.',
    category: 'Refined Insights',
    difficulty: 'Medium' as const,
    isMastered: false,
    needsReview: false,
  };

  return {
    ...currentSet,
    title: `${currentSet.title} (Refined)`,
    summary: `${currentSet.summary} Updated with refinement: "${refinementPrompt}".`,
    flashcards: [newFlashcard, ...currentSet.flashcards],
  };
}
