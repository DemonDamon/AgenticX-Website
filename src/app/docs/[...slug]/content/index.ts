export const indexContent = {
  title: 'AgenticX',
  description: 'Unified Multi-Agent Framework — production-ready, scalable, from simple automation to complex multi-agent collaboration.',
  content: `# AgenticX

**Unified Multi-Agent Framework** — production-ready, scalable, from simple automation to complex multi-agent collaboration.

## Vision

AgenticX aims to create a unified, scalable, production-ready multi-agent application development framework, empowering developers to build everything from simple automation assistants to complex collaborative intelligent agent systems.

## System Architecture

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
};
