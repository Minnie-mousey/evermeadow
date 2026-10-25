import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) }));

app.post('/api/study-assistant', async (req, res) => {
  const { question, passage, mode = 'explain' } = req.body || {};
  if (!question?.trim()) return res.status(400).json({ error: 'Please enter a question.' });
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'AI is not configured yet. Add OPENAI_API_KEY to your private .env file. You can still use the reader and journal.' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: `You are Evermeadow's careful Christian Bible-study assistant. Help the user study the supplied text thoughtfully and respectfully. Distinguish what the passage explicitly says from interpretation; acknowledge meaningful differences among Christian traditions; do not claim to speak for God or replace a pastor, scholar, or the user's conscience. Do not invent quotations or citations. If comparing traditions, describe them fairly. Mode: ${mode}. Structure answers with clear headings when useful, and suggest relevant passages only when reasonably confident.`,
        input: `Passage currently being studied:\n${passage || '(No passage supplied)'}\n\nUser question:\n${question}`
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'The AI service could not complete this request.' });
    const answer = (data.output || []).flatMap(item => item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n').trim();
    return res.json({ answer: answer || 'I could not produce an answer this time. Please try again.' });
  } catch (error) {
    console.error('Study assistant error:', error);
    return res.status(500).json({ error: 'The study assistant is temporarily unavailable.' });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, '0.0.0.0', () => console.log(`Evermeadow API listening on ${port}`));
