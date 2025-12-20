/**
 * Ollama API Integration
 * 
 * This file handles communication with the local Ollama LLM.
 * Ollama runs at http://localhost:11434 by default.
 */

// Ollama API endpoint
const OLLAMA_BASE_URL = "http://localhost:11434";

// The model we're using (from `ollama list`)
const MODEL = "gemma3:4b";

// Types for Ollama API
type OllamaRequest = {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
  };
};

type OllamaResponse = {
  model: string;
  response: string;
  done: boolean;
};

/**
 * Generate a response from Ollama
 * 
 * @param prompt - The prompt to send to the LLM
 * @returns The generated text response
 */
export async function generateWithOllama(prompt: string): Promise<string> {
  const requestBody: OllamaRequest = {
    model: MODEL,
    prompt: prompt,
    stream: false, // We'll keep it simple for now, no streaming
    options: {
      temperature: 0.7, // Add some variety to responses
    },
  };

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data: OllamaResponse = await response.json();
  
  return data.response;
}

