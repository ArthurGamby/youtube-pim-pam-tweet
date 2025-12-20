"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "pimpamtweet-context";

type ContextSettingsProps = {
  onContextChange: (context: string) => void;
};

export default function ContextSettings({ onContextChange }: ContextSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState("");

  // Load context from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContext(saved);
      onContextChange(saved);
    }
  }, [onContextChange]);

  // Save context to localStorage when it changes
  const handleContextChange = (value: string) => {
    setContext(value);
    localStorage.setItem(STORAGE_KEY, value);
    onContextChange(value);
  };

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-muted"
      >
        <span className="text-muted">
          {context ? "Context configured" : "Add context (optional)"}
        </span>
        <svg
          className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-3 space-y-2">
          <label 
            htmlFor="context" 
            className="block text-xs font-medium uppercase tracking-wider text-muted"
          >
            Your Style / Tone
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => handleContextChange(e.target.value)}
            placeholder="E.g., I'm a developer who shares coding tips. I like to be friendly and use simple language. I sometimes use emojis..."
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted/60 transition-colors focus:border-muted"
          />
          <p className="text-xs text-muted/60">
            This context will be used for all your transformations
          </p>
        </div>
      )}
    </div>
  );
}

