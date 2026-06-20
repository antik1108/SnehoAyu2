import { createError } from '../middlewares/errorHandler.js';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Thin wrapper around Groq's OpenAI-compatible chat completions API.
 * Throws a generic operational error on failure — never surfaces raw
 * provider error text to the client (see errorHandler.ts hardening).
 */
export async function callGroq(messages: ChatMessage[], options?: { maxTokens?: number; temperature?: number }): Promise<string> {
  const apiKey = process.env['GROQ_API_KEY'];
  if (!apiKey) {
    throw createError(503, 'AI_NOT_CONFIGURED', 'AI insights are not configured on this server.');
  }

  const model = process.env['GROQ_MODEL'] || DEFAULT_MODEL;

  let response: Response;
  try {
    response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.4,
        max_tokens: options?.maxTokens ?? 400,
      }),
    });
  } catch (err) {
    console.error('[Groq] network error calling AI provider:', err);
    throw createError(502, 'AI_UPSTREAM_ERROR', 'Could not reach the AI service. Please try again shortly.');
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(`[Groq] upstream error ${response.status}:`, body);
    throw createError(502, 'AI_UPSTREAM_ERROR', 'The AI service returned an error. Please try again shortly.');
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw createError(502, 'AI_UPSTREAM_ERROR', 'The AI service returned an empty response.');
  }

  return content;
}
