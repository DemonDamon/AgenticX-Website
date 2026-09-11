export const architectureContent = {
  en: {
    title: 'Architecture',
    description: 'AgenticX system architecture overview.',
    content: `# Architecture

## Overview

AgenticX is one capability core with three product forms on top:

- **Core / Runtime**: Python SDK, Studio Server, and Agent Runtime
- **Near Desktop**: local-first workspace; default path is local \`agx serve\`
- **Enterprise**: Portal, Admin Console, and Go AI Gateway for governed web access

Near and Enterprise share abstractions. Their current deploy paths are independent. The Gateway is compliance and model relay, not a full Agent Runtime.

![One capability core with three product doors](/docs/svg/architecture-forms-en.svg?v=2)

*Diagram: SDK, Near, and Enterprise start different processes; only Near runs AgentRuntime.*

!!! warning "Gateway is not AgentRuntime"
    Enterprise Gateway evaluates policy, meters tokens, and relays OpenAI-compatible calls. It does not run the Python think-act loop, spawn avatars, or replace \`agx serve\`.

![AgenticX product architecture](/diagrams/product-architecture-en.jpg)

![Near Desktop architecture](/diagrams/near-architecture-en.jpg)

![AgenticX Enterprise architecture](/diagrams/enterprise-architecture-en.jpg)

The Runtime itself is still easiest to read as five layers, from the user interface down to platform services.

![Five layers from UI to platform services](/docs/svg/architecture-layers-en.svg?v=2)

*Diagram: UI → Studio → core loop → protocols → ~/.agenticx platform files.*

## Worked example: the same question, three doors

**Scene.** “Summarize this repo’s README.”

| Door | What you actually start | Where the loop runs |
|------|-------------------------|---------------------|
| SDK | \`AgentExecutor(llm_provider=...).run(agent=, task=)\` | Your Python process |
| Near | App → local \`agx serve\` → \`AgentRuntime.run_turn\` | Studio on \`127.0.0.1\` |
| Enterprise | Portal → Go Gateway → upstream model | Gateway policy / quota; **not** \`AgentRuntime\` |

**What you should see.** Near: a chat pane, tool cards, \`~/.agenticx/sessions/<id>/messages.json\`. Enterprise: a browser workspace and audit/policy hits if a rule fires. Do not expect Desktop panes behind the Gateway.

The three official drawings above are the product maps. Use them when you need the whole stack in one glance.

---

## Tier 1: User Interface

### Near Desktop
Electron + React + Zustand + Vite. Multi-pane chat, avatars, group chat, workspace, terminal, automation, and Voice Focus. See [Near Desktop](/docs/concepts/near).

### CLI (\`agx\`)
Full-featured command-line tool covering: serve, studio, loop, run, project, deploy, codegen, docs, skills, hooks, debug, scaffold, config management.

See [CLI Reference →](/docs/cli)

### SDK
Python SDK for embedding AgenticX into your own applications.

---

## Tier 2: Studio Runtime

### Session Manager
Manages user sessions, chat history persistence (\`messages.json\`), write locks, and in-memory state. Supports cross-session avatar status queries.

### Meta-Agent
The CEO dispatcher. Dynamically orchestrates sub-agents, maintains active agent snapshots, and handles memory recall injection per turn. Built via \`agenticx/runtime/prompts/meta_agent.py\`.

### Team Manager (\`AgentTeamManager\`)
Controls concurrent agent execution, archived snapshots (\`_archived_agents\`), \`owner_session_id\` session isolation, \`avatar_id\` binding, and global registry lookup.

### Avatar & Group Chat
- **Avatar Registry**: CRUD operations for persistent agent identities
- **Group Chat**: Multiple routing strategies — user-directed (\`@mention\`), meta-routed, round-robin
- **Group Router**: Handles \`@mention\` parsing (full name / slug ID), intelligent routing to named members

---

## Tier 3: Core Framework

### Agent Execution Engine
Based on 12-Factor Agents methodology. The think-act loop processes tool calls, handles context overflow, and performs self-repair. Tool call sequences are validated to prevent provider 400 errors.

### Orchestration Engine
Graph-based workflow with conditional routing and parallel execution. The Flow system provides decorator-based pipeline definition.

### Tool System
- Function decorators (\`@tool\`)
- MCP Hub (multi-server aggregation)
- Remote Tools v2
- OpenAPI toolset
- Sandbox tools
- Skill bundles

### Memory System
Hierarchical: core → episodic → semantic. Integrates with Mem0 for long-term persistence. Supports memory decay, hybrid search, and compaction/flush.

### LLM Providers
Unified provider interface for 15+ LLMs with response caching, failover routing, and transcript sanitization.

---

## Tier 4: Platform Services

### Observability
Callback system, real-time metrics, Prometheus/OpenTelemetry integration, trajectory analysis, span tree, WebSocket streaming.

### Protocols
- **A2A**: Inter-agent communication (client / server / AgentCard / skill-as-tool)
- **MCP**: Model Context Protocol for tool and resource access

### Security
Leak detection, injection detector, policy engine, audit logging, sandbox (Docker / Microsandbox / Subprocess). Studio combines hooks, permissions, and path protection. It does not yet route every operation through one complete \`SafetyLayer\`.

### Storage
- **KV**: SQLite, Redis, PostgreSQL, MongoDB, InMemory
- **Vector**: Milvus, Qdrant, Chroma, Faiss, PgVector, Pinecone, Weaviate
- **Graph**: Neo4j, Nebula
- **Object**: S3, GCS, Azure

Default Studio persistence is the \`~/.agenticx\` file tree plus SQLite. Some third-party adapters remain placeholders and are not on the Studio main path.

---

## Tier 5: Domain Extensions

### GUI Agent
Desktop automation framework with A/B/C result classification using heuristic and VLM reflection modes.

### Knowledge & GraphRAG
Document processing pipeline → chunkers / readers / extractors → graph builders (GraphRAG) → retrievers (vector / BM25 / graph / hybrid) → reranker.

### AgentKit Integration
Pluggable integration layer for external agent frameworks.
`,
  },
  zh: {
    title: '架构',
    description: 'AgenticX 系统架构概览。',
    content: `# 架构

## 概述

AgenticX 是一套能力核心，上面叠三种产品形态：

- **Core / Runtime**：Python SDK、Studio Server 与 Agent Runtime
- **Near Desktop**：本地优先工作区，默认走本机 \`agx serve\`
- **Enterprise**：Portal、Admin Console 与 Go AI 网关，面向受管控的 Web 访问

Near 与 Enterprise 共用抽象，当前部署路径彼此独立。网关是合规与模型中继，不是完整的 Agent Runtime。

![一套能力核心、三扇产品门](/docs/svg/architecture-forms-zh.svg?v=2)

*示意图：SDK、Near、Enterprise 启动的是不同进程；只有 Near 跑 AgentRuntime。*

!!! warning "网关不是 AgentRuntime"
    Enterprise 网关做策略评估、Token 计量和 OpenAI 兼容中继。它不跑 Python think-act 循环，不拉起分身，也不替代 \`agx serve\`。

![AgenticX 产品与技术架构](/diagrams/product-architecture-zh.jpg)

![Near Desktop 架构](/diagrams/near-architecture-zh.jpg)

![AgenticX Enterprise 架构](/diagrams/enterprise-architecture-zh.jpg)

Runtime 内部仍可按五层来读，从用户界面到平台服务。

![从界面到平台的五层](/docs/svg/architecture-layers-zh.svg?v=2)

*示意图：界面 → Studio → 核心循环 → 协议 → ~/.agenticx 平台文件。*

## 实践案例：同一句话，三扇门

**场景。** 「总结这个仓库的 README。」

| 入口 | 你实际启动的 | 循环跑在哪 |
|------|----------------|------------|
| SDK | \`AgentExecutor(llm_provider=...).run(agent=, task=)\` | 你的 Python 进程 |
| Near | 应用 → 本机 \`agx serve\` → \`AgentRuntime.run_turn\` | \`127.0.0.1\` 上的 Studio |
| Enterprise | Portal → Go 网关 → 上游模型 | 网关策略 / 配额；**不是** \`AgentRuntime\` |

**你会看到。** Near：聊天窗格、工具卡、\`~/.agenticx/sessions/<id>/messages.json\`。Enterprise：浏览器工作区；命中规则时有审计 / 策略提示。不要指望网关后面还有 Desktop 窗格。

上面三张正式架构图是产品总图，需要一眼看完整栈时用它们。

---

## 第 1 层：用户界面

### Near Desktop
Electron + React + Zustand + Vite。多窗格聊天、分身、群聊、工作区、终端、自动化与语音焦点。详见 [Near 桌面](/docs/concepts/near)。

### CLI（\`agx\`）
功能完整的命令行工具，涵盖：serve、studio、loop、run、project、deploy、codegen、docs、skills、hooks、debug、scaffold、配置管理等。

请参阅 [CLI 参考 →](/docs/cli)

### SDK
用于将 AgenticX 嵌入自有应用的 Python SDK。

---

## 第 2 层：Studio 运行时

### Session Manager
管理用户会话、聊天历史持久化（\`messages.json\`）、写锁与内存状态，并支持跨会话查询分身状态。

### Meta-Agent
CEO 调度器。动态编排子智能体、维护活跃智能体快照，并在每轮对话中注入记忆召回。由 \`agenticx/runtime/prompts/meta_agent.py\` 构建。

### Team Manager（\`AgentTeamManager\`）
控制并发智能体执行、归档快照（\`_archived_agents\`）、\`owner_session_id\` 会话隔离、\`avatar_id\` 绑定以及全局注册表查询。

### 分身与群聊
- **Avatar Registry**：持久化智能体身份的 CRUD 操作
- **Group Chat**：多种路由策略 — 用户定向（\`@mention\`）、Meta 路由、轮询
- **Group Router**：处理 \`@mention\` 解析（全名 / slug ID），智能路由至指定成员

---

## 第 3 层：核心框架

### 智能体执行引擎
基于 12-Factor Agents 方法论。think-act 循环处理工具调用、应对上下文溢出并执行自修复；工具调用序列经校验，避免 provider 400 错误。

### 编排引擎
基于图的工作流，支持条件路由与并行执行；Flow 体系提供装饰器式流水线定义。

### 工具系统
- 函数装饰器（\`@tool\`）
- MCP Hub（多服务器聚合）
- Remote Tools v2
- OpenAPI toolset
- 沙箱工具
- Skill bundles

### 记忆系统
分层结构：core → episodic → semantic。与 Mem0 集成以实现长期持久化，支持记忆衰减、混合搜索以及压缩/刷写。

### LLM 供应商
统一 provider 接口，覆盖 15+ LLM，具备响应缓存、故障转移路由与 transcript 清洗能力。

---

## 第 4 层：平台服务

### 可观测性
回调体系、实时指标、Prometheus/OpenTelemetry 集成、轨迹分析、span 树、WebSocket 流式输出。

### 协议
- **A2A**：智能体间通信（client / server / AgentCard / skill-as-tool）
- **MCP**：Model Context Protocol，用于工具与资源访问

### 安全
泄漏检测、注入检测器、策略引擎、审计日志、沙箱（Docker / Microsandbox / Subprocess）。Studio 路径由 hooks、权限与路径保护组合而成，尚未把每次操作都送进完整的 \`SafetyLayer\`。

### 存储
- **KV**：SQLite、Redis、PostgreSQL、MongoDB、InMemory
- **Vector**：Milvus、Qdrant、Chroma、Faiss、PgVector、Pinecone、Weaviate
- **Graph**：Neo4j、Nebula
- **Object**：S3、GCS、Azure

Studio 默认持久化是 \`~/.agenticx\` 文件树加 SQLite。部分第三方适配器仍是占位，未接到 Studio 主路径。

---

## 第 5 层：领域扩展

### GUI Agent
桌面自动化框架，采用启发式与 VLM 反思模式进行 A/B/C 结果分类。

### 知识与 GraphRAG
文档处理流水线 → chunkers / readers / extractors → 图构建（GraphRAG）→ 检索器（vector / BM25 / graph / hybrid）→ reranker。

### AgentKit 集成
面向外部智能体框架的可插拔集成层。
`,
  },
};
