"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Eye, EyeOff, RefreshCw, Search, Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAgentsLocale } from "@/contexts/agents-locale-context";
import type { AgentsCopy } from "@/lib/agents-locale-copy";
import { cn } from "@/lib/utils";

import chatglmIcon from "../../../../../assets/icons/chatglm.png";
import claudeIcon from "../../../../../assets/icons/Claude.png";
import deepseekIcon from "../../../../../assets/icons/deepseek.png";
import geminiIcon from "../../../../../assets/icons/gemini-ai.png";
import kimiIcon from "../../../../../assets/icons/Kimi.png";
import minimaxIcon from "../../../../../assets/icons/MiniMax.png";
import openaiIcon from "../../../../../assets/icons/openai.png";
import qwenIcon from "../../../../../assets/icons/Qwen3.png";
import volcengineIcon from "../../../../../assets/icons/火山云.png";

type Provider = {
  id: string;
  name: string;
  icon: StaticImageData;
  /** 资源为深色描边/黑标：在 `dark` 主题下反相为浅色；浅色主题保持 PNG 原样 */
  invertOnDark?: boolean;
};

const PROVIDERS: Provider[] = [
  { id: "openai",     name: "OpenAI",     icon: openaiIcon,     invertOnDark: true },
  { id: "claude",     name: "Claude",     icon: claudeIcon },
  { id: "gemini",     name: "Gemini",     icon: geminiIcon },
  { id: "deepseek",   name: "DeepSeek",   icon: deepseekIcon },
  { id: "qwen",       name: "通义千问",   icon: qwenIcon },
  { id: "zhipu",      name: "智谱 GLM",   icon: chatglmIcon },
  { id: "volcengine", name: "火山引擎",   icon: volcengineIcon },
  { id: "moonshot",   name: "Moonshot",   icon: kimiIcon,       invertOnDark: true },
  { id: "minimax",    name: "MiniMax",    icon: minimaxIcon },
];

function ProviderMarkImage({
  src,
  size,
  className,
  invertOnDark,
}: {
  src: StaticImageData;
  size: number;
  className?: string;
  invertOnDark?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-contain",
        /* 深色主题：黑标 → 浅色；浅色主题无 .dark 时保持 PNG 原色 */
        invertOnDark && "dark:brightness-0 dark:invert",
        className
      )}
      aria-hidden
    />
  );
}

type ModelRow = { id: string; name: string; tags: string[] };

/** 能力标签用英文 key，展示时按语言翻译；上下文长度（如 128K）原样展示 */
const PROVIDER_MODELS: Record<string, ModelRow[]> = {
  openai: [
    { id: "gpt-5",           name: "GPT-5",           tags: ["128K", "chat"] },
    { id: "gpt-4o",          name: "GPT-4o",          tags: ["128K", "vision"] },
    { id: "o3-pro",          name: "o3-pro",          tags: ["200K", "reasoning"] },
    { id: "o4-mini",         name: "o4-mini",         tags: ["200K", "fast"] },
  ],
  claude: [
    { id: "claude-opus-4",   name: "Claude Opus 4",   tags: ["200K", "chat"] },
    { id: "claude-sonnet-4", name: "Claude Sonnet 4", tags: ["200K", "chat"] },
  ],
  gemini: [
    { id: "gemini-2.5-pro",  name: "Gemini 2.5 Pro",  tags: ["1M", "chat"] },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", tags: ["1M", "fast"] },
  ],
  deepseek: [
    { id: "deepseek-r1",     name: "DeepSeek R1",     tags: ["64K", "reasoning"] },
    { id: "deepseek-v3",     name: "DeepSeek V3",     tags: ["128K", "chat"] },
  ],
  minimax: [
    { id: "minimax-m2.5",    name: "MiniMax M2.5",    tags: ["1M", "chat"] },
  ],
  zhipu: [
    { id: "glm-5",           name: "GLM-5",           tags: ["128K", "chat"] },
  ],
  qwen: [
    { id: "qwen-max",        name: "Qwen Max",        tags: ["128K", "chat"] },
    { id: "qwen-plus",       name: "Qwen Plus",       tags: ["128K", "fast"] },
  ],
  volcengine: [
    { id: "doubao-pro-32k",  name: "Doubao Pro 32K",    tags: ["32K", "chat"] },
    { id: "doubao-lite-32k", name: "Doubao Lite 32K", tags: ["32K", "fast"] },
  ],
  moonshot: [
    { id: "moonshot-v1-128k", name: "Moonshot v1 128K", tags: ["128K", "chat"] },
  ],
};

