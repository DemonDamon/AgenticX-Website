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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const canSend = draft.trim().length > 0;

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
        <h1 className="text-4xl sm:text-5xl font-bold tracking-[0.12em] text-white">MACHI</h1>
      </div>

      <div className="w-full max-w-3xl mt-12 relative">
        <div
          className={cn(
            "rounded-[20px] overflow-visible bg-[#262626]",
            "border border-white/[0.14]",
            "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.10)]"
          )}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full min-h-[120px] max-h-[280px] resize-none bg-transparent text-zinc-100 text-sm px-4 pt-3 pb-2 outline-none placeholder:text-zinc-500"
            placeholder={deepResearch ? t.chatPlaceholderDeep : t.chatPlaceholder}
            rows={4}
          />

          <div className="flex items-center gap-2 border-t border-white/[0.08] bg-[#1e1e1e] px-2 py-2 sm:px-3 rounded-b-[20px]">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              <Tooltip delayDuration={280}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 text-zinc-400 hover:text-zinc-100"
                    aria-label={t.attachAria}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  hideArrow
                  side="top"
                  sideOffset={10}
                  className="max-w-[min(calc(100vw-2rem),288px)] border-0 bg-[#3a3a3a] px-4 py-2.5 text-left text-xs leading-relaxed text-white shadow-xl"
                >
                  <p>{t.attachTooltipLine1}</p>
                  <p className="mt-2 text-[13px] text-zinc-200">{t.attachTooltipLine2}</p>
                </TooltipContent>
              </Tooltip>
              {!deepResearch && (
                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={cn(
                    "flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl text-xs font-medium transition-all border shrink-0",
                    webSearch
                      ? "bg-sky-600/20 text-sky-400 border-sky-600/50"
                      : "text-zinc-500 border-zinc-700/60 hover:text-zinc-300 hover:border-zinc-600"
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
                  className="group flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl text-xs font-medium bg-sky-600/20 border border-sky-600/40 text-sky-400 hover:bg-sky-600/30 transition-all shrink-0"
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
                    "bg-[#2a2a2a] text-zinc-100 border-zinc-600/40",
                    "hover:bg-[#323232] hover:border-zinc-500/50"
                  )}
                >
                  <ModelIcon className="size-3.5 shrink-0 text-sky-400" />
                  <span className="truncate">{selectedMeta?.label ?? selectedModelId}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 text-zinc-500 transition-transform duration-200",
                      modelOpen && "rotate-180"
                    )}
                  />
                </button>
                {modelOpen && (
                  <div className="absolute bottom-full right-0 z-50 mb-2 w-[min(calc(100vw-2rem),280px)] overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 py-1 shadow-2xl">
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
                          className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/70"
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <Icon className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-zinc-100">
                                {meta?.label ?? id}
                              </div>
                              <div className="mt-0.5 text-xs text-zinc-500">{meta?.desc ?? ""}</div>
                            </div>
                          </div>
                          {selectedModelId === id && (
                            <Check className="mt-0.5 size-4 shrink-0 text-sky-400" />
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
                    ? "cursor-pointer bg-zinc-100 text-zinc-800 hover:bg-white"
                    : "cursor-default bg-[#4a4a4a] text-zinc-800"
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
