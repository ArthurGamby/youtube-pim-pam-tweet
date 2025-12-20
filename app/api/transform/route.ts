import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/app/lib/ollama";

// Filter types
type Filters = {
  maxChars?: number;      // 100-280
  emojiMode?: "none" | "few" | "many";
};

/**
 * POST /api/transform
 * 
 * Transforms a draft tweet into a polished version using the local LLM.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get the draft tweet, context, and filters from the request body
    const body = await request.json();
    const { draft, context, filters } = body as { 
      draft: string; 
      context?: string; 
      filters?: Filters;
    };

    // 2. Validate input
    if (!draft || typeof draft !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'draft' field" },
        { status: 400 }
      );
    }

    // 3. Extract filter values
    const maxChars = filters?.maxChars ?? 280;
    const emojiMode = filters?.emojiMode ?? "few";

    // 4. Build emoji instruction
    let emojiRule = "";
    switch (emojiMode) {
      case "none":
        emojiRule = "Do NOT use any emojis.";
        break;
      case "few":
        emojiRule = "Use 1-2 emojis maximum.";
        break;
      case "many":
        emojiRule = "Use emojis to add personality.";
        break;
    }

    // 5. Build context section
    const contextSection = context 
      ? `\nAuthor style: ${context}\n` 
      : "";

    // 6. Build the prompt - CONSTRAINTS FIRST
    const prompt = `Rewrite this tweet.

STRICT LIMITS:
- Maximum ${maxChars} characters (THIS IS MANDATORY)
- ${emojiRule}
- No hashtags
${contextSection}
GUIDELINES:
- Lead with value
- Sound human, not markety
- Be engaging

Draft: "${draft}"

Respond with ONLY the rewritten tweet. No quotes, no explanation.`;

    // 7. Call Ollama
    const transformedTweet = await generateWithOllama(prompt);

    // 8. Return the result
    return NextResponse.json({ 
      transformed: transformedTweet.trim() 
    });

  } catch (error) {
    console.error("Transform API error:", error);
    
    return NextResponse.json(
      { error: "Failed to transform tweet. Is Ollama running?" },
      { status: 500 }
    );
  }
}
