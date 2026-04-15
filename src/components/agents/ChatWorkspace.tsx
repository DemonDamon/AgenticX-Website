"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  SendHorizontal,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Model = { id: string; label: string; desc: string; icon: React.ElementType };

const MODELS: Model[] = [
  { id: "minimax-m2.5", label: "移动云 / minimax-m2.5", desc: "适用于大部分情况",   icon: Zap   },
  { id: "deepseek-r1",  label: "DeepSeek R1",            desc: "擅长解决更难的问题", icon: Brain },
  { id: "qwen-max",     label: "通义千问 Max",            desc: "研究级智能模型",    icon: Cpu   },
];

type Props = {
  modelLabel?: string;
  /** 由父级（侧栏）控制是否启用深度研究 */
  deepResearch?: boolean;
  /** 叉掉 chip 时通知父级关闭深度研究 */
  onDeepResearchDismiss?: () => void;
  className?: string;
};

export function ChatWorkspace({
  modelLabel = "移动云 / minimax-m2.5",
  deepResearch = false,
  onDeepResearchDismiss,
  className,
}: Props) {
  const [selectedModel, setSelectedModel] = useState<Model>(
    MODELS.find((m) => m.label === modelLabel) ?? MODELS[0]
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const ModelIcon = selectedModel.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-0 flex-1 px-4 py-8", className)}>
      {/* Avatar + title */}
      <div className="flex flex-col items-center max-w-xl w-full">
        <Image
          src="/machi-lineart-mask.png"
          alt="Machi"
          width={404}
          height={379}
          priority
          className="mb-6 w-full max-w-[210px] h-auto object-contain select-none pointer-events-none mix-blend-difference"
          sizes="(max-width: 768px) 90vw, 210px"
        />
        <h1 className="text-3xl font-bold tracking-tight text-white">Machi</h1>
        <p className="mt-2 text-xs tracking-[0.2em] text-zinc-500 uppercase text-center">
          Orchestrated by Machi · Executed by AgenticX
        </p>
      </div>

      {/* Input area */}
      <div className="w-full max-w-3xl mt-12 relative">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-xl overflow-visible">
          <textarea
            className="w-full min-h-[120px] max-h-[280px] resize-none bg-transparent text-zinc-100 text-sm px-4 py-3 outline-none placeholder:text-zinc-600"
            placeholder={deepResearch ? "描述你的问题，生成深度研究报告…" : "发消息…"}
            rows={4}
          />

          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-zinc-800/80 bg-black/20 rounded-b-2xl">

            {/* Left: 附件 · 模型选择 · 联网 · [深度研究 chip] */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* 附件 */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-zinc-400 hover:text-zinc-100 h-9 w-9 shrink-0"
              >
                <Paperclip className="size-4" />
              </Button>

              {/* 模型选择 */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setModelOpen(!modelOpen)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors border border-zinc-700/60"
                >
                  <ModelIcon className="size-3.5 text-sky-400" />
                  <span>{selectedModel.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-zinc-500 transition-transform duration-200",
                      modelOpen && "rotate-180"
                    )}
                  />
                </button>

                {modelOpen && (
                  <div className="absolute bottom-full mb-2 left-0 min-w-[240px] rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl z-50 py-1 overflow-hidden">
                    {MODELS.map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                          className="w-full flex items-start justify-between gap-3 px-4 py-3 hover:bg-zinc-800/70 transition-colors text-left"
                        >
                          <div className="flex items-start gap-2.5">
                            <Icon className="size-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-zinc-100">{m.label}</div>
                              <div className="text-xs text-zinc-500 mt-0.5">{m.desc}</div>
                            </div>
                          </div>
                          {selectedModel.id === m.id && (
                            <Check className="size-4 text-sky-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 联网搜索 */}
              <button
                type="button"
                onClick={() => setWebSearch(!webSearch)}
                className={cn(
                  "flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium transition-all border shrink-0",
                  webSearch
                    ? "bg-sky-600/20 text-sky-400 border-sky-600/50"
                    : "text-zinc-500 border-zinc-700/60 hover:text-zinc-300 hover:border-zinc-600"
                )}
              >
                {webSearch
                  ? <Globe     className="size-3.5" />
                  : <GlobeLock className="size-3.5" />
                }
                <span>{webSearch ? "联网已开启" : "联网搜索"}</span>
              </button>

              {/* 深度研究 chip：仅当父级激活时出现，hover 显示叉号 */}
              {deepResearch && (
                <button
                  type="button"
                  onClick={onDeepResearchDismiss}
                  className="group flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium bg-sky-600/20 border border-sky-600/40 text-sky-400 hover:bg-sky-600/30 transition-all shrink-0"
                  title="关闭深度研究"
                >
                  {/* 正常态：显微镜图标；hover 态：叉号 */}
                  <Microscope className="size-3.5 group-hover:hidden" />
                  <XCircle    className="size-3.5 hidden group-hover:block" />
                  <span>Agent</span>
                  <span className="text-sky-500/60 mx-0.5">|</span>
                  <span>深度研究</span>
                </button>
              )}
            </div>

            {/* Right: 发送 */}
            <Button
              type="button"
              size="icon"
              className="h-9 w-9 bg-sky-600 hover:bg-sky-500 text-white border-0 rounded-xl shrink-0"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
