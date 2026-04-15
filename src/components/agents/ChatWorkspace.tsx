"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Paperclip,
  ChevronDown,
  Globe,
  GlobeLock,
  Microscope,
  Check,
  Zap,
  Brain,
  Cpu,
  ArrowUp,
  FileText,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAgentsLocale } from "@/contexts/agents-locale-context";
import { cn } from "@/lib/utils";

const MODEL_IDS = ["minimax-m2.5", "deepseek-r1", "qwen-max"] as const;
type ModelId = (typeof MODEL_IDS)[number];

const MODEL_ICONS: Record<ModelId, LucideIcon> = {
  "minimax-m2.5": Zap,
  "deepseek-r1": Brain,
  "qwen-max": Cpu,
};

type Props = {
  /** 由父级（侧栏）控制是否启用深度研究 */
  deepResearch?: boolean;
  /** 叉掉 chip 时通知父级关闭深度研究 */
  onDeepResearchDismiss?: () => void;
  className?: string;
};

const MAX_INLINE_TEXT_BYTES = 4000;
const MAX_TEXTAREA_HEIGHT_PX = 420;

type TextAttachment = {
  name: string;
  bytes: number;
  content: string;
};

export function ChatWorkspace({
  deepResearch = false,
  onDeepResearchDismiss,
  className,
}: Props) {
  const { t } = useAgentsLocale();
  const [selectedModelId, setSelectedModelId] = useState<ModelId>("minimax-m2.5");
  const [modelOpen, setModelOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [draft, setDraft] = useState("");
  const [textAttachment, setTextAttachment] = useState<TextAttachment | null>(null);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineNoticeTimerRef = useRef<number | null>(null);
  const canSend = draft.trim().length > 0 || !!textAttachment;

  const selectedMeta = t.models[selectedModelId];
  const ModelIcon = MODEL_ICONS[selectedModelId];

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 120), MAX_TEXTAREA_HEIGHT_PX);
    textarea.style.height = `${nextHeight}px`;
  }, [draft]);

  useEffect(() => {
    return () => {
      if (inlineNoticeTimerRef.current) {
        window.clearTimeout(inlineNoticeTimerRef.current);
      }
    };
  }, []);

  function getUtf8Bytes(text: string): number {
    return new TextEncoder().encode(text).length;
  }

  function showInlineNotice(message: string) {
    setInlineNotice(message);
    if (inlineNoticeTimerRef.current) {
      window.clearTimeout(inlineNoticeTimerRef.current);
    }
    inlineNoticeTimerRef.current = window.setTimeout(() => {
      setInlineNotice(null);
      inlineNoticeTimerRef.current = null;
    }, 2600);
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  function convertLongTextToAttachment(content: string) {
    const bytes = getUtf8Bytes(content);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    setTextAttachment({
      name: `long-text-${timestamp}.txt`,
      bytes,
      content,
    });
    setDraft("");
    showInlineNotice(`粘贴内容超过 ${MAX_INLINE_TEXT_BYTES} 字节，已自动转换为 txt 附件`);
  }

  function handleDraftChange(next: string) {
    if (!next) {
      setDraft("");
      return;
    }
    const bytes = getUtf8Bytes(next);
    if (bytes > MAX_INLINE_TEXT_BYTES) {
      convertLongTextToAttachment(next);
      return;
    }
    setDraft(next);
  }

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-0 flex-1 px-4 py-8", className)}>
      <div className="flex flex-col items-center max-w-xl w-full">
        <Image
          src="/machi-lineart-mask.png"
          alt="Machi"
          width={404}
          height={379}
          priority
          className="mb-3 w-full max-w-[260px] h-auto object-contain select-none pointer-events-none mix-blend-difference"
          sizes="(max-width: 768px) 90vw, 260px"
        />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-[0.12em] text-zinc-900 dark:text-white">MACHI</h1>
      </div>

      {inlineNotice && (
        <div className="pointer-events-none fixed top-4 left-1/2 z-[60] -translate-x-1/2">
          <div className="rounded-full bg-zinc-800 px-5 py-2.5 text-center text-sm text-zinc-100 shadow-2xl dark:bg-zinc-700">
            {inlineNotice}
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mt-12 relative">
        <div
          className={cn(
            "rounded-[20px] overflow-visible bg-white dark:bg-[#262626]",
            "border border-zinc-200 dark:border-white/[0.14]",
            "shadow-xl dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.10)]"
          )}
        >
          {textAttachment && (
            <div className="pt-4 px-4 pb-1">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-gray-50 p-2 dark:border-zinc-700/50 dark:bg-[#333333]">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-2.5 dark:border-zinc-700/80 dark:bg-[#262626]">
                  <FileText className="size-5 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div className="flex flex-col justify-center min-w-0 pr-1">
                  <div className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100 max-w-[160px] sm:max-w-[240px]">
                    {textAttachment.name}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 uppercase">
                    TXT {formatBytes(textAttachment.bytes)}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 text-zinc-400 hover:bg-gray-200 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 self-start"
                  onClick={() => setTextAttachment(null)}
                  aria-label="移除文本附件"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            className="w-full min-h-[120px] resize-none overflow-y-auto bg-transparent text-zinc-900 px-4 pt-3 pb-2 text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            placeholder={deepResearch ? t.chatPlaceholderDeep : t.chatPlaceholder}
            rows={4}
          />

          <div className="flex items-center gap-2 border-t border-zinc-100 bg-gray-50 px-2 py-2 sm:px-3 rounded-b-[20px] dark:border-white/[0.08] dark:bg-[#1e1e1e]">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              <Tooltip delayDuration={280}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 text-zinc-500 hover:bg-gray-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                    aria-label={t.attachAria}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  hideArrow
                  side="top"
                  sideOffset={10}
                  className="max-w-[min(calc(100vw-2rem),288px)] border border-zinc-200 bg-white px-4 py-2.5 text-left text-xs leading-relaxed text-zinc-700 shadow-xl dark:border-zinc-700/80 dark:bg-[#3a3a3a] dark:text-white"
                >
                  <p>{t.attachTooltipLine1}</p>
                  <p className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-200">{t.attachTooltipLine2}</p>
                </TooltipContent>
              </Tooltip>
              {!deepResearch && (
                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={cn(
                    "flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl text-xs font-medium transition-all border shrink-0",
                    webSearch
                      ? "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-600/20 dark:text-sky-400 dark:border-sky-600/50"
                      : "text-zinc-600 border-zinc-200 hover:bg-white hover:text-zinc-900 dark:text-zinc-500 dark:border-zinc-700/60 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  {webSearch ? <Globe className="size-3.5" /> : <GlobeLock className="size-3.5" />}
                  <span className="max-[380px]:hidden sm:inline">
                    {webSearch ? t.webOn : t.webOff}
                  </span>
                </button>
              )}
              {deepResearch && (
                <button
                  type="button"
                  onClick={onDeepResearchDismiss}
                  className="group flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl text-xs font-medium bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 transition-all shrink-0 dark:bg-sky-600/20 dark:border-sky-600/40 dark:text-sky-400 dark:hover:bg-sky-600/30"
                  title={t.closeDeepResearchTitle}
                >
                  <Microscope className="size-3.5 group-hover:hidden" />
                  <XCircle className="size-3.5 hidden group-hover:block" />
                  <span>{t.agentDeepResearch}</span>
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="relative max-w-[min(52vw,220px)] sm:max-w-[260px]" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setModelOpen(!modelOpen)}
                  className={cn(
                    "flex h-9 w-full min-w-0 items-center gap-1.5 rounded-full border px-2.5 pl-2 text-xs font-medium transition-colors",
                    "bg-white border-zinc-200 text-zinc-700 hover:bg-gray-50 dark:bg-[#2a2a2a] dark:border-zinc-600/40 dark:text-zinc-100 dark:hover:bg-[#323232] dark:hover:border-zinc-500/50"
                  )}
                >
                  <ModelIcon className="size-3.5 shrink-0 text-sky-500 dark:text-sky-400" />
                  <span className="truncate">{selectedMeta?.label ?? selectedModelId}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                      modelOpen && "rotate-180"
                    )}
                  />
                </button>
                {modelOpen && (
                  <div className="absolute bottom-full right-0 z-50 mb-2 w-[min(calc(100vw-2rem),280px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white py-1 shadow-2xl dark:border-zinc-700/80 dark:bg-zinc-900">
                    {MODEL_IDS.map((id) => {
                      const Icon = MODEL_ICONS[id];
                      const meta = t.models[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setSelectedModelId(id);
                            setModelOpen(false);
                          }}
                          className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/70"
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <Icon className="mt-0.5 size-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {meta?.label ?? id}
                              </div>
                              <div className="mt-0.5 text-xs text-zinc-500">{meta?.desc ?? ""}</div>
                            </div>
                          </div>
                          {selectedModelId === id && (
                            <Check className="mt-0.5 size-4 shrink-0 text-sky-500 dark:text-sky-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                aria-disabled={!canSend}
                onClick={() => {
                  if (!canSend) return;
                }}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 transition-colors",
                  canSend
                    ? "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-white"
                    : "cursor-default bg-gray-200 text-zinc-400 dark:bg-[#4a4a4a] dark:text-zinc-800"
                )}
              >
                <ArrowUp className="size-[18px] stroke-[2.25]" strokeLinecap="round" strokeLinejoin="round" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
