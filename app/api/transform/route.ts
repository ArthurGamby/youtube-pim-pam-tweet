import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/app/lib/ollama";

/**
 * POST /api/transform
 * 
 * Transforms a draft tweet into a polished version using the local LLM.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get the draft tweet from the request body
    const body = await request.json();
    const { draft } = body;

    // 2. Validate input
    if (!draft || typeof draft !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'draft' field" },
        { status: 400 }
      );
    }

    // 3. Build the prompt for the LLM
    const prompt = `You are a tweet rewriter. Transform the draft tweet below following these rules:

STYLE:
- Lead with value, not fluff
- Sound human and authentic, not "markety"
- Be confident but friendly
- Create curiosity without clickbait

STRUCTURE:
- Start with a hook that grabs attention
- Highlight the problem it solves or the insight it shares
- End with a natural CTA or open question if relevant
- Keep under 280 characters

Draft: ${draft}

Return only the improved tweet, nothing else. No quotes, no explanations.`;

    // 4. Call Ollama
    const transformedTweet = await generateWithOllama(prompt);

    // 5. Return the result
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

