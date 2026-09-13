# Website 核心概念：实践案例与界面示意

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6

## Goal

把官网 `/docs`「核心概念」11 页从提纲补成可跟着做的说明：每页加实践案例（场景 / 步骤 / 你会看到什么 / 落盘或 API），并配界面示意或效果图。正文比上一轮更细，但不改 slug、不重写指南整库。

## In scope

- `AgenticX-Website/src/app/[locale]/docs/[...slug]/content/` 下 11 个概念页（architecture / near / agent / tools / memory / orchestration / flow / llm-providers / hooks / skills / long-run）
- `AgenticX-Website/public/docs/cases/` 新增界面示意图
- `markdown-renderer.tsx`：`/docs/cases/` 图片按文档图全宽展示，紧随的 `*图：...*` 收成图注

## Out of scope

- 指南 / API / FAQ 整库加案例（除非概念页必须内链）
- 把 AI 示意写成「产品截图」
- 改侧栏信息架构、Enterprise 文档
- 主仓 `docs/` 回写

## 每页模板（中英同步）

在现有开篇与 mermaid **之后**加：

1. 更细的主路径说明（Near 怎么操作 vs SDK 何时用），不删已核对表格
2. `## 实践案例` / `## Worked example`
   - 场景（一句话真实任务）
   - 步骤（可执行，对照真实 API / UI）
   - 你会看到什么（窗格、工具卡、设置状态点等）
   - 落盘或接口（`~/.agenticx/...` 或具体函数）
3. 一张界面示意：`![...](/docs/cases/<slug>.png)` + `*图：...*`
   - 文案必须写「界面示意」，禁止「官方截图」

## 案例选题（必须真实能力）

| 页 | 案例 | 图 |
|---|---|---|
| architecture | 同一问法走 SDK / Near / Enterprise 三条路径 | 已有正式架构 JPG，可不再新画 |
| near | 双窗格：Meta + @分身；工作区 `@file` | `near-panes.png` |
| agent | Near 里一轮：Thinking → 工具卡 → 最终回复 | `agent-loop.png` |
| tools | 调用 `file_read` / MCP，工具卡默认折叠 | `tools-card.png` |
| memory | 写 `MEMORY.md`，下一轮系统提示召回 | `memory-workspace.png` |
| orchestration | 群聊 @ 成员 vs Meta 兜底（不是假 TeamManager 构造） | `group-route.png` |
| flow | `@start` / `@listen` 小流水线 | mermaid 加细即可，可选 `flow-pipeline.png` |
| llm-providers | 设置里配密钥/自定义 Base，红绿状态点 | `llm-settings.png` |
| hooks | 危险 shell → `tool:before_call` 确认 | `hooks-confirm.png` |
| skills | Skills Tab 单技能开关 + `skill_use` | `skills-tab.png` |
| long-run | 长任务隔离目录 + `project_state` | `longrun-state.png` |

## 精确落点

- 概念页：各文件 `en.content` / `zh.content` 在 Related 节之前插入案例块
- 渲染器 `standaloneImg`：`src.startsWith('/docs/cases/')` 与 `/diagrams/` 一样全宽；若下一行是 `*...*` / `*图：*`，收成 `<figcaption>`
- 图文件：`AgenticX-Website/public/docs/cases/*.png`

## Verification

1. `pnpm ts-check`（Website）
2. 本地打开每个核心概念页中英：案例节可见、图加载、图注不是裸 `*`
3. 浅色/深色各抽 Near + 工具
4. 只推 Website `main`

## Commit trailers

```
Plan-Id: 2026-09-11-docs-concept-cases
Plan-File: .cursor/plans/2026-09-11-docs-concept-cases.plan.md
Plan-Model: Cursor Grok 4.6
Impl-Model: Cursor Grok 4.6
Made-with: Damon Li
```
