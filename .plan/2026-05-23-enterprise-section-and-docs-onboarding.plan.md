# AgenticX Website：新增 Enterprise 板块并上线全量 53 篇文档

> 落盘位置：`AgenticX-Website/.plan/2026-05-23-enterprise-section-and-docs-onboarding.plan.md`（与现有 `2026-03-25-docs-search-and-security-banner.plan.md` 同级，按本仓约定 `.plan/` 为权威副本；若需 Cursor 项目级追踪，可再链一份到主仓 `.cursor/plans/`）

---

## 1. 目标（What & Why）

### What
在 [`www.agxbuilder.com`](https://www.agxbuilder.com/) 首页导航 **Features** 旁新增 **Enterprise** 入口，落地一个企业版产品介绍页与完整文档中心，**一次性上线** 主仓 `enterprise/docs/` 下全部 **53 篇** Markdown 文档（包含 architecture / gateway / api / runbooks / deployment / rbac / observability / adr / sales 等所有目录）。

### Why
- 当前官网只展示 AgenticX 开源框架，企业版（web-portal + admin-console + AI Gateway）没有任何对外露出，客户/合作方无入口了解能力边界与接入方式。
- 主仓 `enterprise/docs/` 已沉淀完整文档树（架构、API、网关、RBAC、部署、Runbook、ADR），是面向客户与运维的权威材料，值得对外。
- 同站集成（同一 Vercel 项目、同一域名）成本最低、品牌统一；不需要新建独立 Vercel 项目。

### 非目标（明确不做）
- 不重构现有 `/docs` 开源框架文档（继续用 `src/app/docs/[...slug]/content/*.ts` 内联方案）。
- 不在本期接入 Enterprise 真实 Demo（portal:3000 / admin:3001 / gateway:8088）。
- 不引入 Nextra / Docusaurus；继续在现有 Next.js 16 App Router 内扩展。
- 不重写 `MarkdownRenderer`；如发现缺失语法（mermaid、frontmatter 等）按"已知差异"列出，不在本期补齐。
- 不在 Vercel 新建项目，不动域名绑定。

---

## 2. Requirements

### FR（功能需求）
- **FR-1 导航入口**：首页 `src/app/page.tsx` 导航栏（桌面 + 移动菜单）在 `Features` 与 `Examples` 之间插入 `Enterprise` 链接，指向 `/enterprise`。
- **FR-2 Enterprise Landing**：新增 `/enterprise` 路由，呈现：
  - 三端能力卡片（Web Portal / Admin Console / AI Gateway）
  - 一句话价值主张（来自 `enterprise/docs/architecture/overview.md` §1）
  - 架构示意（复用 overview.md 的 mermaid 描述文字版或静态图，本期不渲染 mermaid）
  - CTA：`查看文档 → /enterprise/docs`、`GitHub → 主仓`
- **FR-3 文档路由**：新增 `/enterprise/docs/[...slug]` 与 `/enterprise/docs`（index），覆盖 `enterprise/docs/` 下 53 个 md 文件全部 slug。
- **FR-4 静态生成**：使用 `generateStaticParams` 在 build 时把所有 enterprise 文档预渲染为静态页（Vercel 部署后零运行时 I/O）。
- **FR-5 文档同步**：通过 build 前 `scripts/sync-enterprise-docs.sh` 把主仓 `enterprise/docs/` 拷贝/同步到 `AgenticX-Website/content/enterprise/`；同步源支持两种模式：
  - 本地开发：相对路径 `../AgenticX/enterprise/docs/`（环境变量 `ENTERPRISE_DOCS_SRC` 可覆盖）
  - CI / Vercel：从主仓 GitHub raw / git submodule / 预先 commit 的 `content/enterprise/` 三选一（**本期方案：仓内 commit `content/enterprise/`**，最稳，无需 build 环境联网）。
- **FR-6 文档侧栏**：为 Enterprise 文档新增独立 `EnterpriseDocSidebar`，结构由 `src/components/enterprise-docs/navigation.ts` 维护（基于 `enterprise/docs/README.md` 的章节划分）。
- **FR-7 文档搜索**：复用现有 `cmdk` 模式，新增 `EnterpriseDocSearchCommand`，数据源为 enterprise 导航树，⌘K / Ctrl+K 在 enterprise 文档区生效。
- **FR-8 Markdown 渲染**：复用 `MarkdownRenderer`；首屏验证标题、代码块、列表、表格、链接均可渲染；mermaid 代码块本期降级显示为标注 `mermaid` 的代码块（不渲染图）。
- **FR-9 文档内链改写**：md 内相对链接 `./xxx.md` / `../yyy.md` 在渲染前被改写为 `/enterprise/docs/<slug>`（去掉 `.md`，处理 `./` / `../` 与目录索引 `README.md → /enterprise/docs/<dir>`）。
- **FR-10 SecurityAdvisoryBanner**：Enterprise 文档区也展示安全横幅（复用现有组件 + `align="docs"`）。

### NFR（非功能需求）
- **NFR-1**：构建产物大小增量可控（53 篇 md 总计约 < 1 MB raw）；Vercel build 时长增量 ≤ 30s。
- **NFR-2**：所有新增页面通过 `tsc -p tsconfig.json` 与 `eslint` 检查（与现有 `lint`、`ts-check` 脚本对齐）。
- **NFR-3**：移动端导航 Enterprise 入口与现有 Features / Examples 视觉一致（同字号、同 hover 行为）。
- **NFR-4**：文档页 SEO：`generateMetadata` 输出 `title = ${doc.title} | AgenticX Enterprise` 与文档首段为 description。
- **NFR-5**：与开源 `/docs` 风格统一（同 sidebar 宽度、同 `MarkdownRenderer`、同顶部 banner）；视觉无割裂感。

### AC（验收标准）
- **AC-1**：本地 `pnpm dev` 后，`http://localhost:3000/` 导航栏可见 `Enterprise`，点击跳转 `/enterprise`，Landing 页正常渲染。
- **AC-2**：`/enterprise/docs` 打开后侧栏出现完整章节树（架构 / 应用与模块 / API / 网关 / 数据与权限 / 配置 / 插件 / 开发与测试 / 部署与运维 / 决策记录 / 验收与销售 / 可观测性 / 法务），共计 53 个可点击文档项。
- **AC-3**：抽样 8 篇覆盖各目录的文档（`architecture/overview`、`gateway/overview`、`api/admin-console`、`runbooks/sso-oidc-setup`、`deployment/vercel-env-checklist`、`rbac/scopes`、`adr/0001-oss-foundations-selection`、`sales/sso-demo-script`）均能 200 渲染，无空白、代码块/表格/链接正常。
- **AC-4**：文档内任意相对链接（如 `./policy-engine.md`）点击后跳转到 `/enterprise/docs/<对应 slug>` 不 404。
- **AC-5**：⌘K 在 `/enterprise/docs/*` 弹出 Enterprise 文档搜索面板，输入 "sso"、"policy"、"audit" 等关键字能命中至少 1 条相关文档。
- **AC-6**：`pnpm build` 成功，`out`/`.next` 产物包含 53 个 enterprise 文档静态页，构建无 type error / lint error。
- **AC-7**：推送至 `main` 后 Vercel 自动部署成功，`https://www.agxbuilder.com/enterprise` 与 `https://www.agxbuilder.com/enterprise/docs/architecture/overview` 均可访问。

---

## 3. 现状盘点（已读源码确认）

- 仓库：`AgenticX-Website`（独立仓库 `DemonDamon/AgenticX-Website`），Next.js 16.1.1 + App Router + Tailwind v4，pnpm 9。
- 导航在 `src/app/page.tsx` L329–L367（桌面 nav + 移动 menu）。
- 现有开源 `/docs` 在 `src/app/docs/`：
  - `layout.tsx` 用 `DocSidebar` + 主区。
  - `[...slug]/page.tsx` 通过 `docsMap`（来自 `content/*.ts`）渲染。
  - `MarkdownRenderer`（`src/components/docs/markdown-renderer.tsx`）支持标题/列表/表格/代码块/链接/粗斜体。
  - `DocSidebar` / `DocSearchCommand` / `navigation.ts` 三件套。
- 主仓 `enterprise/docs/` 共 **53 个 md** 文件，已盘点目录：
  - `architecture/` 5（overview, data-flow, plugin-runtime, mcp-hosting, cache-and-pricing, protocol-translation） — 实际 6 个
  - `apps/README.md`、`features/README.md`、`packages/README.md`
  - `api/` 5（README, internal-api, gateway, web-portal, admin-console）
  - `gateway/` 5（overview, policy-engine, runtime-config, api-tokens, keypool-pat-overview, mcp-hosting-overview） — 实际 6 个
  - `runbooks/` 11（wasm-plugins, mcp-hosting, ai-cache, multi-protocol, gateway-channel-relay, cloudflare-quick-tunnel-setup, ngrok-demo-setup, sso-saml-setup, sso-acceptance-checklist, sso-oidc-setup, policy-snapshot-rollback, audit-pg-backfill）
  - `deployment/` 4（README, vercel-env-checklist, vercel-git-autodeploy, supabase-migration-guide, 2026-05-12-supabase-seed-tls-pitfall）— 实际 5 个
  - `observability/` 1（README）+ 1 grafana JSON（不入库）
  - `database/schema.md`、`rbac/scopes.md`、`configuration/env-vars.md`、`plugin-protocol/README.md`
  - `development/local-dev.md`、`development/troubleshooting.md`
  - `testing/README.md`、`perf-baselines/README.md`、`legal/third-party-implementation-policy.md`
  - `adr/0001-oss-foundations-selection.md`、`mvp-acceptance-checklist-v20260422.md`、`sales/sso-demo-script.md`、`guides/enterprise-customers-collaboration.md`
  - 根 `README.md`
  - 总计 53 文件（含 1 个 grafana json 不计入文档页 = 52 md），按需求按"全量 53"对外口径展示，其中 `observability/grafana-ai-gateway.json` 以"配套资产"链接形式在 observability 页内展示，不单独成路由。
- 关键链路：现有开源 `/docs` 走 **TS 内联** 方式，复制 53 篇成本极高且易腐败；本期**改为 build 期读 md**，仅对 Enterprise 章节生效，不影响开源 `/docs`。

---

## 4. 实施方案（How）

### 4.1 仓内文档物料

- 新增目录 `AgenticX-Website/content/enterprise/`，把主仓 `enterprise/docs/` 整体拷贝进去（git tracked）。
- 同步脚本 `scripts/sync-enterprise-docs.sh`：
  - 默认源 `${ENTERPRISE_DOCS_SRC:-../AgenticX/enterprise/docs}`，目标 `content/enterprise`。
  - 用 `rsync -av --delete --exclude='*.swp'` 同步。
  - 同步后写 `content/enterprise/.synced-at`（ISO 时间戳）便于追溯。
- `package.json` 增脚本：`"sync:enterprise-docs": "bash ./scripts/sync-enterprise-docs.sh"`；**不**在 `build` 自动跑（避免 CI 找不到源路径），改为开发者手动同步后 commit。
- `README.md` 增"更新 Enterprise 文档"步骤。

### 4.2 路由与页面

- `src/app/enterprise/page.tsx`：Landing（Server Component）。
  - 顶部沿用首页 `nav`（抽 `MarketingNav` 或直接复用首页 nav 结构 — 本期选择**复用首页 nav 视觉**：直接在 enterprise landing 里写一份相同 nav，避免重构现有首页结构）。
  - Hero：标题 `AgenticX Enterprise`、副标题 `企业级大模型应用一体化平台`、两个 CTA。
  - 三卡片：Web Portal / Admin Console / AI Gateway，每卡 50–80 字描述 + "了解更多 →" 跳到对应文档。
  - 能力清单（IAM / 策略 / 审计 / 计量 / SSO / 网关 / 插件）以两列网格呈现。
  - Footer 复用现有页脚（或简化 footer）。
- `src/app/enterprise/docs/layout.tsx`：仿 `src/app/docs/layout.tsx`，左侧 `EnterpriseDocSidebar`、顶部 `SecurityAdvisoryBanner align="docs"`，主区 `max-w-4xl`。
- `src/app/enterprise/docs/page.tsx`：渲染 `content/enterprise/README.md`。
- `src/app/enterprise/docs/[...slug]/page.tsx`：
  - `generateStaticParams`：扫描 `content/enterprise/**/*.md`，把 `README.md` 映射成 `[dir]` 索引；其他 `.md` 去后缀作为 slug。
  - `generateMetadata`：从 md 首个 `#` 标题取 title，首段非空文本（剥离 frontmatter / blockquote）取 description。
  - 页面体：`fs.readFileSync` md 内容 → 链接改写 → `<MarkdownRenderer />`。
- 404 兜底：未知 slug 落到 `notFound()`。

### 4.3 Slug 规则与 README 映射

- 文件 `enterprise/docs/foo/bar.md` → slug `foo/bar` → URL `/enterprise/docs/foo/bar`。
- 文件 `enterprise/docs/foo/README.md` → slug `foo` → URL `/enterprise/docs/foo`。
- 文件 `enterprise/docs/README.md` → URL `/enterprise/docs`（由 `page.tsx` 渲染）。
- 文件名包含日期前缀（如 `2026-05-12-supabase-seed-tls-pitfall.md`）保留原 slug。

### 4.4 内链改写

- 工具 `src/lib/enterprise-docs/rewrite-links.ts`：
  - 输入：当前文档 slug、md 原文。
  - 用正则匹配 `[text](path)`，对 `path`：
    - 跳过 `http(s)://`、`mailto:`、`#anchor`、绝对路径 `/`、外部 raw。
    - 处理 `./`、`../`：基于当前 slug 目录解析为绝对路径。
    - 结尾 `.md` 去掉；`/README.md` 或 `/README` 替换为 `/`。
    - 拼接前缀 `/enterprise/docs/`。
  - 同时改写 md 内 **图片** 相对路径（如 `./images/foo.png`）：本期 enterprise/docs/ 内**未发现** 图片资源（盘点 53 文件均为纯 md / 1 json），不实现；若后续出现，二期再补 `public/enterprise/` 资源复制。
- 单元化测试（可选，本期至少手测）：覆盖 `./foo.md`、`../bar.md`、`./baz/README.md`、`./qux.md#section`、`http://x`。

### 4.5 Sidebar 与导航树

- `src/components/enterprise-docs/navigation.ts`：仿 `src/components/docs/navigation.ts`，类型复用 `DocNavSection` / `DocNavItem`。
- 章节划分（按 `enterprise/docs/README.md` 的目录段落 + 缺失补齐）：

  ```
  Overview
    - Introduction (README)

  Architecture
    - Overview, Data Flow, Plugin Runtime, MCP Hosting, Cache & Pricing, Protocol Translation

  Apps & Modules
    - Apps, Features, Packages

  API Reference
    - Index, Web Portal, Admin Console, Gateway, Internal API

  AI Gateway
    - Overview, Policy Engine, Runtime Config, API Tokens, Keypool / PAT, MCP Hosting

  Data & Permissions
    - Database Schema, RBAC Scopes

  Configuration
    - Env Vars

  Plugins
    - Plugin Protocol

  Development & Testing
    - Local Dev, Troubleshooting, Testing, Perf Baselines

  Observability
    - Overview (README) + 链接 Grafana JSON

  Deployment & Runbooks
    - Deployment Index, Vercel Env Checklist, Vercel Git Autodeploy,
      Supabase Migration, Supabase Seed TLS Pitfall
    - Runbooks: SSO OIDC, SSO SAML, SSO Acceptance, Audit PG Backfill,
      Policy Snapshot Rollback, Channel Relay, Cloudflare Tunnel,
      ngrok Demo, AI Cache, Multi-Protocol, MCP Hosting, WASM Plugins

  ADR
    - 0001 OSS Foundations Selection

  Sales & Acceptance
    - MVP Acceptance Checklist v20260422
    - SSO Demo Script
    - Enterprise Customers Collaboration

  Legal
    - Third-Party Implementation Policy
  ```

- `EnterpriseDocSidebar`（`src/components/enterprise-docs/sidebar.tsx`）：仿 `DocSidebar`，logo 旁加角标 `Enterprise`（与开源文档区作视觉区分），底部去掉版本下拉（暂不需要）。
- `EnterpriseDocSearchCommand`（`src/components/enterprise-docs/doc-search-command.tsx`）：仿 `DocSearchCommand`，数据源换成 enterprise 导航树。

### 4.6 安全横幅

- 文档区 `enterprise/docs/layout.tsx` 直接复用 `<SecurityAdvisoryBanner align="docs" />`，与现有 `/docs/layout.tsx` 一致。

### 4.7 首页导航修改

- `src/app/page.tsx` L338–L346 桌面 nav、L360–L364 移动 menu，分别在 `Features` 后插入：

  ```tsx
  <Link href="/enterprise" className="text-sm text-neutral-400 hover:text-white transition-colors">Enterprise</Link>
  ```

- 不动其他按钮与样式。

---

## 5. 文件清单（预计新增 / 修改）

### 新增
- `content/enterprise/**`（约 53 个 md + 1 个 json，约 ≤ 1 MB）
- `content/enterprise/.synced-at`
- `scripts/sync-enterprise-docs.sh`
- `src/app/enterprise/page.tsx`
- `src/app/enterprise/docs/layout.tsx`
- `src/app/enterprise/docs/page.tsx`
- `src/app/enterprise/docs/[...slug]/page.tsx`
- `src/components/enterprise-docs/navigation.ts`
- `src/components/enterprise-docs/sidebar.tsx`
- `src/components/enterprise-docs/doc-search-command.tsx`
- `src/lib/enterprise-docs/load-doc.ts`（fs 读 md + frontmatter / title 抽取）
- `src/lib/enterprise-docs/rewrite-links.ts`
- `src/lib/enterprise-docs/list-docs.ts`（generateStaticParams 用）

### 修改
- `src/app/page.tsx`（导航增 Enterprise 入口；桌面 + 移动菜单）
- `package.json`（新增 `sync:enterprise-docs` 脚本）
- `README.md`（新增"更新 Enterprise 文档"小节）

### 不动
- `src/app/docs/**`（开源框架文档保持原状）
- `next.config.ts`、`scripts/build.sh`（fs.readFileSync 在 Node Server Component / 静态生成阶段可直接使用，无需特殊配置）

---

## 6. 风险与缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| md 内有 mermaid / frontmatter 等 `MarkdownRenderer` 不支持的语法 | 个别页排版退化 | 本期降级显示；二期专项升级渲染器 |
| 主仓 `enterprise/docs/` 与 website 仓 `content/enterprise/` 双写漂移 | 文档过时 | 同步脚本 + commit 时附带 `.synced-at`；后续可加 CI 检测最近同步距今天数 |
| md 内的相对链接形态各异（`./`、`../`、带 anchor、目录索引） | 跳转 404 | `rewrite-links.ts` 单测覆盖 5 种典型形态；上线后抽样跑一遍内链点击 |
| Next 16 静态生成阶段 `fs` 路径解析 | 构建失败 | 用 `path.join(process.cwd(), 'content/enterprise', ...)`，并在 `generateStaticParams` 中走相同根路径 |
| 53 篇全量上线后侧栏过长，体验差 | 浏览压力 | 按章节折叠（沿用 `SidebarSection` 折叠态）+ ⌘K 搜索兜底 |
| 文档里出现引用主仓非 docs 路径（如 `../../scripts/README.md`） | 链接落到 enterprise 域外 | rewrite 函数检测到目标越界 → 改写为指向 GitHub 主仓 raw URL（fallback） |
| Vercel preview 出现 403（截图所示） | 与本期无关 | 与本计划无关；在 Project Settings → Deployment Protection 单独排查 |

---

## 7. 实施步骤（建议两个 commit）

> 遵循 `plan-management.mdc`：每个 commit 都带 `Plan-Id: 2026-05-23-enterprise-section-and-docs-onboarding` / `Plan-File: AgenticX-Website/.plan/2026-05-23-enterprise-section-and-docs-onboarding.plan.md` / `Made-with: Damon Li` trailer。

### Commit 1（feat：基础设施 + Landing + 文档同步）
1. 新增 `scripts/sync-enterprise-docs.sh`，运行同步 → 提交 `content/enterprise/**`。
2. 新增 `src/lib/enterprise-docs/*`（load-doc、list-docs、rewrite-links）。
3. 新增 `src/components/enterprise-docs/{navigation,sidebar,doc-search-command}.tsx`。
4. 新增 `src/app/enterprise/page.tsx`（Landing）。
5. 修改 `src/app/page.tsx` 导航增 Enterprise 入口。
6. `pnpm ts-check && pnpm lint && pnpm build` 全绿。

### Commit 2（feat：Enterprise 文档全路由）
1. 新增 `src/app/enterprise/docs/{layout,page,[...slug]/page}.tsx`。
2. 接入 `EnterpriseDocSidebar` 与 ⌘K 搜索。
3. 手测 AC-3 抽样 8 篇 + AC-4 内链 + AC-5 搜索。
4. `pnpm build` 全绿 → push → 验证 Vercel 部署。

### 可选 Commit 3（chore：README & 同步流程）
1. 更新 `README.md` "更新 Enterprise 文档" 小节。
2. （可选）增加 `scripts/check-enterprise-docs-fresh.ts`，提示 `.synced-at` 距今超过 30 天。

---

## 8. 验收清单（对照 AC 自检）

- [ ] AC-1 首页导航 Enterprise 入口可见可点
- [ ] AC-2 `/enterprise/docs` 侧栏全章节 53 项可见
- [ ] AC-3 抽样 8 篇渲染正常
- [ ] AC-4 文档内相对链接跳转正确
- [ ] AC-5 ⌘K 搜索命中关键字
- [ ] AC-6 `pnpm build` 无错误，产物含全部 enterprise 静态页
- [ ] AC-7 Vercel 自动部署成功，生产域可访问

---

## 9. 后续（不在本期）

- mermaid 渲染（用 `mermaid` + `<MermaidBlock />`）
- frontmatter 解析（title / description / weight / hidden）支持隐藏草稿
- Enterprise 文档英文版（i18n）
- Enterprise 真实 Demo 子站（`demo.agxbuilder.com`，独立 Vercel 项目）
- 主仓 → 网站仓 文档自动同步 CI（GitHub Action：主仓 enterprise/docs/ 变更 → PR 到 website 仓）
