export const indexContent = {
  en: {
    title: 'AgenticX',
    description:
      'Unified agent stack: Python Runtime, Near Desktop, and Enterprise.',
    content: `# AgenticX

**Unified agent stack** covering the Python Runtime, Near Desktop, and Enterprise.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![PyPI version](https://img.shields.io/pypi/v/agenticx)](https://pypi.org/project/agenticx/)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/agenticx)](https://pypi.org/project/agenticx/)

---

## Vision

AgenticX is a unified, production-ready agent stack. Build with the Python SDK and \`agx\` CLI, use **Near Desktop** as a local-first workspace, or deploy **Enterprise** for access, governance, and audit.

## System Architecture

![AgenticX product stack](/diagrams/product-stack.svg)

| Form | Role |
|------|-----------|
| **Core / Runtime** | Python SDK, Studio Server, Agent Runtime |
| **Near Desktop** | Local-first Electron workspace over \`agx serve\` |
| **Enterprise** | Portal, Admin Console, Go AI Gateway |

Inside the Runtime, the older five-layer map still holds: UI, Studio, core framework, platform services, and domain extensions. See [Architecture](/docs/concepts/architecture).

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

### Knowledge & Retrieval
Document processing pipeline with chunkers, readers, extractors, and graph builders (GraphRAG). Isolatable doc brain + code brain, hybrid code index, and vector / BM25 / graph / hybrid retrievers.

### Skills & Long-horizon
Skill lifecycle with a security scan and observation-driven self-evolution. Long-run orchestration plus a disk-backed project state machine.

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
      '统一智能体技术栈：Python Runtime、Near 桌面与 Enterprise。',
    content: `# AgenticX

**统一智能体技术栈**，覆盖 Python Runtime、Near 桌面与 Enterprise。

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![PyPI version](https://img.shields.io/pypi/v/agenticx)](https://pypi.org/project/agenticx/)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/agenticx)](https://pypi.org/project/agenticx/)

---

## 愿景

AgenticX 是一套统一、生产就绪的智能体技术栈。开发者用 Python SDK 与 \`agx\` CLI 构建，用 **Near 桌面** 做本地优先工作区，或部署 **Enterprise** 做访问、治理与审计。

## 系统架构

![AgenticX 产品栈](/diagrams/product-stack.svg)

| 形态 | 职责 |
|------|------|
| **Core / Runtime** | Python SDK、Studio Server、Agent Runtime |
| **Near Desktop** | 本地优先 Electron 工作区，默认连 \`agx serve\` |
| **Enterprise** | Portal、Admin Console、Go AI 网关 |

Runtime 内部仍可按五层理解：界面、Studio、核心框架、平台服务、领域扩展。详见 [架构](/docs/concepts/architecture)。

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

### 知识库与检索
文档处理流水线（分块、读取、抽取、GraphRAG），可隔离的文档脑 + 代码脑，以及向量 / BM25 / 图 / 混合检索。

### 技能与长周期
技能生命周期含安全扫描与观察驱动自进化。长任务编排加上磁盘项目状态机。

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
