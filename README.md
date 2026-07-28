# MindForge AI - AI Study Assistant (SDE Internship Reference Project)

> **Inspirational Reference Solution** built for the **Frontend Internship Assignment**. Demonstrates how to turn unpredictable AI model output into a reliable, stateful, and interactive user interface without relying on generic chat UI.

---

## 🌟 Overview & Features

**MindForge AI** takes free-form text input (lecture notes, raw articles, code snippets, or study topics), routes it through a secure backend proxy to an LLM, and transforms the response into a structured learning suite:

1. **3D Flip Flashcard Deck**: Interactive flashcards with 3D card flips, Mastered/Needs Review tracking, audio text-to-speech, shuffle, and full keyboard navigation (Space to flip, Arrow keys to navigate & mark).
2. **Interactive Assessment Quiz**: Multiple-choice assessment with instant explanations, score analysis, and a **"Re-test Wrong Answers"** focus mode.
3. **Key Terms & Glossary**: Searchable technical concepts with importance tags and one-click copying.
4. **AI Refinement Loop**: Follow-up prompt bar that updates existing study sets dynamically (e.g. *"Add 3 harder flashcards on caching strategies"*).
5. **Session History**: Save & restore past study sessions from `localStorage`.
6. **Failure Resilience Testing Suite**: Dropdown menu allowing reviewers and interns to simulate malformed JSON, schema mismatches, and 500 server errors on demand.

---

## 🏗️ Architecture & Design Decisions

```
┌─────────────────────────────────────────────────────────────┐
│                      React 18 + Vite                        │
│   - Custom Hooks (useStudySession, useLocalStorage)         │
│   - Stateful UI Components (Flashcards, Quiz, Glossary)     │
│   - Stale Guard (AbortController + sequence counter)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Zod Schema & Fuzzy JSON Repair Parser           │
│   - Strips Markdown fences (```json ... ```)                │
│   - Repairs unescaped quotes & trailing commas              │
│   - Validates data shape & provides default fallbacks       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP /api/generate
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Express Server Proxy (server.js)              │
│   - Secures GEMINI_API_KEY (never exposed to browser)      │
│   - Automatic Mock Fallback if no API key is provided       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Google Gemini 1.5/2.0 API                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Technical Highlights

1. **Backend Key Security**: The `GEMINI_API_KEY` is kept exclusively on the Node/Express backend (`server.js`). The frontend calls `/api/generate` and `/api/refine`.
2. **Zero-Setup Out-of-the-Box Fallback**: If no `GEMINI_API_KEY` is provided in `.env`, the system automatically switches to a high-quality mock generator so anyone can run `npm install && npm start` without hitting key errors.
3. **Preventing Race Conditions & Stale Overwrites**: Rapid consecutive inputs create new `AbortController` signals and increment a sequence ID counter. If a delayed response arrives after a newer query was fired, it is automatically discarded.

---

## 🛡️ Handling Bad AI Output (Core Requirement)

Handling non-deterministic LLM output is the core evaluation criteria of this assignment:

| Failure Mode | How MindForge AI Handles It |
| :--- | :--- |
| **Markdown Fences & Commentary** | The `extractAndParseJSON` helper strips markdown blocks (` ```json `), extracts clean JSON bounds, and repairs trailing commas. |
| **Malformed Syntax** | Trapped by try/catch in `aiService.ts`, displaying a user-friendly `ErrorAlert` banner with diagnostic raw output inspector and single-click Retry. |
| **Wrong Schema / Missing Keys** | Validated with **Zod Schema** (`RawStudySetSchema`). Optional fields fall back to sensible defaults (e.g. default hints or category names). |
| **Out-of-Order Stale Responses** | Guarded by `AbortController` cancellation and sequence tracking (`currentRequestId !== activeRequestId`). |
| **Server 500 / Network Down** | Returns explicit `FailureDetail` with HTTP error codes, guidance, and non-crashing UI boundaries. |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to set `GEMINI_API_KEY=your_key_here` if you wish to test live LLM calls. If left empty, Mock Mode activates automatically.*

3. **Start Project**:
   ```bash
   npm start
   ```
   *This starts the Express server proxy and Vite frontend on `http://localhost:3000`.*

---

## 🤖 AI Usage Note (Transparency Statement)

Per the assignment instructions:
- **AI Assistants Used**: Antigravity AI coding assistant and Claude 3.5 Sonnet for scaffolding component boilerplate, drafting Zod schemas, and writing initial CSS utility classes.
- **Human Guidance & Review**: Architectural decisions (AbortController stale guards, Express proxy separation, Zod schema validation, 3D flip card keyboard handling, and error diagnostic views) were designed and reviewed by a Senior SDE to model best practices for interns.

---

## ⏱️ Time Spent Breakdown (~8 Hours Total Target)

- **Planning & Architecture Design**: 1.5 hours
- **Backend Express Proxy & API Key Security**: 1 hour
- **Zod Schema Validation & Fuzzy JSON Repair**: 1.5 hours
- **React Components & Interactive State (Cards/Quiz/Glossary)**: 2.5 hours
- **Refinement Loop & History Persistence**: 1 hour
- **Documentation & Verification**: 0.5 hours

---

## 🔮 Future Scope & Improvements
- WebSockets for true real-time token streaming.
- Export deck to Anki (`.apkg`) format or PDF study guide.
- User authentication and multi-device Sync.
