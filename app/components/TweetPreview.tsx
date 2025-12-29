"use client";

import Image from "next/image";
import { Copy, Check, Bookmark, Loader2, ImagePlus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUploadThing } from "@/app/lib/uploadthing";

type TweetPreviewProps = {
  content: string | null;
  original?: string;
  context?: string;
  isLoading?: boolean;
  onSaveSuccess?: () => void;
};

export default function TweetPreview({ content, original, context, isLoading, onSaveSuccess }: TweetPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previousContentRef = useRef<string | null>(null);
  
  // Image state - file stored locally, only upload on save
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UploadThing hook for programmatic upload
  const { startUpload, isUploading } = useUploadThing("tweetImage");

  // Reset saved state and image when content changes (new tweet generated)
  useEffect(() => {
    if (content !== previousContentRef.current) {
      setSaved(false);
      previousContentRef.current = content;
      // Also clear image when generating new tweet
      if (content !== null && previousContentRef.current !== null) {
        handleRemoveImage();
      }
    }
  }, [content]);

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!content || !original || isSaving || saved) return;
    setIsSaving(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if selected
      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].ufsUrl;
        }
      }

      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original,
          transformed: content,
          context: context || null,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setSaved(true);
      onSaveSuccess?.(); // Notify parent to update count
      // No timeout - saved state persists until new tweet is generated
    } catch (error) {
      console.error("Error saving tweet:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 3 states: empty, loading, content
  const hasContent = !!content;
  const isProcessing = isSaving || isUploading;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium uppercase tracking-wider text-muted">
          Result
        </label>
        {hasContent && (
          <div className="flex items-center gap-1">
            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isProcessing || saved}
              className={`
                group relative flex items-center gap-1.5 rounded-md px-2 py-1 text-xs
                transition-all duration-200 ease-out
                ${saved 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }
                ${isProcessing ? "cursor-wait" : ""}
              `}
            >
              <span className="relative flex items-center justify-center w-3 h-3">
                {isProcessing ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : saved ? (
                  <Check size={12} className="animate-in zoom-in-50 duration-200" />
                ) : (
                  <Bookmark 
                    size={12} 
                    className="transition-transform duration-200 group-hover:scale-110" 
                  />
                )}
              </span>
              <span className="transition-opacity duration-200">
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : saved ? "Saved" : "Save"}
              </span>
            </button>

            <span className="text-border mx-1">·</span>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`
                group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs
                transition-all duration-200 ease-out
                ${copied 
                  ? "text-foreground" 
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }
              `}
            >
              <span className="relative flex items-center justify-center w-3 h-3">
                {copied ? (
                  <Check size={12} className="animate-in zoom-in-50 duration-200" />
                ) : (
                  <Copy 
                    size={12} 
                    className="transition-transform duration-200 group-hover:scale-110" 
                  />
                )}
              </span>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="rounded-lg border border-border bg-card p-4 card-elevated">
        {/* Tweet Header */}
        <div className="mb-3 flex items-center gap-3">
          <Image
            src="/Icon.svg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">Prisma Postgres</span>
              <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            </div>
            <span className="text-xs text-muted">@prismaData</span>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          // Loading state - animated skeleton
          <div className="space-y-2">
            <div className="h-4 w-[90%] animate-pulse rounded bg-border" />
            <div className="h-4 w-[75%] animate-pulse rounded bg-border" />
            <div className="h-4 w-[60%] animate-pulse rounded bg-border" />
          </div>
        ) : hasContent ? (
          // Content state - the tweet
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          // Empty state - looks like a tweet
          <p className="text-sm leading-relaxed text-muted">
            Follow us on X to stay updated on all the latest features and releases from Prisma! 🚀
            <br /><br />
            Your polished tweet will appear here ✨
          </p>
        )}

        {/* Image Preview */}
        {previewUrl && (
          <div className="relative mt-3 rounded-xl overflow-hidden border border-border">
            <img
              src={previewUrl}
              alt="Tweet attachment"
              className="w-full max-h-72 object-cover"
            />
            {!saved && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Image Picker - only show when there's content and no image yet */}
        {hasContent && !previewUrl && !saved && (
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="tweet-image-input"
            />
            <label
              htmlFor="tweet-image-input"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-muted hover:text-foreground hover:border-accent/50 transition-colors cursor-pointer text-xs"
            >
              <ImagePlus size={14} />
              <span>Add image</span>
            </label>
          </div>
        )}

        {/* Tweet Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          {isLoading ? (
            <div className="h-3 w-24 animate-pulse rounded bg-border" />
          ) : hasContent ? (
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-muted">
                {content?.length} / 280 characters
              </span>
              {selectedFile && (
                <span className="text-xs text-accent">
                  + image
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted/50">
              prisma.io
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
