"use client";

import { useState } from "react";
import { Info, User, Bot, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAgentsLocale } from "@/contexts/agents-locale-context";
import { agentsLocaleCopy, readAgentsLocale } from "@/lib/agents-locale-copy";

function SwitchRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string | React.ReactNode;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <div className="text-sm text-zinc-700 dark:text-zinc-200">{label}</div>
        {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-sky-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-zinc-700 shrink-0"
      />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  valueLabel,
}: {
  label: string | React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  valueLabel: string;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="min-w-[150px] text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">{label}</div>
      <div className="flex-1 flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-sky-500"
        />
        <div className="w-[60px] text-right shrink-0">
          <span className="text-xs text-zinc-500 bg-gray-100 border border-zinc-200 px-2 py-1 rounded-md dark:bg-zinc-800/80 dark:border-zinc-700/80 dark:text-zinc-400">{valueLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function ChatSettingsTab() {
  const { t } = useAgentsLocale();
  const [systemPrompt, setSystemPrompt] = useState(() => {
    if (typeof window === "undefined") return agentsLocaleCopy.zh.settingsChatDefaultPrompt;
    return agentsLocaleCopy[readAgentsLocale()].settingsChatDefaultPrompt;
  });

  const [contextLimit, setContextLimit] = useState(0);
  const [temperature, setTemperature] = useState(-0.1);
  const [topP, setTopP] = useState(-0.1);
  const [streaming, setStreaming] = useState(true);

  const [displayMode, setDisplayMode] = useState<"classic" | "bubble">("classic");
  const [showAvatar, setShowAvatar] = useState(true);
  const [showWordCount, setShowWordCount] = useState(false);
  const [showTokens, setShowTokens] = useState(true);
  const [showModelName, setShowModelName] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showTTFT, setShowTTFT] = useState(false);

  const [autoCollapse, setAutoCollapse] = useState(true);
  const [autoTitle, setAutoTitle] = useState(true);
  const [spellCheck, setSpellCheck] = useState(true);
  const [markdownRender, setMarkdownRender] = useState(true);
  const [latexRender, setLatexRender] = useState(true);
  const [mermaidRender, setMermaidRender] = useState(true);
  const [injectMetadata, setInjectMetadata] = useState(true);
  const [autoPreview, setAutoPreview] = useState(false);
  const [pasteLongText, setPasteLongText] = useState(true);

  const [autoCompress, setAutoCompress] = useState(true);
  const [compressThreshold, setCompressThreshold] = useState(50);

  return (
    <div className="px-8 py-6 space-y-10 max-w-3xl">
      
      {/* 1. 编辑头像 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">{t.settingsChatAvatarTitle}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{t.settingsChatAvatarDesc}</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">{t.settingsChatUserAvatar}</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-500 dark:text-zinc-200">
                <User className="size-8" />
              </div>
              <button type="button" className="h-9 px-4 rounded-md border border-sky-200 bg-sky-50 text-sm font-medium text-sky-600 hover:bg-sky-100 transition-colors dark:border-sky-600/40 dark:bg-sky-600/10 dark:text-sky-500 dark:hover:bg-sky-600/20">
                {t.settingsChatUploadImage}
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">{t.settingsChatAssistantAvatar}</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                <Bot className="size-8" />
              </div>
              <button type="button" className="h-9 px-4 rounded-md border border-sky-200 bg-sky-50 text-sm font-medium text-sky-600 hover:bg-sky-100 transition-colors dark:border-sky-600/40 dark:bg-sky-600/10 dark:text-sky-500 dark:hover:bg-sky-600/20">
                {t.settingsChatUploadImage}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 新对话默认设置 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{t.settingsChatNewDefaults}</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t.settingsChatPromptLabel}</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
          <button
            type="button"
            className="mt-1 text-xs text-zinc-500 hover:text-zinc-700 underline underline-offset-2 dark:hover:text-zinc-300"
            onClick={() => setSystemPrompt(t.settingsChatDefaultPrompt)}
          >
            {t.settingsChatResetDefault}
          </button>
        </div>

        <div className="space-y-1 mb-6">
          <SliderRow
            label={
              <>
                {t.settingsChatContextLimitLabel}
                <Info className="size-3.5 text-zinc-500" />
              </>
            }
            min={0}
            max={40}
            step={2}
            value={contextLimit}
            onChange={setContextLimit}
            valueLabel={contextLimit === 0 ? t.settingsChatNoLimit : String(contextLimit)}
          />
          <SliderRow
            label={
              <>
                {t.settingsChatTempLabel}
                <Info className="size-3.5 text-zinc-500" />
              </>
            }
            min={-0.1}
            max={2}
            step={0.1}
            value={temperature}
            onChange={setTemperature}
            valueLabel={temperature < 0 ? t.settingsChatNotSet : temperature.toFixed(1)}
          />
          <SliderRow
            label={
              <>
                {t.settingsChatTopPLabel}
                <Info className="size-3.5 text-zinc-500" />
              </>
            }
            min={-0.1}
            max={1}
            step={0.05}
            value={topP}
            onChange={setTopP}
            valueLabel={topP < 0 ? t.settingsChatNotSet : topP.toFixed(2)}
          />
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.settingsChatBgImageLabel}</h3>
          <button type="button" className="h-8 px-3 rounded-md border border-sky-200 bg-sky-50 text-xs font-medium text-sky-600 hover:bg-sky-100 transition-colors dark:border-sky-600/40 dark:bg-sky-600/10 dark:text-sky-500 dark:hover:bg-sky-600/20">
            {t.settingsChatUploadImage}
          </button>
        </div>

        <div className="divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800/60 dark:border-zinc-800/60">
          <SwitchRow label={t.settingsChatStreamingLabel} checked={streaming} onChange={setStreaming} />
        </div>
      </section>

      {/* 3. 对话设置 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{t.settingsChatSubTitle}</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">{t.settingsChatDisplayLabel}</h3>
          
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setDisplayMode("classic")}
              className={cn(
                "flex flex-col items-center gap-2",
              )}
            >
              <div className={cn(
                "w-44 h-28 rounded-lg border-2 bg-gray-50 p-3 flex flex-col gap-2 transition-colors dark:bg-[#1c1c1e]",
                displayMode === "classic" ? "border-sky-500" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              )}>
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-sky-500" />
                  <div className="h-3 w-16 rounded-full bg-zinc-500" />
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-600 ml-8" />
                <div className="h-2 w-2/3 rounded-full bg-zinc-600 ml-8" />
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="size-6 rounded-full bg-sky-500" />
                  <div className="h-3 w-16 rounded-full bg-zinc-500" />
                </div>
              </div>
              <span className={cn("text-xs flex items-center gap-1.5", displayMode === "classic" ? "text-sky-500" : "text-zinc-400")}>
                <span className={cn("flex items-center justify-center size-4 rounded-full border", displayMode === "classic" ? "border-sky-500 bg-sky-500 text-white" : "border-zinc-500")}>
                  {displayMode === "classic" && <Check className="size-3" strokeWidth={3} />}
                </span>
                {t.settingsChatDisplayClassic}
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setDisplayMode("bubble")}
              className={cn(
                "flex flex-col items-center gap-2",
              )}
            >
              <div className={cn(
                "w-44 h-28 rounded-lg border-2 bg-gray-50 p-4 flex flex-col justify-center gap-3 transition-colors dark:bg-[#1c1c1e]",
                displayMode === "bubble" ? "border-sky-500" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              )}>
                <div className="h-5 w-24 rounded-full bg-sky-500 self-end" />
                <div className="h-5 w-28 rounded-full bg-zinc-200 dark:bg-zinc-600 self-start" />
                <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-600 self-start" />
              </div>
              <span className={cn("text-xs flex items-center gap-1.5", displayMode === "bubble" ? "text-sky-500" : "text-zinc-500 dark:text-zinc-400")}>
                <span className={cn("flex items-center justify-center size-4 rounded-full border", displayMode === "bubble" ? "border-sky-500 bg-sky-500 text-white" : "border-zinc-300 dark:border-zinc-500")}>
                  {displayMode === "bubble" && <Check className="size-3" strokeWidth={3} />}
                </span>
                {t.settingsChatDisplayBubble}
              </span>
            </button>
          </div>

          <div className="divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800/60 dark:border-zinc-800/60">
            <SwitchRow label={t.settingsChatShowAvatar} checked={showAvatar} onChange={setShowAvatar} />
            <SwitchRow label={t.settingsChatShowWordCount} checked={showWordCount} onChange={setShowWordCount} />
            <SwitchRow label={t.settingsChatShowTokenUsage} checked={showTokens} onChange={setShowTokens} />
            <SwitchRow label={t.settingsChatShowModelName} checked={showModelName} onChange={setShowModelName} />
            <SwitchRow label={t.settingsChatShowTimestamp} checked={showTimestamp} onChange={setShowTimestamp} />
            <SwitchRow label={t.settingsChatShowTTFT} checked={showTTFT} onChange={setShowTTFT} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t.settingsChatFeaturesLabel}</h3>
          <div className="divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800/60 dark:border-zinc-800/60">
            <SwitchRow label={t.settingsChatAutoCollapse} checked={autoCollapse} onChange={setAutoCollapse} />
            <SwitchRow label={t.settingsChatAutoTitle} checked={autoTitle} onChange={setAutoTitle} />
            <SwitchRow label={t.settingsChatSpellCheck} checked={spellCheck} onChange={setSpellCheck} />
            <SwitchRow label={t.settingsChatMarkdown} checked={markdownRender} onChange={setMarkdownRender} />
            <SwitchRow label={t.settingsChatLaTeX} checked={latexRender} onChange={setLatexRender} />
            <SwitchRow label={t.settingsChatMermaid} checked={mermaidRender} onChange={setMermaidRender} />
            <SwitchRow label={t.settingsChatInjectMetadata} desc={t.settingsChatInjectMetadataDesc} checked={injectMetadata} onChange={setInjectMetadata} />
            <SwitchRow label={t.settingsChatAutoPreview} desc={t.settingsChatAutoPreviewDesc} checked={autoPreview} onChange={setAutoPreview} />
            <SwitchRow label={t.settingsChatPasteLongText} desc={t.settingsChatPasteLongTextDesc} checked={pasteLongText} onChange={setPasteLongText} />
          </div>
        </div>
      </section>

      {/* 4. 上下文管理 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{t.settingsChatContextMgmtTitle}</h2>
        <div className="divide-y divide-zinc-200 border-t border-zinc-200 border-b mb-4 dark:divide-zinc-800/60 dark:border-zinc-800/60">
          <SwitchRow 
            label={
              <span className="flex items-center gap-1.5">
                {t.settingsChatAutoCompress}
                <Info className="size-3.5 text-zinc-500" />
              </span>
            } 
            desc={t.settingsChatAutoCompressDesc}
            checked={autoCompress} 
            onChange={setAutoCompress} 
          />
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-sm font-medium text-zinc-300">{t.settingsChatCompressThreshold}</label>
            <Info className="size-3.5 text-zinc-500" />
          </div>
          <div className="px-2">
            <input
              type="range"
              min={0}
              max={100}
              value={compressThreshold}
              onChange={(e) => setCompressThreshold(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
              <span>{t.settingsChatCompressCost}</span>
              <span>{t.settingsChatCompressContext}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-3">{t.settingsChatCompressDesc}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
