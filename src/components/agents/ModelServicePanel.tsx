"use client";

import { ChevronRight, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Row = { id: string; name: string; badge?: string };

const DEFAULT_MODELS: Row[] = [
  { id: "m1", name: "minimax-m2.5", badge: "Medium" },
  { id: "m2", name: "glm-5", badge: "Fast" },
  { id: "m3", name: "gpt-5", badge: "Low" },
];

export function ModelServicePanel({ className }: { className?: string }) {
  const [apiOpen, setApiOpen] = useState(false);
  const [q, setQ] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DEFAULT_MODELS.map((m, i) => [m.id, i === 0]))
  );

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DEFAULT_MODELS;
    return DEFAULT_MODELS.filter((m) => m.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className={cn("flex flex-col min-h-0 text-zinc-100", className)}>
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Models</h1>
        <p className="mt-1 text-sm text-zinc-500">
          模型服务 · 启用后将出现在 Machi 云端会话的候选列表（演示数据，后续对接 agx serve）
        </p>
      </div>

      <div className="px-8 py-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Add or search model"
            className="h-10 pl-9 pr-10 bg-zinc-900/80 border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 rounded-md"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            aria-label="Refresh"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-10">
        <div className="max-w-2xl rounded-lg border border-zinc-800/80 bg-zinc-950/50 divide-y divide-zinc-800/80">
          {rows.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-zinc-900/40 transition-colors"
            >
              <div className="min-w-0 flex items-center gap-3">
                <span className="font-medium text-sm text-zinc-100 truncate">{m.name}</span>
                {m.badge ? (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                    {m.badge}
                  </span>
                ) : null}
              </div>
              <Switch
                checked={enabled[m.id] ?? false}
                onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [m.id]: v }))}
                className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-zinc-700"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-3 text-sm text-sky-400/90 hover:text-sky-300 hover:underline underline-offset-2"
        >
          View all models
        </button>

        <div className="mt-8 max-w-2xl">
          <button
            type="button"
            onClick={() => setApiOpen((o) => !o)}
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 py-2"
          >
            <ChevronRight className={cn("size-4 transition-transform", apiOpen && "rotate-90")} />
            API Keys
          </button>
          {apiOpen ? (
            <p className="pt-2 pb-4 text-sm text-zinc-500 leading-relaxed border-l border-zinc-800 pl-4 ml-1">
              云端 Machi 后续将复用与桌面一致的供应商密钥策略；此处仅占位，请勿在公共环境粘贴真实密钥。
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
