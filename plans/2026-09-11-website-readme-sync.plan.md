# Website README / Conclusion Sync

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6

目标：把 AgenticX README 与 `conclusions/` 已更新的产品叙事同步到 `AgenticX-Website`，用双语 SVG 图文并茂，再推 Vercel 生产。

## Design read

Reading this as: redesign-preserve of the existing dark developer marketing + docs site, with a monochrome language, leaning toward README-accurate product copy plus bilingual SVG diagrams.

Dials: VARIANCE 5 / MOTION 4 / DENSITY 4

## SVG 落点

`AgenticX-Website/public/diagrams/`

| 文件 | 用途 |
|---|---|
| `product-stack.svg` | Core / Near / Enterprise 三形态 |
| `runtime-path.svg` | Near / SDK → Studio → Agent Runtime |
| `enterprise-path.svg` | Portal / Admin → BFF → Go Gateway |
| `knowledge-brains.svg` | 文档脑 + 代码脑 |

## In scope

- 首页、企业页、框架文档简介 / 架构 / 更新日志 / 路线图 / 知识库
- 新增文档页：Near、Skills、Long-run
- 页脚许可证改为 Apache-2.0（与仓库 LICENSE / README 一致）
- Enterprise 文案里 Machi Desktop → Near；网关边界写清楚

## Out of scope

- `/auth`、`/agents`、隐私协议页
- Enterprise 文档 markdown 全量重写
- 改路由 slug、i18n 既有 key 语义（只追加 key）
- Desktop / Enterprise 产品壳

## 验收

- `/` 能看到产品栈 SVG 与三形态说明
- `/enterprise` 用 SVG 替换 ASCII 框，不再写 Machi Desktop
- `/docs`、`/docs/concepts/architecture` 图能显示且不再引用缺失的 `/docs/assets/architecture.png`
- `pnpm ts-check` 或生产 build 通过后 push `main`
