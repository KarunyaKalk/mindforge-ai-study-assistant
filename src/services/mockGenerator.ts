import { StudySet, GenerationMode } from '../types/study';

export function generateMockStudySet(topicPrompt: string, mode: GenerationMode = 'all'): StudySet {
  const normalized = topicPrompt.toLowerCase();

  let title = "React 18 & Frontend Architecture";
  let category = "Frontend Engineering";
  let summary = "Comprehensive breakdown of React Fiber reconciliation, hooks lifecycle, state management, and async performance optimization.";
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';

  if (normalized.includes('quantum')) {
    title = "Fundamentals of Quantum Computing";
    category = "Physics & CS";
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

  const allFlashcards = [
    {
      id: 'card_1',
      question: 'What is the primary role of React Fiber in React 16+?',
      answer: 'React Fiber is a complete rewrite of the reconciliation algorithm. It allows breaking down rendering work into small chunks, pausing/resuming work, and prioritizing high-priority updates like user inputs.',
      hint: 'Think about incremental rendering and concurrency.',
      category: 'Core Architecture',
      difficulty: 'Hard' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'Does React Fiber allow rendering work to be paused and resumed?',
        options: ['Yes, Fiber enables incremental, interruptible rendering', 'No, Fiber forces synchronous blocking rendering', 'Only in server side rendering'],
        correctIndex: 0,
      }
    },
    {
      id: 'card_2',
      question: 'Explain the key difference between useLayoutEffect and useEffect.',
      answer: 'useEffect runs asynchronously AFTER DOM mutations are painted on screen. useLayoutEffect runs synchronously BEFORE the browser paints, ideal for layout measurements to prevent UI flickering.',
      hint: 'Focus on DOM paint timing.',
      category: 'Hooks',
      difficulty: 'Medium' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'Which hook fires synchronously BEFORE browser paint?',
        options: ['useLayoutEffect', 'useEffect', 'useMemo'],
        correctIndex: 0,
      }
    },
    {
      id: 'card_3',
      question: 'How does AbortController prevent race conditions in async React fetches?',
      answer: 'AbortController allows cancelling active HTTP requests when a component unmounts or a new request is triggered. This ensures out-of-order or stale network responses do not overwrite state.',
      hint: 'Prevents late responses from overwriting fresh inputs.',
      category: 'Data Fetching',
      difficulty: 'Medium' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'What happens to a fetch request when abort() is called on its AbortController signal?',
        options: ['The fetch throws an AbortError and cancels payload processing', 'The request runs normally without notification', 'The server restarts'],
        correctIndex: 0,
      }
    },
    {
      id: 'card_4',
      question: 'What is Zod schema validation and why is it crucial for AI outputs?',
      answer: 'Zod provides runtime type validation. Because LLM outputs are non-deterministic, Zod guarantees the received JSON strictly conforms to expected types before component rendering, avoiding app crashes.',
      hint: 'Protects components from unexpected data shapes.',
      category: 'Resilience',
      difficulty: 'Easy' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'What is the main benefit of validating AI outputs with Zod at runtime?',
        options: ['Guarantees structural type integrity and prevents React runtime crashes', 'Improves LLM response speed', 'Encourages SQL queries'],
        correctIndex: 0,
      }
    },
    {
      id: 'card_5',
      question: 'What is the purpose of memoization with React.memo and useMemo?',
      answer: 'React.memo skips re-rendering a component if its props have not changed. useMemo caches the result of expensive calculations between renders based on dependency arrays.',
      hint: 'Performance optimization for component renders.',
      category: 'Performance',
      difficulty: 'Easy' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'When should useMemo be used in React?',
        options: ['To cache expensive calculation outputs across re-renders', 'To replace state hooks', 'To trigger DOM animations'],
        correctIndex: 0,
      }
    },
    {
      id: 'card_6',
      question: 'What is virtual DOM diffing and reconciliation?',
      answer: 'The Virtual DOM is a lightweight JS representation of the real DOM. Reconciliation is the process of comparing the new VDOM tree with the previous tree and making minimal DOM updates.',
      hint: 'Comparing tree nodes efficiently.',
      category: 'Core Architecture',
      difficulty: 'Medium' as const,
      isMastered: false,
      needsReview: false,
      quickCheck: {
        question: 'What does reconciliation compare?',
        options: ['The new Virtual DOM tree with the previous Virtual DOM tree', 'CSS files with HTML tags', 'API responses with database tables'],
        correctIndex: 0,
      }
    }
  ];

  const allQuiz = [
    {
      id: 'q_1',
      question: 'Which hook should be used to synchronously perform layout measurements before paint?',
      options: ['useEffect', 'useLayoutEffect', 'useImperativeHandle', 'useInsertionEffect'],
      correctOptionIndex: 1,
      explanation: 'useLayoutEffect fires synchronously after all DOM mutations but before the browser paints.',
      difficulty: 'Medium' as const,
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
      difficulty: 'Hard' as const,
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
      difficulty: 'Medium' as const,
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
      difficulty: 'Easy' as const,
      userSelectedIndex: null,
    }
  ];

  const allConcepts = [
    {
      term: 'Reconciliation',
      definition: 'The algorithm React uses to diff one tree of elements with another to determine which parts need updating.',
      importance: 'Core Concept' as const,
    },
    {
      term: 'Schema Validation',
      definition: 'Runtime verification enforcing that unknown external data structures match defined TypeScript types.',
      importance: 'Core Concept' as const,
    },
    {
      term: 'AbortController',
      definition: 'A web standard interface that allows cancelling web requests as desired.',
      importance: 'Key Detail' as const,
    },
    {
      term: 'Strict JSON Mode',
      definition: 'LLM configuration parameter (e.g. response_format json_object) ensuring structured JSON outputs.',
      importance: 'Key Detail' as const,
    }
  ];

  return {
    id: `set_mock_${Date.now()}`,
    createdAt: new Date().toISOString(),
    topicPrompt: topicPrompt,
    title,
    summary,
    difficulty,
    category,
    estimatedTimeMinutes: mode === 'flashcards_only' ? 10 : mode === 'quiz_only' ? 12 : 20,
    generationMode: mode,
    flashcards: mode === 'quiz_only' ? [] : allFlashcards,
    quiz: mode === 'flashcards_only' ? [] : allQuiz,
    keyConcepts: allConcepts,
  };
}

export function generateMockRefinedSet(currentSet: StudySet, refinementPrompt: string): StudySet {
  const newCardId = `card_refined_${Date.now()}`;
  const newFlashcard = {
    id: newCardId,
    question: `[Refined] ${refinementPrompt.slice(0, 45)}...?`,
    answer: `Additional insight generated based on your refinement request: "${refinementPrompt}".`,
    hint: 'Added via refinement loop.',
    category: 'Refined Insights',
    difficulty: 'Medium' as const,
    isMastered: false,
    needsReview: false,
    quickCheck: {
      question: `Does this refined card address: "${refinementPrompt.slice(0, 30)}"?`,
      options: ['Yes, specifically generated per refinement prompt', 'No, unrelated concept'],
      correctIndex: 0,
    }
  };

  return {
    ...currentSet,
    title: `${currentSet.title} (Refined)`,
    summary: `${currentSet.summary} Updated with refinement: "${refinementPrompt}".`,
    flashcards: [newFlashcard, ...currentSet.flashcards],
  };
}
