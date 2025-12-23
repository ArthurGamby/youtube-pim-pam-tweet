"use client";

import { useEffect, useState } from "react";
import { X, Library } from "lucide-react";
import SavedTweetCard from "./SavedTweetCard";

type SavedTweet = {
  id: string;
  original: string;
  transformed: string;
  context: string | null;
  createdAt: Date;
};

type LibraryPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onUseAsDraft: (original: string) => void;
};

export default function LibraryPanel({ isOpen, onClose, onUseAsDraft }: LibraryPanelProps) {
  const [tweets, setTweets] = useState<SavedTweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tweets when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchTweets();
    }
  }, [isOpen]);

  const fetchTweets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tweets");
      if (response.ok) {
        const data = await response.json();
        setTweets(data);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tweets?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTweets((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleUseAsDraft = (original: string) => {
    onUseAsDraft(original);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
        className="fixed top-0 right-0 h-full w-full sm:w-[360px] bg-background border-l border-border z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-sm font-medium text-foreground">Library</h2>
            <p className="text-xs text-muted">
              {tweets.length} saved tweet{tweets.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto p-4">
          {isLoading ? (
            // Loading state
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 card-elevated animate-pulse">
                  <div className="h-4 w-[90%] rounded bg-border mb-2" />
                  <div className="h-4 w-[70%] rounded bg-border mb-3" />
                  <div className="h-6 w-full rounded bg-border/50" />
                </div>
              ))}
            </div>
          ) : tweets.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Library size={48} className="text-muted/30 mb-4" />
              <p className="text-sm text-muted mb-2">No saved tweets yet</p>
              <p className="text-xs text-muted/60">
                Transform a tweet and click Save to build your library
              </p>
            </div>
          ) : (
            // Tweet list with staggered animation
            <div className="space-y-3">
              {tweets.map((tweet, index) => (
                <div
                  key={tweet.id}
                  className="animate-slide-down"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <SavedTweetCard
                    tweet={tweet}
                    onUseAsDraft={handleUseAsDraft}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

