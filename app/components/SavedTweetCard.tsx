"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Trash2 } from "lucide-react";

type SavedTweet = {
  id: string;
  original: string;
  transformed: string;
  context: string | null;
  createdAt: Date;
};

type SavedTweetCardProps = {
  tweet: SavedTweet;
  onUseAsDraft: (original: string) => void;
  onDelete: (id: string) => void;
};

export default function SavedTweetCard({ tweet, onUseAsDraft, onDelete }: SavedTweetCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(tweet.transformed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(tweet.id);
  };

  const handleCardClick = () => {
    if (!showDeleteConfirm) {
      onUseAsDraft(tweet.transformed);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (showDeleteConfirm) {
    return (
      <div className={`
        rounded-lg border border-red-500/30 bg-red-500/5 p-4
        transition-all duration-200
        ${isDeleting ? "opacity-50 scale-95" : ""}
      `}>
        <p className="text-sm text-foreground mb-3">Delete this tweet?</p>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(false);
            }}
            className="flex-1 rounded-md px-3 py-1.5 text-xs text-muted bg-border/50 hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-md px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="
        group cursor-pointer rounded-lg border border-border bg-card p-4
        transition-all duration-200 ease-out
        hover:border-muted/50
      "
    >
      {/* Tweet Header - Like a real tweet */}
      <div className="mb-3 flex items-center gap-3">
        <Image
          src="/Icon.svg"
          alt="Profile"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-foreground">Prisma Postgres</span>
            <svg className="h-4 w-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
          </div>
          <span className="text-xs text-muted">@prismaData · {formatDate(tweet.createdAt)}</span>
        </div>
      </div>

      {/* Tweet Content */}
      <p className="text-sm text-foreground leading-relaxed">
        {tweet.transformed}
      </p>

      {/* Footer with actions - always visible but subtle */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted/40">
          {tweet.transformed.length} chars
        </span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="rounded-md p-1.5 text-muted/40 hover:text-foreground hover:bg-foreground/5 transition-all"
            title="Copy"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="rounded-md p-1.5 text-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

