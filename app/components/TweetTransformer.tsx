"use client";

import { useState, useCallback } from "react";
import ContextSettings from "./ContextSettings";

export default function TweetTransformer() {
  // State management
  const [draftTweet, setDraftTweet] = useState("");
  const [transformedTweet, setTransformedTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [context, setContext] = useState("");

  // Memoized callback for context changes
  const handleContextChange = useCallback((newContext: string) => {
    setContext(newContext);
  }, []);

  // Call the transform API
  const handleTransform = async () => {
    // Reset states
    setError("");
    setTransformedTweet("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          draft: draftTweet,
          context: context, // Send context to API
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setTransformedTweet(data.transformed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to transform tweet");
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = draftTweet.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="w-full space-y-6">
      {/* Context Settings */}
      <ContextSettings onContextChange={handleContextChange} />

      {/* Input Section */}
      <div className="space-y-2">
        <label 
          htmlFor="draft-tweet" 
          className="block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Draft
        </label>
        <textarea
          id="draft-tweet"
          value={draftTweet}
          onChange={(e) => setDraftTweet(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted transition-colors focus:border-muted"
        />
        <div className="flex justify-end">
          <span className={`text-xs tabular-nums ${isOverLimit ? "text-red-400" : "text-muted"}`}>
            {charCount} / 280
          </span>
        </div>
      </div>

      {/* Transform Button */}
      <button
        onClick={handleTransform}
        disabled={!draftTweet.trim() || isLoading}
        className="w-full rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "Transforming..." : "Transform"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Output Section */}
      {transformedTweet && (
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-muted">
            Result
          </label>
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
            {transformedTweet}
          </div>
          <div className="flex justify-end">
            <span className="text-xs tabular-nums text-muted">
              {transformedTweet.length} / 280
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
