"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAgentsLocale } from "@/contexts/agents-locale-context";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 6;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackDialog({ open, onOpenChange }: Props) {
  const { t } = useAgentsLocale();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasText = text.trim().length > 0;
  const canSubmit = hasText;

  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setText("");
      setFiles([]);
    }
    prevOpenRef.current = open;
  }, [open]);

  function addImageFiles(list: FileList | File[]) {
    const next = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (next.length === 0) return;
    setFiles((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items?.length) return;
    const fromClipboard: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) fromClipboard.push(f);
      }
    }
    if (fromClipboard.length === 0) return;
    e.preventDefault();
    setFiles((prev) => [...prev, ...fromClipboard].slice(0, MAX_IMAGES));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    toast.success(t.feedbackToastSuccess, {
      duration: 4500,
      position: "top-center",
      classNames: {
        toast:
          "bg-white border border-zinc-200 text-zinc-900 shadow-xl rounded-2xl dark:bg-[#18181b] dark:border-zinc-600/80 dark:text-zinc-100",
        title:
          "text-[15px] font-medium text-zinc-900 dark:text-zinc-100",
        icon: "text-emerald-500",
      },
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl dark:border-zinc-700/80 dark:bg-[#141414] dark:text-zinc-100 sm:max-w-[540px] overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.dialogFeedbackTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-500">
              {t.feedbackSubtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-4 max-h-[min(70vh,560px)] overflow-y-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            placeholder={t.feedbackPlaceholder}
            rows={6}
            className={cn(
              "w-full min-h-[140px] resize-y rounded-xl border bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-[box-shadow,border-color] dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              hasText
                ? "border-sky-500/50 shadow-[0_0_0_1px_rgba(56,189,248,0.25)] dark:border-sky-500/50"
                : "border-zinc-200 focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400/20 dark:border-zinc-700/80 dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-500/20"
            )}
          />

          <p className="text-xs text-zinc-500 dark:text-zinc-500">{t.feedbackImageHint}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={(e) => {
              const fl = e.target.files;
              if (fl?.length) addImageFiles(fl);
              e.target.value = "";
            }}
          />

          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-gray-50 dark:border-zinc-700/80 dark:bg-zinc-900/50"
              >
                <Image src={url} alt="" fill className="object-cover" sizes="80px" unoptimized />
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/65 text-zinc-200 hover:bg-black/85"
                  aria-label="Remove"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {files.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-gray-50 text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-white hover:text-zinc-600 dark:border-zinc-600/80 dark:bg-zinc-900/40 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                aria-label={t.feedbackAddImageAria}
              >
                <Plus className="size-7 stroke-[1.25]" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-gray-50 px-6 py-4 dark:border-zinc-800/90 dark:bg-[#121212]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-gray-100 dark:border-zinc-700/80 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-700/90"
          >
            {t.feedbackCancel}
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              canSubmit
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "cursor-not-allowed bg-gray-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 opacity-80 dark:opacity-60"
            )}
          >
            {t.feedbackSubmit}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
