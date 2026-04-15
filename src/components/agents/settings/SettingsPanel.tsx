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

import { ModelProviderTab } from "./tabs/ModelProviderTab";
import { DefaultModelsTab } from "./tabs/DefaultModelsTab";
import { WebSearchTab } from "./tabs/WebSearchTab";
import { DocumentParserTab } from "./tabs/DocumentParserTab";
import { ChatSettingsTab } from "./tabs/ChatSettingsTab";
import { GeneralSettingsTab } from "./tabs/GeneralSettingsTab";

const TABS = [
  { id: "provider",  icon: Boxes,             label: "模型服务",  labelEn: "Model Provider" },
  { id: "defaults",  icon: Bot,               label: "默认模型",  labelEn: "Default Models" },
  { id: "search",    icon: Globe,             label: "网络搜索",  labelEn: "Web Search" },
  { id: "parser",    icon: FileText,          label: "文件解析",  labelEn: "Document Parser" },
  { id: "chat",      icon: MessageSquareText, label: "对话设置",  labelEn: "Dialog Settings" },
  { id: "general",   icon: Settings2,         label: "常规设置",  labelEn: "General Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPanel({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("provider");

  return (
    <div className={cn("flex min-h-0", className)}>
      {/* 左侧导航 */}
      <nav className="w-[200px] shrink-0 border-r border-zinc-800/60 bg-[#111111] overflow-y-auto py-2">
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
                  ? "bg-sky-600/15 text-sky-400 border-l-2 border-sky-500"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border-l-2 border-transparent"
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
