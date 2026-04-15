"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { useAgentsLocale } from "@/contexts/agents-locale-context";
import type { AgentsCopy } from "@/lib/agents-locale-copy";

function searchProviders(t: AgentsCopy) {
  return [
    { id: "machi", label: t.settingsWebSearchProviderMachi },
    { id: "bocha", label: t.settingsWebSearchProviderBocha },
    { id: "tavily", label: t.settingsWebSearchProviderTavily },
    { id: "bing", label: t.settingsWebSearchProviderBing },
  ];
}

export function WebSearchTab() {
  const { t } = useAgentsLocale();
  const providers = useMemo(() => searchProviders(t), [t]);
  const [provider, setProvider] = useState("machi");

  return (
    <div className="px-8 py-6 space-y-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{t.settingsWebSearchTitle}</h2>

      <div className="max-w-md">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">{t.settingsWebSearchProviderLabel}</h3>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100"
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="max-w-md">
        <p className="text-xs text-zinc-500 mb-2">{t.settingsWebSearchToolsCaption}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <Check className="size-4 text-emerald-500" strokeWidth={2.5} />
            {t.settingsWebSearchToolWeb}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <Check className="size-4 text-emerald-500" strokeWidth={2.5} />
            {t.settingsWebSearchToolReadPage}
          </div>
        </div>
      </div>

      {provider !== "machi" && (
        <div className="max-w-md pt-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t.settingsWebSearchApiKey}</label>
          <input
            type="password"
            placeholder={t.settingsWebSearchApiPlaceholder}
            className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
      )}

      <p className="max-w-md text-xs text-zinc-600">
        {provider === "machi"
          ? t.settingsWebSearchFootnoteMachi
          : t.settingsWebSearchFootnoteThirdParty}
      </p>
    </div>
  );
}
