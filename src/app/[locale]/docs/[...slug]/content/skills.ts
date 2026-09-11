export const skillsContent = {
  en: {
    title: 'Skills & Evolution',
    description: 'SKILL.md lifecycle, security scan, per-skill switches, and observation-driven learning.',
    content: `# Skills & Evolution

A skill is a folder with \`SKILL.md\`. The runtime can list, scan, patch, version, and enable or disable **one skill at a time**. This is not “install a package and every listed CLI is called this turn.”

Use skills when you want a reusable procedure in the tool loop. Do not expect a skill to run just because the model mentioned \`mdfind\` in prose.

\`\`\`mermaid
flowchart TB
  scan["Scan skill roots"] --> guard["scan_skill / should_allow"]
  guard -->|pass| visible["Visible in session"]
  guard -->|fail| blocked["Blocked with a readable reason"]
  visible --> use["skill_use / progressive disclosure"]
  observe["tool_call observations"] --> review["session review"]
  review --> gate["quality gate"]
  gate -->|pass| create["optional new SKILL.md"]
  gate -->|fail| skip["no auto-create"]
\`\`\`

## Where skills are loaded

\`build_skill_search_paths()\` merges always-on roots with \`skills.preset_paths\` and \`skills.custom_paths\` in \`~/.agenticx/config.yaml\`. \`~/.agenticx/skills/\` is a core root (one extra directory level if the first level has no \`SKILL.md\`).

Each summary has a \`source\` (\`builtin\`, \`cursor\`, \`claude\`, \`registry\`, \`bundle\`, \`agent_created\`, …).

## Enable and disable

- **Global**: \`skills.disabled\` in config, mirrored by the Skills tab switches
- **Avatar**: \`skills_enabled\` on the avatar; default inherits global, only explicit offs are stored

\`GET/PUT /api/skills/settings\` is the Studio surface.

## Safety

\`agenticx/skills/guard.py\` scans for exfiltration, credential, injection, and destructive patterns. Failed scans must show a **readable** category or rule, not a generic “high risk”.

\`skill_manage\` (create / patch / delete) writes under \`~/.agenticx/skills/<name>/\`. It is gated by \`AGX_SKILL_MANAGE\` (default off). Names may contain a single safe subpath such as \`ima/notes\`.

Patches use a five-strategy fuzzy matcher. Each change appends \`<skill_dir>/.changelog\`.

## Self-evolution

\`agenticx/learning/\` records tool-call observations on the **current session** (\`tool_call_observations.json\`). A background review can propose a skill. Creation still needs:

- learning enabled (\`learning.enabled\` / \`AGX_LEARNING_ENABLED\`)
- enough tool-call signal
- quality gate (min steps, success evidence, dedup, guard scan, actionability)

This is not a promise that every chat invents a skill.

## Bundles

AGX Bundles can ship skills together with MCP servers, avatars, and memory templates. Install and marketplace search: [Extensions](/docs/guides/extensions).

## Related

- [Hooks](/docs/concepts/hooks) — dangerous shell can also be blocked at \`tool:before_call\`
- [Tools](/docs/concepts/tools) — \`skill_use\` / \`skill_list\` in \`STUDIO_TOOLS\`
`,
  },
  zh: {
    title: '技能与自进化',
    description: 'SKILL.md 生命周期、安全扫描、单技能开关，以及观察驱动的学习。',
    content: `# 技能与自进化

技能是带 \`SKILL.md\` 的目录。运行时可以按**单个技能**列表、扫描、patch、版本化和启停。不是「装了包，模型提到的每个 CLI 这一轮都会被调用」。

要把可复用流程放进工具循环时用技能。不要因为模型在正文里写了 \`mdfind\` 就认为技能已经跑过。

\`\`\`mermaid
flowchart TB
  scan["扫描技能根目录"] --> guard["scan_skill / should_allow"]
  guard -->|通过| visible["进入本会话可见集"]
  guard -->|失败| blocked["拦截并给出可读原因"]
  visible --> use["skill_use / 渐进披露"]
  observe["工具调用观察"] --> review["会话复盘"]
  review --> gate["质量门禁"]
  gate -->|通过| create["可选新建 SKILL.md"]
  gate -->|失败| skip["不自动创建"]
\`\`\`

## 从哪里加载

\`build_skill_search_paths()\` 合并始终扫描的根目录，以及 \`~/.agenticx/config.yaml\` 里的 \`skills.preset_paths\` / \`skills.custom_paths\`。\`~/.agenticx/skills/\` 是核心根（第一层没有 \`SKILL.md\` 时再向下扫一层）。

每条摘要带 \`source\`（\`builtin\`、\`cursor\`、\`claude\`、\`registry\`、\`bundle\`、\`agent_created\` 等）。

## 启停

- **全局**：配置里的 \`skills.disabled\`，对应 Skills 列表开关
- **分身**：\`skills_enabled\`；默认继承全局，只把显式关闭项写进去

Studio 面是 \`GET/PUT /api/skills/settings\`。

## 安全

\`agenticx/skills/guard.py\` 扫外传、凭据、注入、破坏四类模式。失败必须给出**可读**类别或规则，不能只写「高危」。

\`skill_manage\`（create / patch / delete）写到 \`~/.agenticx/skills/<name>/\`。默认关，靠 \`AGX_SKILL_MANAGE\` 打开。名称可以带一段安全子路径，例如 \`ima/notes\`。

Patch 走五策略模糊匹配。每次变更追加 \`<skill_dir>/.changelog\`。

## 自进化

\`agenticx/learning/\` 把工具调用观察记在**当前会话**（\`tool_call_observations.json\`）。后台复盘可以提议技能。真正创建仍要同时满足：

- 打开了学习（\`learning.enabled\` / \`AGX_LEARNING_ENABLED\`）
- 工具调用信号足够
- 质量门禁（步数、成功证据、去重、安全扫描、可执行性）

这不是「每轮对话都会长出新技能」。

## Bundle

AGX Bundle 可以把技能和 MCP、分身、记忆模板打成一包。安装与市场见 [扩展与技能生态](/docs/guides/extensions)。

## 相关页

- [Hooks](/docs/concepts/hooks) — 危险 shell 也可在 \`tool:before_call\` 拦截
- [工具](/docs/concepts/tools) — \`STUDIO_TOOLS\` 里的 \`skill_use\` / \`skill_list\`
`,
  },
};
