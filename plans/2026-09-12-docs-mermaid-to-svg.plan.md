# Website 剩余文档：Mermaid 换成主题化 SVG

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6

## Goal

把官网文档里**还没换**的开篇 Mermaid 全部换成与核心概念页同一套管线的主题化 SVG；并让 `/docs/guides`、`/docs/api` 不再落到「即将推出」。

## In scope

- 15 个仍含 Mermaid 的内容文件（中英各 1 张图 = 30 个 SVG）
- 复用 `AgenticX-Website/scripts/build-concept-svgs.mjs` 原语 + `DocsInlineSvg`
- 新增 slug `guides`、`api` 目录页（子页链接 + 一张总览 SVG），避免 [guides](https://www.agxbuilder.com/docs/guides) / [api](https://www.agxbuilder.com/docs/api/) 空壳
- `generateStaticParams` 纳入这两个 slug

## Out of scope

- 重画已换过的 11 个概念页 SVG
- 新写 `api/llms` / `api/tools` / `api/memory` / `api/flow` 完整 API 正文（侧栏这四项仍可指向概念页说明）
- 主仓 `docs/` 回写、删实践案例 PNG / 正式架构 JPG
- 把 SVG 写成「官方截图」

## 图清单（stem = `/docs/svg/<stem>-<zh|en>.svg?v=2`）

| stem | 文件 | 替换的 Mermaid |
|------|------|----------------|
| `intro-path` | `index.ts` | You → Near/SDK → Studio → Runtime → tools/llm/memory |
| `install-paths` | `installation.ts` | pip → CLI/SDK → serve/Near 或 Python app |
| `quickstart-paths` | `quickstart.ts` | SDK `AgentExecutor.run` vs Studio SSE |
| `config-yaml` | `configuration.ts` | `config.yaml` + env → serve / runtime / providers / skills |
| `first-agent-loop` | `first-agent.ts` | Topic → Task → run ⇄ tools → report |
| `multi-agent-route` | `multi-agent.ts` | Meta → @ / delegate / spawn → 回复 |
| `studio-sse` | `studio.ts` | Near ↔ Electron ↔ FastAPI ↔ Runtime SSE |
| `knowledge-ingest` | `knowledge.ts` | LiteParse → chunk → embed → Chroma；旁路 `code_search` |
| `extensions-bundle` | `extensions.ts` | scan → guard → skill_use / active_skill；Bundle / MCP |
| `deploy-serve` | `deployment.ts` | 客户端 → `agx serve` → `~/.agenticx` |
| `api-executor` | `api-agents.ts` | `AgentExecutor(llm_provider=).run(agent=, task=)` |
| `cli-commands` | `cli.ts` | `serve` / `studio` / `feishu` |
| `faq-doors` | `faq.ts` | 一问三门：SDK / Near / Enterprise |
| `changelog-arc` | `changelog.ts` | M1–M11 → Near/Studio → v0.5 → 规划 |
| `roadmap-next` | `roadmap.ts` | 已落地 → M12 / M18 / cluster |
| `guides-map` | 新 `guides.ts` | 六篇指南怎么选 |
| `api-map` | 新 `api.ts` | SDK Agents 页 vs 概念页 |

## 精确落点

- `AgenticX-Website/scripts/build-concept-svgs.mjs`：在现有 `copy` 上追加上表 stem，**禁止**改已有 12 个概念 stem 的布局语义（可复跑整表）
- 各内容文件 `en.content` / `zh.content`：删除字面量 `` \`\`\`mermaid `` 块，改为

```
![...](/docs/svg/<stem>-en.svg?v=2)

*Diagram: ...*
```

中文用 `*示意图：...*`。落点即各文件里**第一处** mermaid（en）与**第二处**（zh），不要误伤正文里的 Python/bash 围栏。

- 新建 `AgenticX-Website/src/app/[locale]/docs/[...slug]/content/guides.ts`、`api.ts`
- `page.tsx` `docsMap` 增加 `'guides'`、`'api'`
- `generateStaticParams` 额外输出 `{ slug: ['guides'] }`、`{ slug: ['api'] }`
- `navigation.ts`：Guides / API Reference 两节加可选 `slug`；`sidebar.tsx` 的分区标题若有 `slug` 则链到该目录页（chevron 仍只负责折叠）

## 渲染器

已有 `DocsInlineSvg` + `standaloneImg` 的 `/docs/svg/` 分支，**不要重写**。新图走同一路径。

## Verification

1. `node scripts/build-concept-svgs.mjs`：原 24 + 新 34（15×2 + guides/api 各 2）= **58** 个文件
2. 15 个旧文件 + 2 个新文件里不再出现 `` \`\`\`mermaid ``
3. `pnpm ts-check`
4. 本地抽查 `/docs/guides`、`/docs/api`、`/docs/cli`、`/docs/guides/first-agent`、`/docs/getting-started/quickstart`：浅/深色内联 SVG + figcaption
5. 只推 Website `main`

## Commit trailers

```
Plan-Id: 2026-09-12-docs-mermaid-to-svg
Plan-File: .cursor/plans/2026-09-12-docs-mermaid-to-svg.plan.md
Plan-Model: Cursor Grok 4.6
Impl-Model: Cursor Grok 4.6
Made-with: Damon Li
```
