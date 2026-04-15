"use client";

import { useState } from "react";
import { useAgentsLocale } from "@/contexts/agents-locale-context";

export function GeneralSettingsTab() {
  const { locale, setLocale } = useAgentsLocale();
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState(14);
  const [proxy, setProxy] = useState("");

  return (
    <div className="px-8 py-6 space-y-8 max-w-2xl">
      <h2 className="text-xl font-semibold text-white">常规设置</h2>

      {/* 显示设置 */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">显示设置</h3>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">语言</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "zh" | "en")}
            className="w-full h-10 rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 text-sm text-zinc-100 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
          >
            <option value="zh">简体中文</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">主题</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full h-10 rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 text-sm text-zinc-100 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
          >
            <option value="system">跟随系统</option>
            <option value="dark">深色</option>
            <option value="light">浅色</option>
          </select>
        </div>

        <div className="max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-zinc-300">字体大小</label>
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
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">网络代理</h3>
        <div className="max-w-md">
          <input
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            placeholder="socks5://127.0.0.1:6153"
            className="w-full h-10 rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {/* 数据 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">数据管理</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            导出数据
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700/80 transition-colors"
          >
            导入与恢复
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700/80 transition-colors"
          >
            导出日志
          </button>
        </div>
      </div>
    </div>
  );
}
