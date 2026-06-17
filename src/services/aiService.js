/**
 * aiService.js — Calls Amazon Bedrock via API Gateway.
 * Supports both regular and streaming responses.
 */
import apiClient from 'services/apiClient';
import { API_ENDPOINTS } from 'constants/api';

/**
 * Send a chat message and get a complete response.
 * @param {string} message — user's message
 * @param {Array<{role: string, content: string}>} history — conversation history
 * @returns {Promise<{ message: string, sessionId: string }>}
 */
export async function sendMessage(message, history = []) {
  const { data } = await apiClient.post(API_ENDPOINTS.AI.CHAT, {
    message,
    history,
    modelId: import.meta.env.VITE_BEDROCK_MODEL_ID,
  });
  return data;
}

/**
 * Stream a chat response from Bedrock.
 * The `onChunk` callback is called with each text chunk.
 *
 * @param {string} message
 * @param {Array} history
 * @param {function(string): void} onChunk — callback for each streamed chunk
 * @param {AbortSignal} [signal] — optional abort signal
 */
export async function streamMessage(message, history = [], onChunk, signal) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.AI.STREAM}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal,
    }
  );

  if (!response.ok) throw new Error(`AI stream error: ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // Parse Server-Sent Events (SSE) format: "data: {...}\n"
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line.slice(6));
        if (parsed.text) onChunk(parsed.text);
      } catch {
        // Partial chunk — continue
      }
    }
  }
}

/**
 * Fetch AI chat history for current user.
 */
export async function getChatHistory() {
  const { data } = await apiClient.get(API_ENDPOINTS.AI.HISTORY);
  return data;
}
