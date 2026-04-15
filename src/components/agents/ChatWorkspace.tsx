"use client";

import Image from "next/image";
import {
  LayoutGrid,
  Mic,
  Paperclip,
  Sparkles,
  Wand2,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  modelLabel: string;
  className?: string;
};

export function ChatWorkspace({ modelLabel, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-0 flex-1 px-4 py-8", className)}>
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
            0 tokens
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
            未创建会话
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            {modelLabel}
          </span>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-xl overflow-hidden">
          <textarea
            className="w-full min-h-[120px] max-h-[280px] resize-none bg-transparent text-zinc-100 text-sm px-4 py-3 outline-none placeholder:text-zinc-600"
            placeholder="发消息…"
            rows={4}
          />
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-zinc-800/80 bg-black/20">
            <div className="flex items-center gap-1">
              <Button type="button" size="icon" variant="ghost" className="text-zinc-400 hover:text-zinc-100 h-9 w-9">
                <Paperclip className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 bg-sky-600/90 hover:bg-sky-500 text-white border-0"
              >
                <Wand2 className="size-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="text-zinc-400 hover:text-zinc-100 h-9 w-9">
                <Sparkles className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-2 text-zinc-400 hover:text-zinc-100 gap-1.5 text-xs"
              >
                <LayoutGrid className="size-4" />
                更多
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button type="button" size="icon" variant="ghost" className="text-zinc-500 h-9 w-9">
                <Maximize2 className="size-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="text-zinc-500 h-9 w-9">
                <Mic className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <span className="text-[11px] text-zinc-600 font-mono px-2 py-1 rounded-md border border-zinc-800/80">
            {modelLabel} ▾
          </span>
        </div>
      </div>
    </div>
  );
}
