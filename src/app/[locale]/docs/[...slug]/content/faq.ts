export const faqContent = {
  en: {
    title: 'FAQ',
    description: 'Frequently asked questions about AgenticX.',
    content: `# FAQ

Pick a form first, then a page. Most “it disappeared” bugs are a wrong process (\`agx studio\` vs \`agx serve\`) or a wrong session file.

![Pick SDK, Near, or Enterprise](/docs/svg/faq-doors-en.svg?v=2)

*Diagram: pick SDK, Near, or Enterprise — they are different processes.*

## General

### What is AgenticX?

AgenticX is one capability core with three forms: Python SDK + Agent Runtime, Near Desktop as a local-first workspace, and Enterprise for access, governance, and audit. **Studio is the local REST API + SSE backend.** It does not ship a built-in web chat UI.

### How do the three forms differ?

- **SDK**: \`Agent\` + \`Task\` + \`AgentExecutor.run(agent=, task=)\` in your process
- **Near**: Electron UI over local \`agx serve\`
- **Enterprise**: Portal / Admin / Go Gateway — policy and model relay, not the Python think-act loop

### Is AgenticX open source?

Yes. AgenticX is licensed under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). See the repository \`LICENSE\` file.

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

### How do I start the local backend?

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

\`agx serve\` is a REST API + SSE backend. It does not ship a built-in web chat UI. Use **Near Desktop** as the local workspace, or talk to Studio from the Python SDK / \`agx\` CLI.

### What is Near Desktop?

Near is the local-first Electron workspace. The default path starts a local \`agx serve / agx-server\`, then keeps multi-pane chat, avatars, group chat, workspace, terminal, and session restore on that backend.

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

先选形态再选文档。多数「突然没了」是进程选错（\`agx studio\` vs \`agx serve\`）或会话文件看错。

![在 SDK、Near 或 Enterprise 里选一扇门](/docs/svg/faq-doors-zh.svg?v=2)

*示意图：先选 SDK、Near 或 Enterprise——它们是不同进程。*

## 通用

### AgenticX 是什么？

AgenticX 是一套能力核心加三种形态：Python SDK + Agent Runtime、本地优先的 Near 桌面，以及面向访问、治理与审计的 Enterprise。**Studio 是本机 REST API + SSE 后端**，不内置网页聊天界面。

### 三种形态有何不同？

- **SDK**：自己进程里 \`Agent\` + \`Task\` + \`AgentExecutor.run(agent=, task=)\`
- **Near**：Electron 界面，默认连本机 \`agx serve\`
- **Enterprise**：Portal / 管理台 / Go 网关——策略与模型中继，不是 Python think-act 循环

### AgenticX 是否开源？

是的。AgenticX 采用 [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可证，以仓库 \`LICENSE\` 为准。

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

### 如何启动本机后端？

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

\`agx serve\` 是 REST API + SSE 后端，不内置网页聊天界面。本地工作区请用 **Near 桌面**，或通过 Python SDK / \`agx\` CLI 对接 Studio。

### Near 桌面是什么？

Near 是本地优先的 Electron 工作区。默认路径会拉起本机 \`agx serve / agx-server\`，再在其上提供多窗格聊天、分身、群聊、工作区、终端与会话恢复。

---

## 贡献

### 如何参与贡献？

请参阅 GitHub 上的 [CONTRIBUTING.md](https://github.com/DemonDamon/AgenticX/blob/main/CONTRIBUTING.md)。

### 如何报告 Bug？

在 [GitHub Issues](https://github.com/DemonDamon/AgenticX/issues) 提交 issue。
`,
  },
};
