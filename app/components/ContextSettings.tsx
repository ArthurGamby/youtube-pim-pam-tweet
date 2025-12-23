"use client";

import { useEffect, useState } from "react";
import { User, ChevronDown } from "lucide-react";

const STORAGE_KEY = "pimpamtweet-context";

type ContextSettingsProps = {
  isOpen: boolean;
  onToggle: () => void;
  onContextChange: (context: string) => void;
};

export function ContextButton({ isOpen, onToggle, hasContext }: { isOpen: boolean; onToggle: () => void; hasContext: boolean }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-1 items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors ${
        isOpen ? "border-muted bg-card" : "border-border bg-card hover:border-muted"
      }`}
    >
      <span className="flex items-center gap-2 text-muted">
        <User size={14} />
        <span>Context</span>
        {hasContext && <span className="h-1.5 w-1.5 rounded-full bg-foreground" />}
      </span>
      <ChevronDown
        size={14}
        className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export function ContextPanel({ onContextChange }: { onContextChange: (context: string) => void }) {
  const [context, setContext] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContext(saved);
      onContextChange(saved);
    }
  }, [onContextChange]);

  const handleContextChange = (value: string) => {
    setContext(value);
    localStorage.setItem(STORAGE_KEY, value);
    onContextChange(value);
  };

  return (
    <textarea
      value={context}
      onChange={(e) => handleContextChange(e.target.value)}
      placeholder="Your style: e.g., Developer, friendly tone, occasional emojis..."
      rows={2}
      className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted/60 transition-colors focus:border-muted"
    />
  );
}

export default function ContextSettings({ isOpen, onToggle, onContextChange }: ContextSettingsProps) {
  const [hasContext, setHasContext] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHasContext(!!saved);
  }, []);

  const handleContextChange = (value: string) => {
    setHasContext(!!value);
    onContextChange(value);
  };

  return { isOpen, onToggle, hasContext, onContextChange: handleContextChange };
}

// Export hook for parent to use
export function useContextState(onContextChange: (context: string) => void) {
  const [hasContext, setHasContext] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHasContext(!!saved);
  }, []);

  const handleContextChange = (value: string) => {
    setHasContext(!!value);
    onContextChange(value);
  };

  return { hasContext, handleContextChange };
}
