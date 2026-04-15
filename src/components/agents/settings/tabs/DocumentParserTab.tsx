"use client";

import { useMemo, useState } from "react";

import { useAgentsLocale } from "@/contexts/agents-locale-context";
import type { AgentsCopy } from "@/lib/agents-locale-copy";

function parserOptions(t: AgentsCopy) {
  return [
    { id: "text", label: t.settingsParserOptionText },
    { id: "machi", label: t.settingsParserOptionMachi },
  ];
}

export function DocumentParserTab() {
  const { t } = useAgentsLocale();
  const options = useMemo(() => parserOptions(t), [t]);
  const [parser, setParser] = useState("text");

  return (
    <div className="px-8 py-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">{t.settingsParserTitle}</h2>

      <div className="max-w-md">
        <h3 className="text-sm font-semibold text-white mb-2">{t.settingsParserTypeLabel}</h3>
        <select
          value={parser}
          onChange={(e) => setParser(e.target.value)}
          className="w-full h-10 rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 text-sm text-zinc-100 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      <p className="max-w-md text-xs text-zinc-500 leading-relaxed">
        {parser === "text" ? t.settingsParserHintText : t.settingsParserHintMachi}
      </p>
    </div>
  );
}
