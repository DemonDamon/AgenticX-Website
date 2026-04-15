export type AgentsLocale = "zh" | "en";

export const AGENTS_LOCALE_STORAGE_KEY = "machi-agents-locale";

export type AgentsCopy = {
  userFallback: string;
  checkingAuth: string;
  collapseNav: string;
  expandNav: string;
  newChat: string;
  newSessionTitle: string;
  deepResearch: string;
  historySessions: string;
  noHistory: string;
  upgrade: string;
  menuSettings: string;
  /** 用户菜单 · 界面主题（与设置内「界面主题」一致） */
  menuInterfaceTheme: string;
  menuLanguage: string;
  menuFeedback: string;
  menuAbout: string;
  aboutOfficialHome: string;
  aboutUserAgreement: string;
  aboutPrivacyPolicy: string;
  langZh: string;
  langEn: string;
  backToChat: string;
  modelService: string;
  dialogFeedbackTitle: string;
  feedbackSubtitle: string;
  feedbackPlaceholder: string;
  feedbackImageHint: string;
  feedbackAddImageAria: string;
  feedbackCancel: string;
  feedbackSubmit: string;
  feedbackToastSuccess: string;
  dialogUpgradeTitle: string;
  dialogUpgradeBody: string;
  chatPlaceholder: string;
  chatPlaceholderDeep: string;
  attachAria: string;
  attachTooltipLine1: string;
  attachTooltipLine2: string;
  webOn: string;
  webOff: string;
  agentDeepResearch: string;
  closeDeepResearchTitle: string;
  models: Record<
    string,
    { label: string; desc: string }
  >;
  /** 设置 · 默认模型 */
  settingsDefaultsTitle: string;
  settingsDefaultChatModelLabel: string;
  settingsDefaultChatModelDesc: string;
  settingsNamingModelLabel: string;
  settingsNamingModelDesc: string;
  settingsSearchConstructModelLabel: string;
  settingsSearchConstructModelDesc: string;
  settingsModelOptionAuto: string;
  settingsModelOptionMinimax: string;
  settingsModelOptionDeepseek: string;
  settingsModelOptionGpt5: string;
  settingsModelOptionQwen: string;
  settingsModelOptionGlm: string;
  /** 设置 · 网络搜索 */
  settingsWebSearchTitle: string;
  settingsWebSearchProviderLabel: string;
  settingsWebSearchToolsCaption: string;
  settingsWebSearchToolWeb: string;
  settingsWebSearchToolReadPage: string;
  settingsWebSearchApiKey: string;
  settingsWebSearchApiPlaceholder: string;
  settingsWebSearchProviderMachi: string;
  settingsWebSearchProviderBocha: string;
  settingsWebSearchProviderTavily: string;
  settingsWebSearchProviderBing: string;
  settingsWebSearchFootnoteMachi: string;
  settingsWebSearchFootnoteThirdParty: string;
  /** 设置 · 文件解析 */
  settingsParserTitle: string;
  settingsParserTypeLabel: string;
  settingsParserOptionText: string;
  settingsParserOptionMachi: string;
  settingsParserHintText: string;
  settingsParserHintMachi: string;
  /** 设置 · 聊天 */
  settingsChatTitle: string;
  settingsChatNewDefaults: string;
  settingsChatPromptLabel: string;
  settingsChatDefaultPrompt: string;
  settingsChatResetDefault: string;
  settingsChatAvatarTitle: string;
  settingsChatAvatarDesc: string;
  settingsChatUserAvatar: string;
  settingsChatAssistantAvatar: string;
  settingsChatUploadImage: string;
  settingsChatContextLimitLabel: string;
  settingsChatNoLimit: string;
  settingsChatTempLabel: string;
  settingsChatNotSet: string;
  settingsChatTopPLabel: string;
  settingsChatBgImageLabel: string;
  settingsChatStreamingLabel: string;
  settingsChatSubTitle: string;
  settingsChatDisplayLabel: string;
  settingsChatDisplayClassic: string;
  settingsChatDisplayBubble: string;
  settingsChatShowAvatar: string;
  settingsChatShowWordCount: string;
  settingsChatShowTokenUsage: string;
  settingsChatShowModelName: string;
  settingsChatShowTimestamp: string;
  settingsChatShowTTFT: string;
  settingsChatFeaturesLabel: string;
  settingsChatAutoCollapse: string;
  settingsChatAutoTitle: string;
  settingsChatSpellCheck: string;
  settingsChatMarkdown: string;
  settingsChatLaTeX: string;
  settingsChatMermaid: string;
  settingsChatInjectMetadata: string;
  settingsChatInjectMetadataDesc: string;
  settingsChatAutoPreview: string;
  settingsChatAutoPreviewDesc: string;
  settingsChatPasteLongText: string;
  settingsChatPasteLongTextDesc: string;
  settingsChatContextMgmtTitle: string;
  settingsChatAutoCompress: string;
  settingsChatAutoCompressDesc: string;
  settingsChatCompressThreshold: string;
  settingsChatCompressCost: string;
  settingsChatCompressContext: string;
  settingsChatCompressDesc: string;
  /** 设置 · 模型服务（Provider 详情：API / 模型列表） */
  settingsModelServiceApiKey: string;
  settingsModelServiceCheck: string;
  settingsModelServiceApiHost: string;
  settingsModelServiceModelList: string;
  settingsModelServiceNew: string;
  settingsModelServiceReset: string;
  settingsModelServiceFetch: string;
  settingsModelServiceSearchPlaceholder: string;
  settingsModelServiceNoMatch: string;
  /** 模型能力标签（与上下文长度数字并列展示） */
  settingsModelTagChat: string;
  settingsModelTagVision: string;
  settingsModelTagReasoning: string;
  settingsModelTagFast: string;
  /** 设置 · 常规设置 */
  settingsGeneralTitle: string;
  settingsGeneralDisplayTitle: string;
  settingsGeneralLanguage: string;
  settingsGeneralLanguageZh: string;
  settingsGeneralLanguageEn: string;
  settingsGeneralTheme: string;
  settingsGeneralThemeSystem: string;
  settingsGeneralThemeDark: string;
  settingsGeneralThemeLight: string;
  settingsGeneralFontSize: string;
  settingsGeneralNetworkTitle: string;
  settingsGeneralNetworkProxy: string;
  settingsGeneralDataTitle: string;
  settingsGeneralDataExport: string;
  settingsGeneralDataImport: string;
  settingsGeneralDataLog: string;
  /** 模型服务供应商名称（需翻译的） */
  settingsModelProviderQwen: string;
  settingsModelProviderZhipu: string;
  settingsModelProviderVolcengine: string;
};

