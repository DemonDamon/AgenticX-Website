export const configurationContent = {
  en: {
    title: 'Configuration',
    description: 'Configure AgenticX for your environment.',
    content: `# Configuration

The live file is \`~/.agenticx/config.yaml\`. Near settings write here. Studio and \`agx serve\` read it on start. Identity and long-term memory sit under \`~/.agenticx/workspace/\`. Session chat history is \`~/.agenticx/sessions/<id>/messages.json\`.

Use this page when you need a provider, tool-round cap, or skill scan path. You do not need every section to start.

![config.yaml and env vars feed serve and providers](/docs/svg/config-yaml-en.svg?v=2)

*Diagram: ~/.agenticx/config.yaml plus env vars drive serve, runtime, providers, and skills.*

!!! tip "Configured vs official default"
    A provider counts as configured when an API key **or a custom API base** is non-empty. Leaving only the official default base empty does not count. Local providers such as Ollama need a reachable API address.

!!! warning "Tool-round cap"
    Long audit-style tasks die when \`AGX_MAX_TOOL_ROUNDS\` / \`runtime.max_tool_rounds\` is too low. Raise it in this file or in the Desktop Automation / Runtime panel. Studio clamps the value (commonly 10–120).

## Global Config

\`\`\`yaml
# ~/.agenticx/config.yaml

# Default LLM provider
default_provider: openai
default_model: gpt-4o

# Runtime settings
AGX_MAX_TOOL_ROUNDS: 20

# Studio server
studio:
  host: 0.0.0.0
  port: 8000

# Memory settings
memory:
  backend: sqlite   # sqlite | redis | postgresql
  path: ~/.agenticx/workspace
\`\`\`

## Provider Configuration

Configure LLM providers in config or via environment variables:

### OpenAI

\`\`\`yaml
providers:
  openai:
    api_key: \${OPENAI_API_KEY}
    default_model: gpt-4o
\`\`\`

### Anthropic

\`\`\`yaml
providers:
  anthropic:
    api_key: \${ANTHROPIC_API_KEY}
    default_model: claude-3-5-sonnet-20241022
\`\`\`

### Ollama (local)

\`\`\`yaml
providers:
  ollama:
    base_url: http://localhost:11434
    default_model: llama3.2
\`\`\`

### MiniMax

\`\`\`yaml
providers:
  minimax:
    api_key: \${MINIMAX_API_KEY}
    default_model: minimax-m1
\`\`\`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`OPENAI_API_KEY\` | OpenAI API key | — |
| \`ANTHROPIC_API_KEY\` | Anthropic API key | — |
| \`AGX_MAX_TOOL_ROUNDS\` | Max tool call rounds per agent turn | \`20\` |
| \`AGX_CHROMIUM_QUIET\` | Suppress Chromium logs in Desktop | \`false\` |

## Workspace & Identity

Agent identities and memory are stored in \`~/.agenticx/workspace/\`. Each avatar gets its own subdirectory with session history, memories, and context files.

## Extensions & Skill Marketplace

Configure extension registries and local scan directories for the skill marketplace:

\`\`\`yaml
extensions:
  registries:
    - name: official
      url: https://registry.agxbuilder.com
      type: agx                          # AgenticX native registry
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub                      # ClawHub skills market
  scan_dirs:
    - ~/.agenticx/bundles
    - ~/.agenticx/skills/registry
\`\`\`

See [Extensions & Skill Ecosystem](/docs/guides/extensions) for full details on AGX Bundles and marketplace usage.

## Project-level Config

For per-project settings, create \`agenticx.yaml\` in your project root:

\`\`\`yaml
organization_id: my-org
default_llm:
  provider: openai
  model: gpt-4o-mini
tools:
  mcp_servers:
    - name: filesystem
      command: npx
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
\`\`\`
`,
  },
  zh: {
    title: '配置',
    description: '为你的环境配置 AgenticX。',
    content: `# 配置

真正生效的文件是 \`~/.agenticx/config.yaml\`。Near 设置会写这里。Studio 与 \`agx serve\` 启动时读它。身份和长期记忆在 \`~/.agenticx/workspace/\`。会话聊天在 \`~/.agenticx/sessions/<id>/messages.json\`。

只在需要配供应商、工具轮次上限或技能扫描路径时改。不是每一节都要填。

![config.yaml 与环境变量驱动 serve 和供应商](/docs/svg/config-yaml-zh.svg?v=2)

*示意图：~/.agenticx/config.yaml 加上环境变量，驱动 serve、运行时、供应商和技能。*

!!! tip "什么叫已配置"
    供应商「已配置」指 API 密钥或**自定义** API 地址至少一项非空。只留官方默认 Base 不算。Ollama 这类本机供应商必须填可访问地址。

!!! warning "工具轮次上限"
    审计类长任务会在 \`AGX_MAX_TOOL_ROUNDS\` / \`runtime.max_tool_rounds\` 太小时中断。在这个文件或桌面 Automation / Runtime 面板里调大。Studio 会夹紧取值（常见 10–120）。

## 全局配置

\`\`\`yaml
# ~/.agenticx/config.yaml

# Default LLM provider
default_provider: openai
default_model: gpt-4o

# Runtime settings
AGX_MAX_TOOL_ROUNDS: 20

# Studio server
studio:
  host: 0.0.0.0
  port: 8000

# Memory settings
memory:
  backend: sqlite   # sqlite | redis | postgresql
  path: ~/.agenticx/workspace
\`\`\`

## 供应商配置

可在配置文件中或通过环境变量配置 LLM 供应商：

### OpenAI

\`\`\`yaml
providers:
  openai:
    api_key: \${OPENAI_API_KEY}
    default_model: gpt-4o
\`\`\`

### Anthropic

\`\`\`yaml
providers:
  anthropic:
    api_key: \${ANTHROPIC_API_KEY}
    default_model: claude-3-5-sonnet-20241022
\`\`\`

### Ollama（本地）

\`\`\`yaml
providers:
  ollama:
    base_url: http://localhost:11434
    default_model: llama3.2
\`\`\`

### MiniMax

\`\`\`yaml
providers:
  minimax:
    api_key: \${MINIMAX_API_KEY}
    default_model: minimax-m1
\`\`\`

## 环境变量

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| \`OPENAI_API_KEY\` | OpenAI API 密钥 | — |
| \`ANTHROPIC_API_KEY\` | Anthropic API 密钥 | — |
| \`AGX_MAX_TOOL_ROUNDS\` | 每轮智能体最大工具调用次数 | \`20\` |
| \`AGX_CHROMIUM_QUIET\` | Desktop 中抑制 Chromium 日志 | \`false\` |

## 工作区与身份

智能体身份与记忆存储在 \`~/.agenticx/workspace/\`。每个分身拥有独立子目录，存放会话历史、记忆与上下文文件。

## 扩展与技能市场

为技能市场配置扩展注册源与本地扫描目录：

\`\`\`yaml
extensions:
  registries:
    - name: official
      url: https://registry.agxbuilder.com
      type: agx                          # AgenticX native registry
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub                      # ClawHub skills market
  scan_dirs:
    - ~/.agenticx/bundles
    - ~/.agenticx/skills/registry
\`\`\`

AGX Bundles 与市场使用的完整说明请参阅 [扩展与技能生态](/docs/guides/extensions)。

## 项目级配置

如需按项目单独配置，在项目根目录创建 \`agenticx.yaml\`：

\`\`\`yaml
organization_id: my-org
default_llm:
  provider: openai
  model: gpt-4o-mini
tools:
  mcp_servers:
    - name: filesystem
      command: npx
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
\`\`\`
`,
  },
};
