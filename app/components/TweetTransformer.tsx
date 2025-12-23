"use client";

import { useState, useCallback, useEffect } from "react";
import { ContextButton, ContextPanel } from "./ContextSettings";
import { FilterButton, FilterPanel, type Filters } from "./FilterOptions";
import TweetPreview from "./TweetPreview";

const DEFAULT_FILTERS: Filters = {
  maxChars: 280,
  emojiMode: "few",
};

const CONTEXT_STORAGE_KEY = "pimpamtweet-context";

type OpenPanel = "none" | "context" | "filters";

export default function TweetTransformer() {
  // State management
  const [draftTweet, setDraftTweet] = useState("");
  const [transformedTweet, setTransformedTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [context, setContext] = useState("");
  const [hasContext, setHasContext] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [openPanel, setOpenPanel] = useState<OpenPanel>("none");

  // Load context indicator on mount
  useEffect(() => {
    const saved = localStorage.getItem(CONTEXT_STORAGE_KEY);
    setHasContext(!!saved);
  }, []);

  // Memoized callback for context changes
  const handleContextChange = useCallback((newContext: string) => {
    setContext(newContext);
    setHasContext(!!newContext);
  }, []);

  // Toggle panels
  const toggleContext = () => setOpenPanel(openPanel === "context" ? "none" : "context");
  const toggleFilters = () => setOpenPanel(openPanel === "filters" ? "none" : "filters");

  // Call the transform API
  const handleTransform = async () => {
    setError("");
    setTransformedTweet("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: draftTweet, context, filters }),
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
    <div className="w-full space-y-3">
      {/* Settings Row - Buttons always inline */}
      <div className="flex gap-2">
        <ContextButton
          isOpen={openPanel === "context"}
          onToggle={toggleContext}
          hasContext={hasContext}
        />
        <FilterButton
          isOpen={openPanel === "filters"}
          onToggle={toggleFilters}
          filters={filters}
        />
      </div>

      {/* Expanded Panel - Below the buttons row */}
      {openPanel === "context" && (
        <ContextPanel onContextChange={handleContextChange} />
      )}
      {openPanel === "filters" && (
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
      )}

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
        {isLoading ? "Creating..." : "Create Social"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Output Section - Always visible */}
      <div className="mt-6 border-t border-border pt-6">
        <TweetPreview 
          content={transformedTweet || null} 
          original={draftTweet}
          context={context}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