function formatModelTag(tag: string, t: AgentsCopy): string {
  switch (tag) {
    case "chat":
      return t.settingsModelTagChat;
    case "vision":
      return t.settingsModelTagVision;
    case "reasoning":
      return t.settingsModelTagReasoning;
    case "fast":
      return t.settingsModelTagFast;
    default:
      return tag;
  }
}

export function ModelProviderTab() {
  const { t } = useAgentsLocale();
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [apiHost, setApiHost] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [modelSearch, setModelSearch] = useState("");

  const provider = PROVIDERS.find((p) => p.id === selectedProvider)!;
  const allModels = PROVIDER_MODELS[selectedProvider] ?? [];

  const models = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    if (!q) return allModels;
    return allModels.filter((m) => m.name.toLowerCase().includes(q));
  }, [modelSearch, allModels]);

  return (
    <div className="flex min-h-0 h-full">
      {/* Provider 侧栏 */}
      <div className="w-[180px] shrink-0 border-r border-zinc-800/50 overflow-y-auto py-2">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => { setSelectedProvider(p.id); setModelSearch(""); }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors",
              selectedProvider === p.id
                ? "bg-sky-600/15 text-sky-400"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
            )}
          >
            <ProviderMarkImage
              src={p.icon}
              size={20}
              invertOnDark={p.invertOnDark}
              className="size-5"
            />
            <span className="truncate">{p.name}</span>
          </button>
        ))}
      </div>

      {/* 详情区 */}
      <div className="flex-1 min-w-0 overflow-y-auto px-8 py-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <ProviderMarkImage
            src={provider.icon}
            size={28}
            invertOnDark={provider.invertOnDark}
            className="size-7"
          />
          {provider.name}
        </h2>

        {/* API Key */}
        <div className="mt-6 max-w-xl">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t.settingsModelServiceApiKey}</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="h-10 pr-10 bg-zinc-900/70 border-zinc-700/80 text-sm text-zinc-100 placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button
              type="button"
              className="h-10 px-4 rounded-md border border-zinc-700 bg-zinc-800/80 text-sm text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100 transition-colors"
            >
              {t.settingsModelServiceCheck}
            </button>
          </div>
        </div>

        {/* API Host */}
        <div className="mt-5 max-w-xl">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t.settingsModelServiceApiHost}</label>
          <Input
            value={apiHost}
            onChange={(e) => setApiHost(e.target.value)}
            placeholder={`https://api.${selectedProvider}.com`}
            className="h-10 bg-zinc-900/70 border-zinc-700/80 text-sm text-zinc-100 placeholder:text-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-600">
            {`https://api.${selectedProvider}.com/v1/chat/completions`}
          </p>
        </div>

        {/* Model 列表 */}
        <div className="mt-8 max-w-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-300">{t.settingsModelServiceModelList}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-sky-600/50 bg-sky-600/15 px-2.5 py-1 text-xs font-medium text-sky-400 hover:bg-sky-600/25 transition-colors"
              >
                {t.settingsModelServiceNew}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <RefreshCw className="size-3" /> {t.settingsModelServiceReset}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <Search className="size-3" /> {t.settingsModelServiceFetch}
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder={t.settingsModelServiceSearchPlaceholder}
              className="h-8 pl-8 bg-zinc-900/60 border-zinc-700/80 text-xs text-zinc-100 placeholder:text-zinc-600"
            />
          </div>

          <div className="rounded-lg border border-zinc-800/80 divide-y divide-zinc-800/70">
            {models.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-100">{m.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {m.tags.map((tag, ti) => (
                      <span
                        key={`${m.id}-${tag}-${ti}`}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-500"
                      >
                        {formatModelTag(tag, t)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" className="p-1 text-zinc-600 hover:text-zinc-300 rounded">
                    <Settings className="size-3.5" />
                  </button>
                  <button type="button" className="p-1 text-zinc-600 hover:text-red-400 rounded">
                    ⊖
                  </button>
                </div>
              </div>
            ))}
            {models.length === 0 && (
              <p className="px-3 py-4 text-xs text-zinc-600 text-center">{t.settingsModelServiceNoMatch}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
