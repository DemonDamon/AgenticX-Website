"use client";

import { useState } from "react";
import { useAgentsLocale } from "@/contexts/agents-locale-context";
import { useAgentsUiTheme } from "@/hooks/use-agents-ui-theme";

export function GeneralSettingsTab() {
  const { t, locale, setLocale } = useAgentsLocale();
  const { theme, setTheme } = useAgentsUiTheme();
  const [fontSize, setFontSize] = useState(14);
  const [proxy, setProxy] = useState("");

  return (
    <div className="px-8 py-6 space-y-8 max-w-2xl">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{t.settingsGeneralTitle}</h2>

      {/* 显示设置 */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.settingsGeneralDisplayTitle}</h3>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t.settingsGeneralLanguage}</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "zh" | "en")}
            className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100"
          >
            <option value="zh">{t.settingsGeneralLanguageZh}</option>
            <option value="en">{t.settingsGeneralLanguageEn}</option>
          </select>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t.settingsGeneralTheme}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "system" | "dark" | "light")}
            className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100"
          >
            <option value="system">{t.settingsGeneralThemeSystem}</option>
            <option value="dark">{t.settingsGeneralThemeDark}</option>
            <option value="light">{t.settingsGeneralThemeLight}</option>
          </select>
        </div>

        <div className="max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.settingsGeneralFontSize}</label>
            <span className="text-xs text-zinc-500 tabular-nums">{fontSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={20}
            step={1}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
      </div>

      {/* 网络 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.settingsGeneralNetworkTitle}</h3>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t.settingsGeneralNetworkProxy}</label>
          <input
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            placeholder="socks5://127.0.0.1:6153"
            className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* 数据 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.settingsGeneralDataTitle}</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            {t.settingsGeneralDataExport}
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80"
          >
            {t.settingsGeneralDataImport}
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80"
          >
            {t.settingsGeneralDataLog}
          </button>
        </div>
      </div>
    </div>
  );
}
