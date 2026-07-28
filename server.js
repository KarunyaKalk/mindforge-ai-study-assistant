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
  const apiKeyPresent = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';
  res.json({
    status: 'ok',
    apiKeyConfigured: apiKeyPresent,
    mode: apiKeyPresent ? 'real_ai' : 'fallback_mock',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  });
});

/**
 * Proxy endpoint to request structured JSON from Gemini API
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, simulateFailure, forcedErrorType } = req.body;

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
        return res.status(500).json({ error: 'Simulated 500 Server Error from LLM API' });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      // Return a flag indicating fallback mock mode should be used by client or return signal
      return res.json({
        useMockFallback: true,
        message: 'No GEMINI_API_KEY provided in .env server environment. Using high-quality local mock generator.',
      });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are MindForge AI, an expert educational system.
Generate a structured JSON study package for the requested topic/notes.
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
      "difficulty": "Easy" | "Medium" | "Hard"
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

Ensure at least 5 flashcards, 4 quiz questions (each with 4 options), and 4 key concepts. Return ONLY raw JSON with no conversational text or preamble.`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemInstruction}\n\nUSER INPUT / TOPIC NOTES:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Gemini API returned error code ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({
        error: 'Empty response received from LLM model',
        details: 'The AI model returned candidates without valid content parts.',
      });
    }

    return res.json({ rawText, useMockFallback: false });
  } catch (err) {
    console.error('Error in /api/generate server handler:', err);
    return res.status(500).json({
      error: 'Internal server error while communicating with AI provider',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

/**
 * Proxy endpoint to refine existing study content with follow-up instructions
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        useMockFallback: true,
        message: 'No GEMINI_API_KEY configured. Client will perform mock refinement.',
      });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const promptText = `You are MindForge AI refinement engine.
Below is an existing JSON Study Set:
${JSON.stringify(existingStudySet, null, 2)}

The user requests the following update/refinement:
"${refinementPrompt}"

Return an UPDATED complete JSON Study Set incorporating the user's requested changes (e.g., adding/modifying flashcards, modifying quiz questions, adjust difficulty).
Maintain the exact structure:
{
  "title": string,
  "summary": string,
  "difficulty": string,
  "category": string,
  "estimatedTimeMinutes": number,
  "flashcards": Array<{ id, question, answer, hint, category, difficulty }>,
  "quiz": Array<{ id, question, options, correctOptionIndex, explanation, difficulty }>,
  "keyConcepts": Array<{ term, definition, importance }>
}

Return ONLY raw JSON with no conversational commentary.`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Gemini API returned code ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
          <h2>🚀 MindForge API Server is Running</h2>
          <p>Backend API endpoints (<code>/api/generate</code>, <code>/api/refine</code>, <code>/api/health</code>) are ready.</p>
          <p>To view the React frontend UI, run <code>npm run dev</code> for Vite dev mode or <code>npm run build</code> to generate static assets in <code>dist/</code>.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MindForge API Proxy Server listening on port ${PORT}`);
  console.log(`🔑 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Mock Mode Enabled)'}`);
});
