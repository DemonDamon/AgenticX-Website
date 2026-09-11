export const indexContent = {
  en: {
    title: 'Introduction',
    description: 'How to read the AgenticX docs: one capability core, three product forms.',
    content: `# Introduction

AgenticX is a **local-first agent stack**. One Python capability core powers three product forms. You do not have to adopt all three.

| Form | Use it when | Do not treat it as |
|------|-------------|--------------------|
| **Core / Runtime** | You embed agents in your own Python app | A hosted multi-tenant control plane |
| **Near Desktop** | You want a local workspace (chat, avatars, tools, KB) | A browser SaaS |
| **Enterprise** | You need a governed employee portal and model relay | A replacement for the Python Agent Runtime |

!!! note "Shared abstractions, separate deploy paths"
    Near and Enterprise reuse the same agent / tool / memory ideas. Near talks to a local \`agx serve\` by default. Enterprise puts Portal, Admin Console, and a Go AI Gateway in front of models. The gateway is compliance and relay, not a second Agent Runtime.

![AgenticX product architecture](/diagrams/product-architecture-en.jpg)

## How a request moves

\`\`\`mermaid
flowchart LR
  user["You"] --> near["Near or SDK"]
  near --> studio["Studio Server"]
  studio --> runtime["AgentRuntime"]
  runtime --> tools["Tools / MCP / Skills"]
  runtime --> llm["Model provider"]
  runtime --> memory["Memory / KB"]
\`\`\`

## Pick a starting page

1. New to the stack → [Installation](/docs/getting-started/installation) then [Quick Start](/docs/getting-started/quickstart)
2. Want the map first → [Architecture](/docs/concepts/architecture)
3. Using the desktop app → [Near Desktop](/docs/concepts/near) and [Studio Server](/docs/guides/studio)
4. Building in Python → [Agent Runtime](/docs/concepts/agent) and [Tools](/docs/concepts/tools)
5. Governing web access → [Enterprise](/enterprise)

## What this docs set covers

- **Getting started**: install, first run, \`~/.agenticx/config.yaml\`
- **Concepts**: runtime loop, tools, memory, orchestration, hooks, skills, long-horizon coding
- **Guides**: first agent, multi-agent, Studio, knowledge brains, extensions, deploy
- **Reference**: public Agent API, CLI, FAQ

Enterprise runbooks live under [Enterprise docs](/enterprise/docs), not in this tree.

## Next

[Installation →](/docs/getting-started/installation)
`,
  },
  zh: {
    title: '简介',
    description: '怎么读 AgenticX 文档：一套能力核心，三种产品形态。',
    content: `# 简介

AgenticX 是一套**本地优先**的智能体技术栈。一套 Python 能力核心，支撑三种产品形态。不必三种都上。

| 形态 | 什么时候用 | 不要把它当成 |
|------|------------|--------------|
| **Core / Runtime** | 把智能体嵌进自己的 Python 应用 | 托管的多租户管控平面 |
| **Near Desktop** | 要本机工作区（聊天、分身、工具、知识库） | 浏览器 SaaS |
| **Enterprise** | 要受管控的员工门户和模型中继 | Python Agent Runtime 的替代品 |

!!! note "抽象共用，部署路径分开"
    Near 与 Enterprise 复用同一套智能体 / 工具 / 记忆抽象。Near 默认连本机 \`agx serve\`。Enterprise 用 Portal、管理台和 Go AI 网关承接模型访问。网关做合规与中继，不是第二套 Agent Runtime。

![AgenticX 产品与技术架构](/diagrams/product-architecture-zh.jpg)

## 一次请求怎么走

\`\`\`mermaid
flowchart LR
  user["你"] --> near["Near 或 SDK"]
  near --> studio["Studio Server"]
  studio --> runtime["AgentRuntime"]
  runtime --> tools["工具 / MCP / 技能"]
  runtime --> llm["模型供应商"]
  runtime --> memory["记忆 / 知识库"]
\`\`\`

## 按目的选入口

1. 第一次接触 → [安装](/docs/getting-started/installation) 再看 [快速上手](/docs/getting-started/quickstart)
2. 先看全局 → [架构](/docs/concepts/architecture)
3. 用桌面端 → [Near 桌面](/docs/concepts/near) 与 [Studio 服务](/docs/guides/studio)
4. 用 Python 嵌入 → [智能体运行时](/docs/concepts/agent) 与 [工具](/docs/concepts/tools)
5. 要企业 Web 管控 → [企业版](/enterprise)

## 这套文档覆盖什么

- **快速开始**：安装、第一次跑、\`~/.agenticx/config.yaml\`
- **核心概念**：运行时循环、工具、记忆、编排、Hooks、技能、长周期编码
- **指南**：第一个智能体、多智能体、Studio、知识脑、扩展、部署
- **参考**：公开 Agent API、CLI、FAQ

企业运维手册在 [企业文档](/enterprise/docs)，不在这棵树里。

## 下一步

[安装 →](/docs/getting-started/installation)
`,
  },
};
