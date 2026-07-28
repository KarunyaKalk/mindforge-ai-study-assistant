# MindForge AI — AI Study Assistant & Knowledge Studio

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-yellow?style=for-the-badge&logo=github)](https://karunyakalk.github.io/mindforge-ai-study-assistant/)
[![Stack](https://img.shields.io/badge/Stack-React_18_|_TypeScript_|_Zod_|_Groq_Llama_3.3-blue?style=for-the-badge)](https://github.com/KarunyaKalk/mindforge-ai-study-assistant)
[![Design](https://img.shields.io/badge/Design-Linear_|_Vercel_SaaS_Style-black?style=for-the-badge)](https://karunyakalk.github.io/mindforge-ai-study-assistant/)

> **Production-Ready Senior SDE Reference Project** built for the **Frontend Internship Assignment**. Demonstrates how to turn non-deterministic LLM output into a reliable, stateful, and production-grade SaaS product without generic chat interfaces.

---

## 🌐 Live Application
👉 **[https://karunyakalk.github.io/mindforge-ai-study-assistant/](https://karunyakalk.github.io/mindforge-ai-study-assistant/)**

---

## 🚀 Key Features

1. **⚡ Fast LLM Generation with Groq API (Llama 3.3)**:
   - Ultra-fast structured JSON generation using Groq's `llama-3.3-70b-versatile` model.

2. **🎴 Redesigned 500px Flashcard Deck**:
   - **SRS Spaced Repetition Rating**: Rate recall difficulty with Anki-style intervals (**Again** `<1m`, **Hard** `12h`, **Good** `1d`, **Easy** `4d`).
   - **Quick Self-Check Questions**: Interactive multiple-choice check embedded directly on the front of each flashcard to test comprehension before flipping.
   - **Audio TTS & Tools**: Text-to-speech, bookmarking, sharing, category badges, and smooth 3D flip animations.

3. **🎯 Selectable Generation Package Modes**:
   - Choose output format before generation: **Full Package (Cards + Quiz)**, **Flashcards Only**, or **Quiz Only**.

4. **📝 Extended Learning Modules**:
   - Segmented tab controls for **Flashcards**, **Assessment Quiz** (with Re-test Wrong Answers mode), **Key Terms Glossary**, **Structured Notes**, **Senior Engineering Interview Prep**, and **Real-World Case Studies**.

5. **📊 Dashboard Metrics & Gamification**:
   - Track Mastered count, Remaining cards, Review Today, Weekly Streak (🔥 `5d`), XP Counter (⚡ `1,240 XP`), and an SVG **Circular Completion Meter**.

6. **🎨 Hand-Crafted Linear / Vercel Product Design System**:
   - 42px hero typography, `#090B11` deep canvas background, `#161B26` cards, 1px subtle borders (`rgba(255,255,255,0.06)`), `#F4C430` golden saffron accents, 1280px max container width, and 8px grid alignment.
   - Default Light Mode on initial load with 1-click Dark Mode toggle.

7. **🛡️ Resilient Failure Handling**:
   - Dropdown tool to simulate malformed JSON, schema mismatches, and 500 server errors on demand.

---

## 🏗️ Architecture & Technical Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + TypeScript + Vite                │
│   - Handcrafted Linear/Vercel SaaS Design System             │
│   - Custom Hooks (useStudySession, useLocalStorage)         │
│   - Stale Guard (AbortController + Sequence Counter)        │
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
│   - Secures GROQ_API_KEY (never exposed to client browser)   │
│   - Automatic Mock Fallback if no API key is provided       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Groq API (Llama 3.3 Versatile JSON Engine)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Handling Bad AI Output (Core Evaluation Criteria)

| Failure Mode | How MindForge AI Handles It |
| :--- | :--- |
| **Markdown Fences & Commentary** | `extractAndParseJSON` strips codeblocks (` ```json `), extracts raw JSON bounds, and repairs unescaped characters. |
| **Malformed Syntax** | Trapped by try/catch in `aiService.ts`, displaying a user-friendly `ErrorAlert` banner with diagnostic raw output inspector and single-click Retry. |
| **Wrong Schema / Missing Keys** | Validated with **Zod Schema** (`RawStudySetSchema`). Optional fields fall back to sensible defaults. |
| **Out-of-Order Stale Responses** | Guarded by `AbortController` cancellation and sequence tracking (`currentRequestId !== activeRequestId`). |
| **Server 500 / Network Down** | Returns explicit `FailureDetail` with HTTP error codes, guidance, and non-crashing UI boundaries. |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Flip 3D Flashcard |
| <kbd>←</kbd> <kbd>→</kbd> | Navigate Previous / Next Card |
| <kbd>1</kbd> | Grade SRS: **Again** (< 1 min) |
| <kbd>2</kbd> | Grade SRS: **Hard** (12 hours) |
| <kbd>3</kbd> | Grade SRS: **Good** (1 day) |
| <kbd>4</kbd> | Grade SRS: **Easy** (4 days) |

---

## 💻 Quick Start & Installation

```bash
# 1. Clone repository
git clone https://github.com/KarunyaKalk/mindforge-ai-study-assistant.git
cd mindforge-ai-study-assistant

# 2. Install dependencies
npm install

# 3. Configure Environment (Optional for live AI calls)
cp .env.example .env
# Set GROQ_API_KEY=your_groq_key in .env (Get free key at https://console.groq.com/)

# 4. Start local development server
npm start
```
*Navigates automatically to `http://localhost:3000` with hot-reload enabled.*

---

## 📄 License
Built for Senior SDE Internship Reference & Open Educational Use.
