"use client";

import { useState } from "react";

export default function TweetTransformer() {
  const [draftTweet, setDraftTweet] = useState("");
  const [transformedTweet, setTransformedTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransform = async () => {
    // TODO: Call API in Chapter 1.5
    console.log("Transform clicked!", draftTweet);
  };

  const charCount = draftTweet.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="w-full space-y-6">
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
