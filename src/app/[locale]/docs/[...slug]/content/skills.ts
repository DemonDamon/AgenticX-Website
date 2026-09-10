export const skillsContent = {
  en: {
    title: 'Skills & Evolution',
    description: 'Skill lifecycle, security scan, and observation-driven self-evolution.',
    content: `# Skills & Evolution

Skills package procedures as \`SKILL.md\`. The runtime can register, scan, patch, version, and enable or disable them one by one.

## Lifecycle

- Dangerous-pattern security scan before a skill is usable
- Five-strategy fuzzy patch when updating existing files
- \`.changelog\` versioning and source tags
- Global disable list plus per-avatar overrides

## Self-evolution

The \`learning\` subsystem records tool-call observations in the current session, then reviews them in the background. A quality gate, usage stats, and deprecation close the loop.

This is not a promise that every session creates a skill. Creation still depends on enough signal, the quality gate, and the learning switch in config.

## Bundles

AGX Bundles can ship skills, MCP servers, avatars, and memory templates together. See [Extensions](/docs/guides/extensions) for install paths and marketplace search.
`,
  },
  zh: {
    title: '技能与自进化',
    description: '技能生命周期、安全扫描，以及观察驱动的自进化。',
    content: `# 技能与自进化

Skill 把流程写成 \`SKILL.md\`。运行时可以注册、扫描、patch、版本化，并按单个技能启停。

## 生命周期

- 可用前先做危险模式安全扫描
- 更新已有文件时走五策略模糊 patch
- \`.changelog\` 版本记录与来源标注
- 全局禁用列表，以及分身级覆盖

## 自进化

\`learning\` 子系统在当前会话记录工具调用观察，再在后台复盘。质量门禁、使用统计与淘汰构成闭环。

这不是“每轮对话都会自动建技能”。能否创建仍取决于信号是否足够、门禁是否通过，以及配置里的学习开关。

## Bundle

AGX Bundle 可以把 skills、MCP servers、avatars 与 memory templates 打成一包。安装路径与市场搜索见 [扩展与技能生态](/docs/guides/extensions)。
`,
  },
};
