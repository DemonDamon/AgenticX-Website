"use client";

import { useMemo, useState } from "react";

import { useAgentsLocale } from "@/contexts/agents-locale-context";
import type { AgentsCopy } from "@/lib/agents-locale-copy";

function modelOptions(t: AgentsCopy) {
  return [
    { value: "auto", label: t.settingsModelOptionAuto },
    { value: "minimax-m2.5", label: t.settingsModelOptionMinimax },
    { value: "deepseek-r1", label: t.settingsModelOptionDeepseek },
    { value: "gpt-5", label: t.settingsModelOptionGpt5 },
    { value: "qwen-max", label: t.settingsModelOptionQwen },
    { value: "glm-5", label: t.settingsModelOptionGlm },
  ];
}

function ModelSelect({
  label,
  desc,
  value,
  onChange,
  options,
}: {
  label: string;
  desc: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="max-w-md">
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-10 rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 text-sm text-zinc-100 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-zinc-500">{desc}</p>
    </div>
  );
}

export function DefaultModelsTab() {
  const { t } = useAgentsLocale();
  const options = useMemo(() => modelOptions(t), [t]);
  const [chatModel, setChatModel] = useState("auto");
  const [namingModel, setNamingModel] = useState("auto");
  const [searchModel, setSearchModel] = useState("auto");

  return (
    <div className="px-8 py-6 space-y-8">
      <h2 className="text-xl font-semibold text-white">{t.settingsDefaultsTitle}</h2>
      <ModelSelect
        label={t.settingsDefaultChatModelLabel}
        desc={t.settingsDefaultChatModelDesc}
        value={chatModel}
        onChange={setChatModel}
        options={options}
      />
      <ModelSelect
        label={t.settingsNamingModelLabel}
        desc={t.settingsNamingModelDesc}
        value={namingModel}
        onChange={setNamingModel}
        options={options}
      />
      <ModelSelect
        label={t.settingsSearchConstructModelLabel}
        desc={t.settingsSearchConstructModelDesc}
        value={searchModel}
        onChange={setSearchModel}
        options={options}
      />
    </div>
  );
}