export const agentsLocaleCopy: Record<AgentsLocale, AgentsCopy> = {
  zh: {
    userFallback: "Machi 用户",
    checkingAuth: "校验登录状态…",
    collapseNav: "收起导航",
    expandNav: "展开导航",
    newChat: "新建会话",
    newSessionTitle: "新会话",
    deepResearch: "深度研究",
    historySessions: "历史会话",
    noHistory: "暂无历史，点击「新建会话」开始",
    upgrade: "升级",
    menuSettings: "设置",
    menuInterfaceTheme: "界面主题",
    menuLanguage: "语言切换",
    menuFeedback: "用户反馈",
    menuAbout: "关于我们",
    aboutOfficialHome: "官网首页",
    aboutUserAgreement: "用户协议",
    aboutPrivacyPolicy: "隐私协议",
    langZh: "中文",
    langEn: "English",
    backToChat: "← 返回",
    modelService: "模型服务",
    dialogFeedbackTitle: "用户反馈",
    feedbackSubtitle: "使用过程中遇到了什么问题？",
    feedbackPlaceholder: "欢迎说说你的想法与建议",
    feedbackImageHint: "你也可以上传或粘贴图片辅助说明。",
    feedbackAddImageAria: "添加截图",
    feedbackCancel: "取消",
    feedbackSubmit: "提交反馈",
    feedbackToastSuccess: "已收到反馈，感谢你的支持！",
    dialogUpgradeTitle: "升级",
    dialogUpgradeBody: "会员与用量方案即将开放，敬请期待。",
    chatPlaceholder: "发消息…",
    chatPlaceholderDeep: "描述你的问题，生成深度研究报告…",
    attachAria: "添加附件",
    attachTooltipLine1: "支持 PDF、Word、Excel、PPT、图片。",
    attachTooltipLine2: "最多 10 个文件（单个不超过 50MB）",
    webOn: "联网已开启",
    webOff: "联网搜索",
    agentDeepResearch: "Agent|深度研究",
    closeDeepResearchTitle: "关闭深度研究",
    models: {
      "minimax-m2.5": {
        label: "移动云 / minimax-m2.5",
        desc: "适用于大部分情况",
      },
      "deepseek-r1": {
        label: "DeepSeek R1",
        desc: "擅长解决更难的问题",
      },
      "qwen-max": {
        label: "通义千问 Max",
        desc: "研究级智能模型",
      },
    },
    settingsDefaultsTitle: "默认模型",
    settingsDefaultChatModelLabel: "默认聊天模型",
    settingsDefaultChatModelDesc: "新对话将默认使用此模型。",
    settingsNamingModelLabel: "会话命名模型",
    settingsNamingModelDesc: "自动为对话生成标题时使用的模型。",
    settingsSearchConstructModelLabel: "搜索词构造模型",
    settingsSearchConstructModelDesc: "自动构造联网搜索关键词时使用的模型。",
    settingsModelOptionAuto: "自动（沿用上次使用）",
    settingsModelOptionMinimax: "MiniMax M2.5",
    settingsModelOptionDeepseek: "DeepSeek R1",
    settingsModelOptionGpt5: "GPT-5",
    settingsModelOptionQwen: "Qwen Max",
    settingsModelOptionGlm: "GLM-5",
    settingsWebSearchTitle: "网络搜索",
    settingsWebSearchProviderLabel: "搜索服务",
    settingsWebSearchToolsCaption: "提供的工具",
    settingsWebSearchToolWeb: "网页搜索",
    settingsWebSearchToolReadPage: "阅读网页",
    settingsWebSearchApiKey: "API Key",
    settingsWebSearchApiPlaceholder: "填写 API Key…",
    settingsWebSearchProviderMachi: "Machi AI",
    settingsWebSearchProviderBocha: "博查",
    settingsWebSearchProviderTavily: "Tavily",
    settingsWebSearchProviderBing: "必应搜索（免费）",
    settingsWebSearchFootnoteMachi: "Machi 内置搜索引擎，无需额外配置。",
    settingsWebSearchFootnoteThirdParty: "切换到第三方搜索引擎需填入对应的 API Key。",
    settingsParserTitle: "文件解析",
    settingsParserTypeLabel: "解析器类型",
    settingsParserOptionText: "仅文本",
    settingsParserOptionMachi: "Machi 智能解析",
    settingsParserHintText:
      "仅支持纯文本文件（.txt、.md、.json、代码文件等）。如需解析 PDF 或 Office 文件，请切换到 Machi 智能解析。",
    settingsParserHintMachi: "Machi 智能解析支持 PDF、Word、Excel、PPT 等文档格式的智能提取与结构化。",
    settingsChatTitle: "对话设置",
    settingsChatNewDefaults: "新对话默认设置",
    settingsChatPromptLabel: "Prompt",
    settingsChatDefaultPrompt: "You are a helpful assistant.",
    settingsChatResetDefault: "重置为默认值",
    settingsChatAvatarTitle: "编辑头像",
    settingsChatAvatarDesc: "支持小于 5MB 的 jpg 或 png 文件",
    settingsChatUserAvatar: "用户头像",
    settingsChatAssistantAvatar: "默认助手头像",
    settingsChatUploadImage: "上传图片",
    settingsChatContextLimitLabel: "上下文的消息数量上限",
    settingsChatNoLimit: "不限制",
    settingsChatTempLabel: "温度",
    settingsChatNotSet: "未设置",
    settingsChatTopPLabel: "Top P",
    settingsChatBgImageLabel: "背景图片",
    settingsChatStreamingLabel: "流式输出",
    settingsChatSubTitle: "对话设置",
    settingsChatDisplayLabel: "显示",
    settingsChatDisplayClassic: "经典",
    settingsChatDisplayBubble: "气泡",
    settingsChatShowAvatar: "显示头像",
    settingsChatShowWordCount: "显示消息的字数统计",
    settingsChatShowTokenUsage: "显示消息的 token 消耗",
    settingsChatShowModelName: "显示模型名称",
    settingsChatShowTimestamp: "显示消息的时间戳",
    settingsChatShowTTFT: "显示首字耗时",
    settingsChatFeaturesLabel: "功能",
    settingsChatAutoCollapse: "自动收起代码块",
    settingsChatAutoTitle: "自动生成聊天标题",
    settingsChatSpellCheck: "拼写检查",
    settingsChatMarkdown: "Markdown 渲染",
    settingsChatLaTeX: "LaTeX 渲染（需要 Markdown）",
    settingsChatMermaid: "Mermaid 图表与图表渲染",
    settingsChatInjectMetadata: "注入默认元数据",
    settingsChatInjectMetadataDesc: "例如，模型名称、当前日期",
    settingsChatAutoPreview: "自动预览生成物 (Artifacts)",
    settingsChatAutoPreviewDesc: "自动渲染生成物（例如，带有 CSS、JS、Tailwind 的 HTML）",
    settingsChatPasteLongText: "粘贴长文本为文件",
    settingsChatPasteLongTextDesc: "粘贴长文本时将以文件形式插入，有助于保持聊天列表简洁，并减少在 prompt caching 可用时大幅减少 token 使用量。",
    settingsChatContextMgmtTitle: "上下文管理",
    settingsChatAutoCompress: "自动压缩",
    settingsChatAutoCompressDesc: "启用后，对话将自动总结，以管理上下文窗口的使用。",
    settingsChatCompressThreshold: "压缩阈值",
    settingsChatCompressCost: "成本",
    settingsChatCompressContext: "上下文",
    settingsChatCompressDesc: "均衡：在成本和上下文保留之间取得良好平衡",
    settingsModelServiceApiKey: "API 密钥",
    settingsModelServiceCheck: "校验",
    settingsModelServiceApiHost: "API 地址",
    settingsModelServiceModelList: "模型",
    settingsModelServiceNew: "+ 新建",
    settingsModelServiceReset: "重置",
    settingsModelServiceFetch: "拉取",
    settingsModelServiceSearchPlaceholder: "搜索模型…",
    settingsModelServiceNoMatch: "无匹配模型",
    settingsModelTagChat: "对话",
    settingsModelTagVision: "视觉",
    settingsModelTagReasoning: "推理",
    settingsModelTagFast: "快速",
    settingsGeneralTitle: "常规设置",
    settingsGeneralDisplayTitle: "显示设置",
    settingsGeneralLanguage: "语言",
    settingsGeneralLanguageZh: "简体中文",
    settingsGeneralLanguageEn: "English",
    settingsGeneralTheme: "界面主题",
    settingsGeneralThemeSystem: "跟随系统",
    settingsGeneralThemeDark: "深色",
    settingsGeneralThemeLight: "浅色",
    settingsGeneralFontSize: "字体大小",
    settingsGeneralNetworkTitle: "网络代理",
    settingsGeneralNetworkProxy: "代理地址",
    settingsGeneralDataTitle: "数据管理",
    settingsGeneralDataExport: "导出数据",
    settingsGeneralDataImport: "导入与恢复",
    settingsGeneralDataLog: "导出日志",
    settingsModelProviderQwen: "通义千问",
    settingsModelProviderZhipu: "智谱 GLM",
    settingsModelProviderVolcengine: "火山引擎",
  },
  en: {
    userFallback: "Machi user",
    checkingAuth: "Verifying sign-in…",
    collapseNav: "Collapse sidebar",
    expandNav: "Expand sidebar",
    newChat: "New chat",
    newSessionTitle: "New chat",
    deepResearch: "Deep research",
    historySessions: "History",
    noHistory: 'No history yet. Click "New chat" to start',
    upgrade: "Upgrade",
    menuSettings: "Settings",
    menuInterfaceTheme: "Interface theme",
    menuLanguage: "Language",
    menuFeedback: "Feedback",
    menuAbout: "About",
    aboutOfficialHome: "Website",
    aboutUserAgreement: "Terms of service",
    aboutPrivacyPolicy: "Privacy policy",
    langZh: "中文",
    langEn: "English",
    backToChat: "← Back",
    modelService: "Model service",
    dialogFeedbackTitle: "Feedback",
    feedbackSubtitle: "What issue did you run into?",
    feedbackPlaceholder: "Share your thoughts or suggestions",
    feedbackImageHint: "You can also attach or paste images to illustrate.",
    feedbackAddImageAria: "Add screenshot",
    feedbackCancel: "Cancel",
    feedbackSubmit: "Submit",
    feedbackToastSuccess: "Thanks — we’ve received your feedback!",
    dialogUpgradeTitle: "Upgrade",
    dialogUpgradeBody: "Membership and usage plans are coming soon.",
    chatPlaceholder: "Message…",
    chatPlaceholderDeep: "Describe your topic to generate a deep research report…",
    attachAria: "Add attachment",
    attachTooltipLine1: "Supports PDF, Word, Excel, PPT, and images.",
    attachTooltipLine2: "Up to 10 files (max 50MB each)",
    webOn: "Web search on",
    webOff: "Web search",
    agentDeepResearch: "Agent|Deep research",
    closeDeepResearchTitle: "Turn off deep research",
    models: {
      "minimax-m2.5": {
        label: "Mobile Cloud / minimax-m2.5",
        desc: "Good for most tasks",
      },
      "deepseek-r1": {
        label: "DeepSeek R1",
        desc: "Stronger on harder problems",
      },
      "qwen-max": {
        label: "Qwen Max",
        desc: "Research-grade model",
      },
    },
    settingsDefaultsTitle: "Default models",
    settingsDefaultChatModelLabel: "Default chat model",
    settingsDefaultChatModelDesc: "New conversations use this model by default.",
    settingsNamingModelLabel: "Session naming model",
    settingsNamingModelDesc: "Model used when auto-generating conversation titles.",
    settingsSearchConstructModelLabel: "Search query model",
    settingsSearchConstructModelDesc: "Model used to construct web search queries.",
    settingsModelOptionAuto: "Auto (use last used)",
    settingsModelOptionMinimax: "MiniMax M2.5",
    settingsModelOptionDeepseek: "DeepSeek R1",
    settingsModelOptionGpt5: "GPT-5",
    settingsModelOptionQwen: "Qwen Max",
    settingsModelOptionGlm: "GLM-5",
    settingsWebSearchTitle: "Web search",
    settingsWebSearchProviderLabel: "Search provider",
    settingsWebSearchToolsCaption: "Provided tools",
    settingsWebSearchToolWeb: "Web search",
    settingsWebSearchToolReadPage: "Read webpage",
    settingsWebSearchApiKey: "API Key",
    settingsWebSearchApiPlaceholder: "Enter API key…",
    settingsWebSearchProviderMachi: "Machi AI",
    settingsWebSearchProviderBocha: "BoCha",
    settingsWebSearchProviderTavily: "Tavily",
    settingsWebSearchProviderBing: "Bing Search (free)",
    settingsWebSearchFootnoteMachi: "Built-in Machi search — no extra setup.",
    settingsWebSearchFootnoteThirdParty: "Third-party search requires the matching API key.",
    settingsParserTitle: "Document parsing",
    settingsParserTypeLabel: "Parser type",
    settingsParserOptionText: "Text only",
    settingsParserOptionMachi: "Machi AI",
    settingsParserHintText:
      "Plain text only (.txt, .md, .json, code). For PDF or Office files, switch to Machi AI.",
    settingsParserHintMachi: "Machi AI parser extracts PDF, Word, Excel, PPT, and more.",
    settingsChatTitle: "Dialog settings",
    settingsChatNewDefaults: "New chat defaults",
    settingsChatPromptLabel: "Prompt",
    settingsChatDefaultPrompt: "You are a helpful assistant.",
    settingsChatResetDefault: "Reset to default",
    settingsChatAvatarTitle: "Edit avatar",
    settingsChatAvatarDesc: "Supports JPG or PNG under 5MB",
    settingsChatUserAvatar: "User avatar",
    settingsChatAssistantAvatar: "Default assistant avatar",
    settingsChatUploadImage: "Upload image",
    settingsChatContextLimitLabel: "Context message limit",
    settingsChatNoLimit: "No limit",
    settingsChatTempLabel: "Temperature",
    settingsChatNotSet: "Not set",
    settingsChatTopPLabel: "Top P",
    settingsChatBgImageLabel: "Background image",
    settingsChatStreamingLabel: "Streaming output",
    settingsChatSubTitle: "Dialog settings",
    settingsChatDisplayLabel: "Display",
    settingsChatDisplayClassic: "Classic",
    settingsChatDisplayBubble: "Bubble",
    settingsChatShowAvatar: "Show avatar",
    settingsChatShowWordCount: "Show message word count",
    settingsChatShowTokenUsage: "Show token usage",
    settingsChatShowModelName: "Show model name",
    settingsChatShowTimestamp: "Show timestamp",
    settingsChatShowTTFT: "Show time to first token",
    settingsChatFeaturesLabel: "Features",
    settingsChatAutoCollapse: "Auto-collapse code blocks",
    settingsChatAutoTitle: "Auto-generate chat titles",
    settingsChatSpellCheck: "Spell check",
    settingsChatMarkdown: "Markdown rendering",
    settingsChatLaTeX: "LaTeX rendering (requires Markdown)",
    settingsChatMermaid: "Mermaid charts rendering",
    settingsChatInjectMetadata: "Inject default metadata",
    settingsChatInjectMetadataDesc: "e.g., model name, current date",
    settingsChatAutoPreview: "Auto-preview Artifacts",
    settingsChatAutoPreviewDesc: "Auto-render artifacts (e.g., HTML with CSS, JS, Tailwind)",
    settingsChatPasteLongText: "Paste long text as file",
    settingsChatPasteLongTextDesc: "Pastes long text as a file to keep chat list clean and significantly reduce token usage when prompt caching is available.",
    settingsChatContextMgmtTitle: "Context management",
    settingsChatAutoCompress: "Auto-compress",
    settingsChatAutoCompressDesc: "When enabled, conversations are summarized to manage context window usage.",
    settingsChatCompressThreshold: "Compression threshold",
    settingsChatCompressCost: "Cost",
    settingsChatCompressContext: "Context",
    settingsChatCompressDesc: "Balanced: a good tradeoff between cost and context retention.",
    settingsModelServiceApiKey: "API Key",
    settingsModelServiceCheck: "Check",
    settingsModelServiceApiHost: "API Host",
    settingsModelServiceModelList: "Model",
    settingsModelServiceNew: "+ New",
    settingsModelServiceReset: "Reset",
    settingsModelServiceFetch: "Fetch",
    settingsModelServiceSearchPlaceholder: "Search models…",
    settingsModelServiceNoMatch: "No matching models",
    settingsModelTagChat: "Chat",
    settingsModelTagVision: "Vision",
    settingsModelTagReasoning: "Reasoning",
    settingsModelTagFast: "Fast",
    settingsGeneralTitle: "General settings",
    settingsGeneralDisplayTitle: "Display settings",
    settingsGeneralLanguage: "Language",
    settingsGeneralLanguageZh: "简体中文",
    settingsGeneralLanguageEn: "English",
    settingsGeneralTheme: "Theme",
    settingsGeneralThemeSystem: "System",
    settingsGeneralThemeDark: "Dark",
    settingsGeneralThemeLight: "Light",
    settingsGeneralFontSize: "Font size",
    settingsGeneralNetworkTitle: "Network proxy",
    settingsGeneralNetworkProxy: "Proxy address",
    settingsGeneralDataTitle: "Data management",
    settingsGeneralDataExport: "Export data",
    settingsGeneralDataImport: "Import & Restore",
    settingsGeneralDataLog: "Export logs",
    settingsModelProviderQwen: "Qwen",
    settingsModelProviderZhipu: "Zhipu GLM",
    settingsModelProviderVolcengine: "Volcengine",
  },
};

export function readAgentsLocale(): AgentsLocale {
  if (typeof window === "undefined") return "zh";
  try {
    const v = window.localStorage.getItem(AGENTS_LOCALE_STORAGE_KEY);
    return v === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}
