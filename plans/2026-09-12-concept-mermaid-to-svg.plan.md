# Website 核心概念：Mermaid 换成主题化 SVG

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6

## Goal

把官网「核心概念」11 页开篇的 Mermaid 换成更细、更好看、并跟随站点浅/深色的 SVG 示意图。

## In scope

- 仅 11 个概念页：architecture / near / agent / tools / memory / orchestration / flow / llm-providers / hooks / skills / long-run
- `AgenticX-Website/public/docs/svg/` 中英各一套
- 渲染器：`/docs/svg/*.svg` **内联**（CSS 变量才能吃到主题）；图注规则与 `/docs/cases/` 相同
- 生成脚本 `AgenticX-Website/scripts/build-concept-svgs.mjs`（可复跑）

## Out of scope

- 指南 / API / FAQ / 简介等其它页的 Mermaid
- 改 slug、删实践案例图、重画正式架构 JPG
- 把 SVG 写成「官方截图」
- 主仓 `docs/` 回写

## Why not `<img src="*.svg">`

SVG 当 `<img>` 时页面 CSS 变量不生效。必须内联，才能用 `--background` / `--card` / `--border` / `--foreground` / `--muted` / `--muted-foreground`。硬编码 `#0a0a0a` 会在浅色主题变成一块黑砖。

## 图清单（每图 zh + en）

| 文件 stem | 替换哪张 Mermaid |
|-----------|------------------|
| `architecture-forms` | 三形态 → 核心 / 网关 / 上游 |
| `architecture-layers` | 五层 Runtime |
| `near-boot` | Near 启动链路 |
| `agent-loop` | think-act + 工具环 |
| `tools-dispatch` | `dispatch_tool_async` 三路 |
| `memory-recall` | MEMORY.md + messages → 系统提示 |
| `orchestration-branch` | fetch → analyze → publish/review |
| `flow-decorators` | `@start` / `@listen` / `@router` |
| `llm-config` | 设置 → yaml → provider → 上游 |
| `hooks-lifecycle` | before/after + 确认岔路 |
| `skills-lifecycle` | 扫描门禁 + 复盘门禁 |
| `longrun-cycle` | 隔离目录 + 停滞重试 |

## 精确落点

- 各概念页 `en.content` / `zh.content`：删除 \`\`\`mermaid\`\`\` 块，改为 `![...](/docs/svg/<stem>-<locale>.svg)` + `*示意图：...*` / `*Diagram: ...*`
- `markdown-renderer.tsx` `standaloneImg`：`src.startsWith('/docs/svg/')` 走 `DocsInlineSvg`，不要 `<img>`
- 新建 `src/components/docs/docs-inline-svg.tsx`

## Verification

1. `node scripts/build-concept-svgs.mjs` 产出 24 个文件
2. `pnpm ts-check`
3. 中英抽查 architecture / near / agent / skills；浅色与深色下图不是黑底砖块，图注不是裸 `*`
4. 只推 Website `main`

## Commit trailers

```
Plan-Id: 2026-09-12-concept-mermaid-to-svg
Plan-File: .cursor/plans/2026-09-12-concept-mermaid-to-svg.plan.md
Plan-Model: Cursor Grok 4.6
Impl-Model: Cursor Grok 4.6
Made-with: Damon Li
```
