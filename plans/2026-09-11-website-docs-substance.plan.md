# Website Framework Docs Substance

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6（正文需对照主仓真实 API；渲染器为中等前端接线）

## Goal

把官网 `/docs` 下框架文档从提纲级补成可读的产品文档：每页有「是什么 / 何时用 / 不是什么」、至少一张流程图、可跑或可核对的示例，中英对照，亮暗主题都好看。

## Root cause

上一轮 taste overhaul 只改营销页与 `/docs` 落地节奏。正文在 `AgenticX-Website/src/app/[locale]/docs/[...slug]/content/*.ts`。26 页里只有 4 页有图、0 页用 Mermaid。渲染器已能画 Mermaid，但不认 `!!! note`，且硬编码 `text-white` / `bg-zinc-800`，浅色主题下像未完成。部分示例与真实 API 不符（如 `AgentExecutor(agent=, llm=)`，真实签名是 `AgentExecutor(llm_provider=)` + `run(agent=, task=)`，见 `agenticx/core/agent_executor.py:185-249`）。

## In scope

- `AgenticX-Website/src/components/docs/markdown-renderer.tsx`
- `AgenticX-Website/src/components/docs/mermaid-block.tsx`
- `AgenticX-Website/src/app/[locale]/docs/[...slug]/content/*.ts`（`_types.ts` 除外）
- 不新增运行时依赖（`mermaid` 已在 Website）

## Out of scope

- `/auth`、`/agents`、privacy、terms
- Enterprise `content/enterprise/**` 整库重写
- 改 slug / 侧栏信息架构 / 搜索行为
- 新画大型 SVG；架构总图继续用 `public/diagrams/*-architecture-*.jpg`
- 主仓 `docs/` 不同步回写（官网单向对齐真实代码）

## Page template (every concept / guide)

1. 一句话定义 + 何时用 + 明确不是什么
2. 一张 ` ```mermaid ` 流程图（节点标签加引号，避免中文/符号解析失败）
3. 主路径步骤或分层说明，示例必须对照当前公开 API
4. 相关页内链（`/docs/...`，渲染器对站内链不要 `target=_blank`）
5. `!!! note|tip|warning|info` 写边界与坑
6. `en` / `zh` 同步，禁止只补一边

## Precise landing points

### Renderer

- `markdown-renderer.tsx` `MarkdownRenderer`：行循环在 header/list 之前识别 `^!!! (note|tip|warning|info)`，收集随后 4 空格缩进行；颜色改 `foreground` / `muted` / `card` / `border`；`Highlight` 随 `useSiteUiTheme().resolved` 选 `themes.nightOwl` / `themes.github`
- 站内链接：`href` 以 `/` 或 `#` 开头时不设 `target=_blank`
- `mermaid-block.tsx`：按 `resolved` 选 `dark` / `default`，主题变了重绘

### Content files (absolute under Website)

| File | Why thin / wrong | After |
|---|---|---|
| `content/near.ts` (50) | 只有列表 | 架构图 + 启动链路 Mermaid + 窗格/会话边界 |
| `content/skills.ts` (52) | 提纲 | 扫描→启停→learning 门禁流程图 |
| `content/long-run.ts` (38) | 提纲 | `longrun` 轮询与 `project_state` 状态机图 |
| `content/installation.ts` | 无图、系统依赖过时 | 安装路径图；文档解析写 LiteParse / LibreOffice，不写过时 antiword 当主路径 |
| `content/quickstart.ts` | Executor API 错 | 两条路径：SDK `AgentExecutor.run(agent, task)` 与 `agx serve` |
| `content/configuration.ts` | MkDocs `===` 页签渲染器不支持 | 改成普通章节；`~/.agenticx/config.yaml` + `AGX_MAX_TOOL_ROUNDS` |
| `content/index.ts` | 只有总图 | 读者路径图 + 三形态入口 |
| `content/architecture.ts` | 三张图无讲解流 | 保留正式图，补产品形态与五层 Runtime Mermaid |
| `content/orchestration.ts` / `flow.ts` | 代码块无图 | DAG / decorator 流程图 |
| `content/studio.ts` | 弱于主仓 `docs/guides/studio.md` | 对齐 serve / Session / SSE，带主仓已有 mermaid |
| `content/knowledge.ts` | 有 SVG 无流程 | 补文档脑/代码脑入库与检索图，主路径写 Studio KB 不是虚构 `KnowledgeBase()` |
| 其余已有较长正文的页 | 缺图或缺开篇 | 加开篇 + 至少一张 mermaid，不删已核对过的表格 |

## Suggested impl models

| Sub | Work | Model |
|---|---|---|
| SP1 | 渲染器 + Mermaid 主题 | Composer 档即可 |
| SP2–SP4 | 正文中英 + 图 | 需对照代码的中强档 |

## Verification

1. `pnpm ts-check` in `AgenticX-Website`
2. 本地打开 `/docs`、`/docs/concepts/architecture`、`/docs/getting-started/quickstart`、`/docs/concepts/near`、`/docs/guides/studio`、`/docs/guides/knowledge` 中英；确认 admonition 不是裸 `!!!`，Mermaid 出图
3. 浅色/深色各抽一页，代码块与提示块可读
4. 只推 Website `main`

## Commit trailers

```
Plan-Id: 2026-09-11-website-docs-substance
Plan-File: .cursor/plans/2026-09-11-website-docs-substance.plan.md
Plan-Model: Cursor Grok 4.6
Impl-Model: <actual>
Made-with: Damon Li
```
