# Website Marketing Bits

Planned-with: Cursor Grok 4.6
Suggested-Impl-Model: Cursor Grok 4.6

目标：在 `AgenticX-Website` 营销页接入克制的 React Bits 视觉（不是 Svelte Bits），然后推送到已绑定的 Vercel 项目 `agentic-x-website`（`www.agxbuilder.com`）。

## In scope

- `/` 首页 hero 背景、标题入场、功能卡 spotlight、区块滚入
- `/enterprise` 仅 hero 一层更淡的背景
- 组件落点：`AgenticX-Website/src/components/bits/`

## Out of scope

- `/docs`、`/enterprise/docs`、`/auth`、`/agents`
- 文案、路由、i18n key、文档内容
- 自定义光标、Glitch、全屏 ColorBends、GSAP

## 组件策略

| 效果 | 做法 | 理由 |
|---|---|---|
| DarkVeil | 官方 shader + `ogl` | 背景必须是真 WebGL |
| SpotlightCard | 官方视觉，pointer 用 ref | 零依赖；避免 mousemove setState |
| FadeContent | IntersectionObserver，200ms | 官方依赖 GSAP 且默认 1000ms |
| 标题入场 | CSS stagger，CJK 按字 | 官方 SplitText 依赖 GSAP Club API |

统一：`prefers-reduced-motion` 时静态化；只 animate transform/opacity。

## 验收

- 首页 hero 有极淡暗色流动背景，标题入场只播一次
- 功能卡 hover 有光斑，无彩虹描边
- Enterprise hero 更淡，卡片仍是发丝边框
- docs / auth / agents 无改动
- `pnpm ts-check` 或生产 build 通过后 push `main`，Vercel 生产就绪
