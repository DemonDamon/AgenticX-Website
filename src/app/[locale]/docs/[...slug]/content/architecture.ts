export const architectureContent = {
  en: {
    title: 'Architecture',
    description: 'AgenticX system architecture overview.',
    content: `# Architecture

## Overview

AgenticX is organized into **5 tiers**, from user-facing interfaces down to platform services.

\`\`\`
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
│         Desktop App │ CLI (agx) │ SDK               │
├─────────────────────────────────────────────────────┤
│                 Studio Runtime                       │
│   Session Manager │ Meta-Agent │ Team Manager        │
│         Avatar Registry │ Group Chat                 │
├─────────────────────────────────────────────────────┤
│                 Core Framework                       │
│  Orchestration │ Execution │ Agent │ Memory          │
│       Tools │ LLM Providers │ Hooks                  │
├─────────────────────────────────────────────────────┤
│               Platform Services                      │
│  Observability │ Protocols (A2A/MCP) │ Security      │
│              Storage Layer                           │
├─────────────────────────────────────────────────────┤
│               Domain Extensions                      │
│    GUI Agent │ Knowledge & GraphRAG │ AgentKit        │
└─────────────────────────────────────────────────────┘
\`\`\`

![AgenticX System Architecture](/docs/assets/architecture.png)

---

## Tier 1: User Interface

### Desktop App
Electron + React + Zustand + Vite. Supports Pro mode (multi-pane) and Lite mode (single-pane). Features include command palette, settings panel, avatar sidebar, sub-agent panel, session history, and workspace panel.

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
Leak detection, injection detector, policy engine, audit logging, sandbox (Docker / Microsandbox / Subprocess).

### Storage
- **KV**: SQLite, Redis, PostgreSQL, MongoDB, InMemory
- **Vector**: Milvus, Qdrant, Chroma, Faiss, PgVector, Pinecone, Weaviate
- **Graph**: Neo4j, Nebula
- **Object**: S3, GCS, Azure

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

AgenticX 分为 **5 层**，从用户界面一直延伸到平台服务。

\`\`\`
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
│         Desktop App │ CLI (agx) │ SDK               │
├─────────────────────────────────────────────────────┤
│                 Studio Runtime                       │
│   Session Manager │ Meta-Agent │ Team Manager        │
│         Avatar Registry │ Group Chat                 │
├─────────────────────────────────────────────────────┤
│                 Core Framework                       │
│  Orchestration │ Execution │ Agent │ Memory          │
│       Tools │ LLM Providers │ Hooks                  │
├─────────────────────────────────────────────────────┤
│               Platform Services                      │
│  Observability │ Protocols (A2A/MCP) │ Security      │
│              Storage Layer                           │
├─────────────────────────────────────────────────────┤
│               Domain Extensions                      │
│    GUI Agent │ Knowledge & GraphRAG │ AgentKit        │
└─────────────────────────────────────────────────────┘
\`\`\`

![AgenticX System Architecture](/docs/assets/architecture.png)

---

## 第 1 层：用户界面

### Desktop App
Electron + React + Zustand + Vite。支持 Pro 模式（多窗格）与 Lite 模式（单窗格）。功能包括命令面板、设置面板、分身侧栏、子智能体面板、会话历史与工作区面板。

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
泄漏检测、注入检测器、策略引擎、审计日志、沙箱（Docker / Microsandbox / Subprocess）。

### 存储
- **KV**：SQLite、Redis、PostgreSQL、MongoDB、InMemory
- **Vector**：Milvus、Qdrant、Chroma、Faiss、PgVector、Pinecone、Weaviate
- **Graph**：Neo4j、Nebula
- **Object**：S3、GCS、Azure

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
