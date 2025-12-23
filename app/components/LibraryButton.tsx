"use client";

import { Library } from "lucide-react";

type LibraryButtonProps = {
  count: number;
  isOpen: boolean;
  onClick: () => void;
};

export default function LibraryButton({ count, isOpen, onClick }: LibraryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs
        transition-all duration-200 ease-out
        ${isOpen
          ? "border-foreground/20 bg-foreground/10 text-foreground"
          : "border-border bg-card text-muted hover:border-muted/50 hover:text-foreground"
        }
      `}
    >
      <Library size={14} />
      <span>Library</span>
      
      {/* Count badge */}
      {count > 0 && (
        <span className={`
          ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium
          transition-colors duration-200
          ${isOpen
            ? "bg-foreground/20 text-foreground"
            : "bg-muted/20 text-muted"
          }
        `}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

