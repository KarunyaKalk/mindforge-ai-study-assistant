import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKeyPresent = !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    provider: 'Groq AI (Llama 3.3)',
    apiKeyConfigured: apiKeyPresent,
    mode: apiKeyPresent ? 'real_ai' : 'fallback_mock',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  });
});

/**
 * Proxy endpoint to request structured JSON from Groq API (OpenAI Compatible)
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, generationMode = 'all', simulateFailure, forcedErrorType } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        details: 'Prompt text is required and must be a string.',
      });
    }

    // Testing hook for interns to demo failure modes
    if (simulateFailure) {
      if (forcedErrorType === 'MALFORMED_JSON') {
        return res.json({
          rawText: '{"title": "Broken Study Set", "flashcards": [{"question": "What is JS?", "answer": "JavaScript" missing bracket',
        });
      }
      if (forcedErrorType === 'WRONG_SHAPE') {
        return res.json({
          rawText: JSON.stringify({ wrongKey: "This does not conform to expected schema" }),
        });
      }
      if (forcedErrorType === 'SERVER_500') {
        return res.status(500).json({ error: 'Simulated 500 Server Error from Groq API' });
      }
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        useMockFallback: true,
        message: 'No GROQ_API_KEY provided in .env server environment. Using high-quality local mock generator.',
      });
    }

    const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const systemInstruction = `You are MindForge AI, an expert educational system.
Generate a structured JSON study package for the requested topic/notes.
Requested Generation Mode: "${generationMode}" (Options: 'all', 'flashcards_only', 'quiz_only').

Your output MUST be strictly valid JSON matching this structure:
{
  "title": "Short descriptive topic title",
  "summary": "Concise 2-3 sentence overview of the topic",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "category": "Topic Category (e.g., Computer Science, Biology, History)",
  "estimatedTimeMinutes": 15,
  "flashcards": [
    {
      "id": "card_1",
      "question": "Clear, specific flashcard question",
      "answer": "Comprehensive yet digestible answer",
      "hint": "Subtle hint for self-testing",
      "category": "Sub-topic",
      "difficulty": "Easy" | "Medium" | "Hard",
      "quickCheck": {
        "question": "Quick self-check question testing understanding of this card",
        "options": ["Option A", "Option B", "Option C"],
        "correctIndex": 0
      }
    }
  ],
  "quiz": [
    {
      "id": "q_1",
      "question": "Quiz question testing core concept",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Clear explanation of why option at correctOptionIndex is right",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ],
  "keyConcepts": [
    {
      "term": "Key Term Name",
      "definition": "Clear concise definition",
      "importance": "Core Concept" | "Key Detail" | "Advanced Concept"
    }
  ]
}

If mode is 'flashcards_only', populate flashcards heavily (at least 7 cards with quickCheck objects) and return empty array [] for quiz.
If mode is 'quiz_only', populate quiz heavily (at least 7 questions) and return empty array [] for flashcards.
If mode is 'all', populate at least 5 flashcards (with quickCheck objects), 4 quiz questions, and 4 key concepts.
Return ONLY raw JSON with no preamble.`;

    const requestBody = {
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `USER INPUT / TOPIC NOTES:\n${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    };

    const response = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Groq API returned error code ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(502).json({
        error: 'Empty response received from Groq AI model',
        details: 'The AI model returned choices without valid content parts.',
      });
    }

    return res.json({ rawText, useMockFallback: false });
  } catch (err) {
    console.error('Error in /api/generate server handler:', err);
    return res.status(500).json({
      error: 'Internal server error while communicating with Groq API provider',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

/**
 * Proxy endpoint to refine existing study content with follow-up instructions using Groq API
 */
app.post('/api/refine', async (req, res) => {
  try {
    const { existingStudySet, refinementPrompt } = req.body;

    if (!existingStudySet || !refinementPrompt) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: 'Both existingStudySet and refinementPrompt are required.',
      });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        useMockFallback: true,
        message: 'No GROQ_API_KEY configured. Client will perform mock refinement.',
      });
    }

    const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const systemInstruction = `You are MindForge AI refinement engine.
Return an UPDATED complete JSON Study Set incorporating the user's requested changes.
Maintain exact structure with keys: title, summary, difficulty, category, estimatedTimeMinutes, flashcards, quiz, keyConcepts. Return ONLY raw JSON.`;

    const userPrompt = `Below is an existing JSON Study Set:\n${JSON.stringify(existingStudySet, null, 2)}\n\nRefinement Request:\n"${refinementPrompt}"`;

    const requestBody = {
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    };

    const response = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Groq API returned code ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    return res.json({ rawText, useMockFallback: false });
  } catch (err) {
    console.error('Error in /api/refine handler:', err);
    return res.status(500).json({
      error: 'Internal server error during refinement',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// Serve frontend dist build in production
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>MindForge AI Backend Server</title></head>
        <body style="font-family: sans-serif; padding: 2rem; line-height: 1.6;">
          <h2>🚀 MindForge API Server (Groq Llama 3.3 Engine)</h2>
          <p>Backend API endpoints (<code>/api/generate</code>, <code>/api/refine</code>, <code>/api/health</code>) are ready.</p>
          <p>To view the React frontend UI, run <code>npm run dev</code> for Vite dev mode or <code>npm run build</code> to generate static assets in <code>dist/</code>.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MindForge API Proxy Server listening on port ${PORT}`);
  console.log(`🔑 Groq API Key configured: ${process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY ? 'YES' : 'NO (Mock Mode Enabled)'}`);
});
