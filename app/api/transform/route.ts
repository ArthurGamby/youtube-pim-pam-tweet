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
    const prompt = `You are a tweet formatter. Take the following draft tweet and make it cleaner, more engaging, and well-formatted. Keep it under 280 characters.

Draft: ${draft}

Return only the improved tweet, nothing else.`;

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

