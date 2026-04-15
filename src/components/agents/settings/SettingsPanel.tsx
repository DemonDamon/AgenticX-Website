"use client";

import { useState } from "react";
import {
  Bot,
  Boxes,
  FileText,
  Globe,
  MessageSquareText,
  Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAgentsLocale } from "@/contexts/agents-locale-context";

import { ModelProviderTab } from "./tabs/ModelProviderTab";
import { DefaultModelsTab } from "./tabs/DefaultModelsTab";
import { WebSearchTab } from "./tabs/WebSearchTab";
import { DocumentParserTab } from "./tabs/DocumentParserTab";
import { ChatSettingsTab } from "./tabs/ChatSettingsTab";
import { GeneralSettingsTab } from "./tabs/GeneralSettingsTab";

type TabId = "provider" | "defaults" | "search" | "parser" | "chat" | "general";

export function SettingsPanel({ className }: { className?: string }) {
  const { t } = useAgentsLocale();
  const [activeTab, setActiveTab] = useState<TabId>("provider");

  const TABS = [
    { id: "provider",  icon: Boxes,             label: t.modelService },
    { id: "defaults",  icon: Bot,               label: t.settingsDefaultsTitle },
    { id: "search",    icon: Globe,             label: t.settingsWebSearchTitle },
    { id: "parser",    icon: FileText,          label: t.settingsParserTitle },
    { id: "chat",      icon: MessageSquareText, label: t.settingsChatTitle },
    { id: "general",   icon: Settings2,         label: t.settingsGeneralTitle },
  ] as const;

  return (
    <div className={cn("flex min-h-0", className)}>
      {/* 左侧导航 */}
      <nav className="w-[200px] shrink-0 border-r border-zinc-200/60 bg-gray-50 dark:border-zinc-800/60 dark:bg-[#111111] overflow-y-auto py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left",
                active
                  ? "bg-sky-50 text-sky-600 border-l-2 border-sky-500 dark:bg-sky-600/15 dark:text-sky-400 dark:border-sky-500"
                  : "text-zinc-600 hover:bg-gray-100 hover:text-zinc-900 border-l-2 border-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {activeTab === "provider" && <ModelProviderTab />}
        {activeTab === "defaults" && <DefaultModelsTab />}
        {activeTab === "search" && <WebSearchTab />}
        {activeTab === "parser" && <DocumentParserTab />}
        {activeTab === "chat" && <ChatSettingsTab />}
        {activeTab === "general" && <GeneralSettingsTab />}
      </div>
    </div>
  );
}
