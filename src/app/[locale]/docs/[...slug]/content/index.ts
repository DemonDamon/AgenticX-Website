export const indexContent = {
  en: {
    title: 'AgenticX',
    description:
      'Unified Multi-Agent Framework — production-ready, scalable, from simple automation to complex multi-agent collaboration.',
    content: `# AgenticX

![AgenticX Logo](/docs/assets/agenticx-logo.png){ width="600" }

**Unified Multi-Agent Framework** — production-ready, scalable, from simple automation to complex multi-agent collaboration.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![PyPI version](https://img.shields.io/pypi/v/agenticx)](https://pypi.org/project/agenticx/)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/agenticx)](https://pypi.org/project/agenticx/)

---

## Vision

AgenticX aims to create a unified, scalable, production-ready multi-agent application development framework, empowering developers to build everything from simple automation assistants to complex collaborative intelligent agent systems.

## System Architecture

![AgenticX System Architecture](/docs/assets/architecture.png)

The framework is organized into **5 tiers**:

| Tier | Components |
|------|-----------|
| **User Interface** | Desktop App / CLI (\`agx\`) / SDK |
| **Studio Runtime** | Session Manager, Meta-Agent, Team Manager, Avatar & Group Chat |
| **Core Framework** | Orchestration, Execution, Agent, Memory, Tools, LLM Providers, Hooks |
| **Platform Services** | Observability, Protocols, Security, Storage |
| **Domain Extensions** | GUI Agent, Knowledge & GraphRAG, AgentKit Integration |

## Core Features

### 🤖 Agent Core
Production-ready execution engine based on 12-Factor Agents methodology, with Meta-Agent CEO dispatcher, agent team management, think-act loop, event-driven architecture, self-repair, and overflow recovery.

### 🔄 Orchestration Engine
Graph-based workflow engine + Flow system with decorators, execution plans, conditional routing, and parallel execution.

### 🛠️ Tool System
Unified tool interface with function decorators, MCP Hub (multi-server aggregation), remote tools v2, OpenAPI toolset, sandbox tools, skill bundles, and document routers.

### 🧠 Memory System
Hierarchical memory (core / episodic / semantic), Mem0 deep integration, workspace memory, short-term memory, memory decay, hybrid search, compaction flush, MCP memory, and memory intelligence engine.

### 🔌 LLM Providers
15+ providers — OpenAI, Anthropic, Ollama, Gemini, Kimi/Moonshot, MiniMax, Ark/VolcEngine, Zhipu, Qianfan, Bailian/Dashscope — with response caching, transcript sanitizer, and failover routing.

### 👥 Avatar & Team Collaboration
Avatar registry (CRUD), group chat with multiple routing strategies (user-directed / meta-routed / round-robin), and Meta-Agent CEO dispatcher with dynamic sub-agent orchestration.

### 📚 Knowledge & Retrieval
Document processing pipeline with chunkers, readers, extractors, and graph builders (GraphRAG). Vector/BM25/graph/hybrid retrievers, auto-retriever, and reranker.

### 🔒 Enterprise Security
Safety layer with leak detection, input sanitizer, injection detector, policy engine, sandbox (Docker / Microsandbox / Subprocess), audit logging.

### 📊 Observability & Evaluation
Complete callback system, real-time metrics, Prometheus/OpenTelemetry integration, EvalSet-based evaluation, LLM judge, and trace analysis.

### 💾 Storage Layer
Key-Value (SQLite/Redis/PostgreSQL/MongoDB), Vector (Milvus/Qdrant/Chroma/Faiss), Graph (Neo4j/Nebula), Object (S3/GCS/Azure).

## Quick Start

\`\`\`bash
pip install agenticx
\`\`\`

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Information gatherer",
    goal="Find and synthesize information"
)

task = Task(
    description="Research latest AI frameworks",
    expected_output="Comprehensive analysis"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider())
result = executor.run(task)
\`\`\`

[Get Started →](/docs/getting-started/installation)
[View on GitHub →](https://github.com/DemonDamon/AgenticX)
`,
  },
  zh: {
    title: 'AgenticX',
    description:
      '统一多智能体框架 — 生产就绪、可扩展，从简单自动化到复杂多智能体协作。',
    content: `# AgenticX

![AgenticX Logo](/docs/assets/agenticx-logo.png){ width="600" }

**统一多智能体框架** — 生产就绪、可扩展，从简单自动化到复杂多智能体协作。

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![PyPI version](https://img.shields.io/pypi/v/agenticx)](https://pypi.org/project/agenticx/)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/agenticx)](https://pypi.org/project/agenticx/)

---

## 愿景

AgenticX 旨在打造统一、可扩展、生产就绪的多智能体应用开发框架，帮助开发者构建从简单自动化助手到复杂协作智能体系统的一切应用。

## 系统架构

![AgenticX System Architecture](/docs/assets/architecture.png)

框架分为 **5 层**：

| 层级 | 组件 |
|------|------|
| **用户界面** | Desktop 应用 / CLI（\`agx\`）/ SDK |
| **Studio 运行时** | 会话管理、Meta-Agent、团队管理、分身与群聊 |
| **核心框架** | 编排、执行、Agent、记忆、工具、LLM 供应商、Hooks |
| **平台服务** | 可观测性、协议、安全、存储 |
| **领域扩展** | GUI Agent、知识库与 GraphRAG、AgentKit 集成 |

## 核心能力

### 🤖 Agent Core
基于 12-Factor Agents 方法论的生产级执行引擎，含 Meta-Agent CEO 调度、智能体团队管理、思考-行动循环、事件驱动架构、自愈与溢出恢复。

### 🔄 编排引擎
基于图的工作流引擎 + Flow 装饰器体系，支持执行计划、条件路由与并行执行。

### 🛠️ 工具系统
统一工具接口：函数装饰器、MCP Hub（多服务器聚合）、Remote Tools v2、OpenAPI 工具集、沙箱工具、Skill 技能包与文档路由。

### 🧠 记忆系统
分层记忆（核心 / 情景 / 语义）、Mem0 深度集成、工作区记忆、短期记忆、记忆衰减、混合检索、压缩刷写、MCP 记忆与记忆智能引擎。

### 🔌 LLM 供应商
15+ 供应商 — OpenAI、Anthropic、Ollama、Gemini、Kimi/Moonshot、MiniMax、Ark/火山、智谱、千帆、百炼/DashScope — 支持响应缓存、对话清洗与故障转移路由。

### 👥 分身与团队协作
分身注册表（CRUD）、群聊多种路由策略（用户定向 / Meta 路由 / 轮询），Meta-Agent CEO 调度与动态子智能体编排。

### 📚 知识库与检索
文档处理流水线（分块、读取、抽取、图构建 GraphRAG），向量/BM25/图/混合检索、自动检索与重排序。

### 🔒 企业级安全
安全层：泄露检测、输入清洗、注入检测、策略引擎、沙箱（Docker / Microsandbox / 子进程）、审计日志。

### 📊 可观测性与评估
完整回调体系、实时指标、Prometheus/OpenTelemetry 集成、EvalSet 评估、LLM 裁判与轨迹分析。

### 💾 存储层
键值（SQLite/Redis/PostgreSQL/MongoDB）、向量（Milvus/Qdrant/Chroma/Faiss）、图（Neo4j/Nebula）、对象（S3/GCS/Azure）。

## 快速开始

\`\`\`bash
pip install agenticx
\`\`\`

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Information gatherer",
    goal="Find and synthesize information"
)

task = Task(
    description="Research latest AI frameworks",
    expected_output="Comprehensive analysis"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider())
result = executor.run(task)
\`\`\`

[开始使用 →](/docs/getting-started/installation)
[在 GitHub 查看 →](https://github.com/DemonDamon/AgenticX)
`,
  },
};
