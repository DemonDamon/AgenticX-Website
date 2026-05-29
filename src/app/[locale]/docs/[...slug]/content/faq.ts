export const faqContent = {
  en: {
    title: 'FAQ',
    description: 'Frequently asked questions about AgenticX.',
    content: `# FAQ

## General

### What is AgenticX?

AgenticX is a unified, production-ready Python framework for building multi-agent AI applications. It provides everything from a single-agent execution engine to complex multi-agent orchestration, memory systems, tool integration, and a full Studio UI.

### How is AgenticX different from LangChain or CrewAI?

AgenticX is designed for production from day one:
- **Unified**: One framework covers agents, tools, memory, orchestration, protocols (A2A/MCP), observability, and security
- **Studio**: A full web UI and Desktop app for managing agents, sessions, and group chats
- **Enterprise-ready**: Security layer, sandbox execution, audit logging, and session isolation built in
- **Multi-agent native**: Avatar system, group chat, Meta-Agent CEO pattern, and team management out of the box

### Is AgenticX open source?

Yes. AgenticX is licensed under [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0).

---

## Installation

### What Python version is required?

Python 3.10 or higher.

### How do I install optional features?

\`\`\`bash
pip install "agenticx[all]"    # Everything
pip install "agenticx[vector]" # Vector store support
pip install "agenticx[doc]"    # Document parsing
\`\`\`

---

## LLM Providers

### Which LLM providers are supported?

15+ providers including OpenAI, Anthropic, Ollama (local), Gemini, Kimi/Moonshot, MiniMax, Ark/VolcEngine, Zhipu, Qianfan, and Bailian/Dashscope.

### Can I use local models?

Yes. Use the \`OllamaProvider\` to connect to locally running models via [Ollama](https://ollama.ai):

\`\`\`python
from agenticx.llms import OllamaProvider
llm = OllamaProvider(model="llama3.2", base_url="http://localhost:11434")
\`\`\`

### Does MiniMax support image inputs?

No. All \`minimax-m2*\` models do not support image or audio inputs. The framework will warn you if you try to send images to these models.

---

## Tools & MCP

### What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io) is an open standard for connecting AI agents to tools and data sources. AgenticX includes an MCP Hub that can connect to multiple MCP servers simultaneously.

### Can I use tools from other frameworks?

Yes. AgenticX can import tools from LangChain, use OpenAPI specs to auto-generate toolsets, or call any HTTP endpoint via Remote Tools.

---

## Memory

### Where is memory stored?

By default, memory is stored in SQLite at \`~/.agenticx/workspace/\`. You can configure Redis or PostgreSQL for production deployments.

### Does memory persist across restarts?

Yes. All memory backends (SQLite, Redis, PostgreSQL) persist data between sessions.

---

## Studio & Desktop

### How do I start the Studio UI?

\`\`\`bash
agx serve --port 8000
# Open http://localhost:8000
\`\`\`

### What is the Desktop app?

The Machi Desktop app is an Electron-based application that wraps the Studio UI with native OS features like system tray, notifications, and multi-window support. It supports session restoration after restart.

---

## Contributing

### How can I contribute?

See [CONTRIBUTING.md](https://github.com/DemonDamon/AgenticX/blob/main/CONTRIBUTING.md) on GitHub.

### How do I report a bug?

Open an issue on [GitHub Issues](https://github.com/DemonDamon/AgenticX/issues).
`,
  },
  zh: {
    title: '常见问题',
    description: '关于 AgenticX 的常见问题解答。',
    content: `# 常见问题

## 通用

### AgenticX 是什么？

AgenticX 是一套面向生产环境、统一的 Python 多智能体应用框架，覆盖从单智能体执行引擎到复杂多智能体编排、记忆系统、工具集成以及完整 Studio UI 的全链路能力。

### AgenticX 与 LangChain 或 CrewAI 有何不同？

AgenticX 从设计之初即面向生产落地：
- **一体化**：同一框架涵盖智能体、工具、记忆、编排、协议（A2A/MCP）、可观测性与安全
- **Studio**：提供完整 Web UI 与 Desktop 应用，管理智能体、会话与群聊
- **企业就绪**：内置安全层、沙箱执行、审计日志与会话隔离
- **原生多智能体**：开箱即用的分身系统、群聊、Meta-Agent CEO 模式与团队管理

### AgenticX 是否开源？

是的。AgenticX 采用 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0) 许可证。

---

## 安装

### 需要什么 Python 版本？

Python 3.10 或更高版本。

### 如何安装可选功能？

\`\`\`bash
pip install "agenticx[all]"    # Everything
pip install "agenticx[vector]" # Vector store support
pip install "agenticx[doc]"    # Document parsing
\`\`\`

---

## LLM 供应商

### 支持哪些 LLM 供应商？

支持 15+ 家供应商，包括 OpenAI、Anthropic、Ollama（本地）、Gemini、Kimi/Moonshot、MiniMax、Ark/VolcEngine、智谱、千帆与百炼/Dashscope 等。

### 可以使用本地模型吗？

可以。通过 \`OllamaProvider\` 连接 [Ollama](https://ollama.ai) 本地运行的模型：

\`\`\`python
from agenticx.llms import OllamaProvider
llm = OllamaProvider(model="llama3.2", base_url="http://localhost:11434")
\`\`\`

### MiniMax 是否支持图片输入？

不支持。所有 \`minimax-m2*\` 模型均不支持图片或音频输入；若向这些模型发送图片，框架会给出警告。

---

## 工具与 MCP

### 什么是 MCP？

[Model Context Protocol](https://modelcontextprotocol.io) 是连接 AI 智能体与工具、数据源的开源标准。AgenticX 内置 MCP Hub，可同时连接多个 MCP 服务器。

### 能否使用其他框架的工具？

可以。AgenticX 可导入 LangChain 工具、基于 OpenAPI 规范自动生成 toolset，或通过 Remote Tools 调用任意 HTTP 端点。

---

## 记忆

### 记忆存储在哪里？

默认存储在 \`~/.agenticx/workspace/\` 的 SQLite 中；生产环境可配置 Redis 或 PostgreSQL。

### 重启后记忆是否保留？

会保留。所有记忆后端（SQLite、Redis、PostgreSQL）均会在会话之间持久化数据。

---

## Studio 与 Desktop

### 如何启动 Studio UI？

\`\`\`bash
agx serve --port 8000
# Open http://localhost:8000
\`\`\`

### Desktop 应用是什么？

Machi Desktop 是基于 Electron 的应用，在 Studio UI 之上提供系统托盘、通知、多窗口等原生 OS 能力，并支持重启后会话恢复。

---

## 贡献

### 如何参与贡献？

请参阅 GitHub 上的 [CONTRIBUTING.md](https://github.com/DemonDamon/AgenticX/blob/main/CONTRIBUTING.md)。

### 如何报告 Bug？

在 [GitHub Issues](https://github.com/DemonDamon/AgenticX/issues) 提交 issue。
`,
  },
};
