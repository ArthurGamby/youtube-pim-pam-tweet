"use client";

import { SlidersHorizontal, ChevronDown, SmilePlus, Smile, Ban } from "lucide-react";

export type Filters = {
  maxChars: number;
  emojiMode: "none" | "few" | "many";
};

type FilterButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  filters: Filters;
};

export function FilterButton({ isOpen, onToggle, filters }: FilterButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-1 items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors ${
        isOpen ? "border-muted bg-card" : "border-border bg-card hover:border-muted"
      }`}
    >
      <span className="flex items-center gap-2 text-muted">
        <SlidersHorizontal size={14} />
        <span>Filters</span>
        <span className="text-xs text-muted/60">
          {filters.maxChars} · {filters.emojiMode}
        </span>
      </span>
      <ChevronDown
        size={14}
        className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

type FilterPanelProps = {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
      {/* Max Characters */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted">Chars</label>
        <input
          type="range"
          min={100}
          max={280}
          step={20}
          value={filters.maxChars}
          onChange={(e) => onFiltersChange({ ...filters, maxChars: Number(e.target.value) })}
          className="w-24 accent-foreground"
        />
        <span className="w-8 text-xs tabular-nums text-foreground">{filters.maxChars}</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Emoji Mode */}
      <div className="flex items-center gap-1">
        <label className="mr-1 text-xs text-muted">Emoji</label>
        <button
          onClick={() => onFiltersChange({ ...filters, emojiMode: "none" })}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            filters.emojiMode === "none"
              ? "bg-foreground text-background"
              : "text-muted hover:bg-border"
          }`}
          title="No emojis"
        >
          <Ban size={14} />
        </button>
        <button
          onClick={() => onFiltersChange({ ...filters, emojiMode: "few" })}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            filters.emojiMode === "few"
              ? "bg-foreground text-background"
              : "text-muted hover:bg-border"
          }`}
          title="Few emojis"
        >
          <Smile size={14} />
        </button>
        <button
          onClick={() => onFiltersChange({ ...filters, emojiMode: "many" })}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            filters.emojiMode === "many"
              ? "bg-foreground text-background"
              : "text-muted hover:bg-border"
          }`}
          title="Many emojis"
        >
          <SmilePlus size={14} />
        </button>
      </div>
    </div>
  );
}
