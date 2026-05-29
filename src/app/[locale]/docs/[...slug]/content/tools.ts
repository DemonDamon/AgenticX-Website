export const toolsContent = {
  en: {
    title: 'Tools',
    description: 'Tool system in AgenticX.',
    content: `# Tools

## Overview

Tools are the contract between language models and your environment. In AgenticX they sit between **agent reasoning** and **side effects**: filesystem, shell, MCP servers, generated REST calls, and packaged skills. The runtime collects tool schemas for the model, routes \`tool_calls\` back to implementations, and funnels execution through shared policy, safety, and auditing hooks.

| Concern | Primary components |
|--------|---------------------|
| Declaring tools | \`@tool\`, \`FunctionTool\`, \`BaseTool\` subclasses |
| Studio / workspace | \`STUDIO_TOOLS\` (OpenAI-style function schemas + dispatch) |
| External MCP | \`MCPHub\`, \`MCPClientV2\`, \`RemoteTool\` |
| Spec-driven HTTP APIs | \`OpenAPIToolset\` |
| Skill packages | \`SkillBundleLoader\`, \`SkillTool\` |
| Execution | \`ToolExecutor\` (\`agenticx.tools.executor\`) |
| Isolation hints | \`SandboxPolicy\`, \`SandboxConfig\` |

!!! note "Naming"
    The public Python API lives under \`agenticx.tools\` and \`agenticx.safety\`. Some older or adapter layers also reference \`agenticx.core.executor.ToolExecutor\`; prefer \`agenticx.tools.executor.ToolExecutor\` for sandbox, safety layer, and audit features described below.

---

## \`@tool\` decorator

Use \`agenticx.tools.function_tool.tool\` to turn a plain function into a \`FunctionTool\` (\`BaseTool\`).

**Parameters**

| Parameter | Role |
|-----------|------|
| \`name\` | Tool id exposed to the model; defaults to the function name |
| \`description\` | Overrides auto-parsed docstring summary |
| \`args_schema\` | Optional Pydantic \`BaseModel\`; if omitted, a model is built from type hints and docstring \`Args\` |
| \`timeout\` | Per-tool timeout (seconds), combined with executor defaults |
| \`organization_id\` | Optional tenant scope for policy / storage |

**Behavior**

- Docstrings are parsed (short + long description, per-parameter text).
- Parameters are mapped to a Pydantic model for JSON Schema export and runtime validation.

\`\`\`python
from agenticx.tools.function_tool import tool

@tool(name="add", description="Add two integers.", timeout=5.0)
def add(a: int, b: int) -> int:
    """Add a and b.

    Args:
        a: First operand.
        b: Second operand.
    """
    return a + b
\`\`\`

!!! tip "Explicit schemas"
    For stable public contracts, pass \`args_schema=\` with a dedicated Pydantic model instead of relying only on inferred types.

---

## Built-in Studio tools

Studio sessions use \`STUDIO_TOOLS\` in \`agenticx.cli.agent_tools\`: a list of OpenAI-style \`function\` definitions wired to async handlers. Core categories:

| Name | Purpose |
|------|---------|
| \`bash_exec\` | Run shell commands in the workspace (with guards and confirmations where applicable) |
| \`file_read\` | Read file content with optional line range |
| \`file_write\` | Full-file write after diff preview and user confirmation |
| \`file_edit\` | Targeted replace after diff preview and confirmation |
| \`list_files\` | List workspace files |
| \`codegen\` | Drive the code generation engine (agent / workflow / tool / skill targets) |
| \`mcp_connect\`, \`mcp_call\`, \`mcp_import\` | Connect to MCP servers, invoke tools, import external MCP JSON |
| \`skill_use\`, \`skill_list\` | Activate or enumerate skill bundles |
| \`todo_write\` | Structured task list for the session |
| \`scratchpad_read\`, \`scratchpad_write\` | Session scratchpad |
| \`memory_append\`, \`memory_search\` | Lightweight memory helpers |
| \`lsp_goto_definition\`, \`lsp_find_references\`, \`lsp_hover\`, \`lsp_diagnostics\` | LSP-backed navigation and diagnostics |

Meta-only tools (delegation, resource checks, etc.) are defined separately (\`META_AGENT_TOOLS\`); avatars typically receive the Studio subset above.

!!! warning "Destructive writes"
    \`file_write\` and \`file_edit\` are designed for confirmation flows. Automations should respect the same UX guarantees the Studio server enforces.

---

## MCP Hub

\`MCPHub\` (\`agenticx.tools.mcp_hub\`) aggregates multiple MCP servers:

- **\`MCPClientV2\`**: one client per \`MCPServerConfig\`, persistent session, \`discover_tools()\` / \`call_tool()\`.
- **\`discover_all_tools()\`**: merges tool lists and builds a **routing table** (handles name collisions with prefixed routed names).
- **\`get_tools_for_agent()\`**: when \`auto_mode=True\`, returns \`MCPHubTool\` instances (\`BaseTool\`) ready for injection.
- **\`MCPHubConfig\`**: Pydantic model with \`servers: List[MCPServerConfig]\` and \`auto_mode\`.

\`\`\`python
from agenticx.tools.mcp_hub import MCPHub, MCPHubConfig
from agenticx.tools.remote_v2 import MCPServerConfig

config = MCPHubConfig(
    servers=[
        MCPServerConfig(name="docs", command="npx", args=["-y", "@some/mcp-server"]),
    ],
    auto_mode=True,
)
# hub = MCPHub.from_config(config)  # then await hub.discover_all_tools()
\`\`\`

**Configuration files**

- \`load_mcp_config()\` in \`agenticx.tools.remote\` reads a JSON file (default \`~/.cursor/mcp.json\`) into \`Dict[str, MCPServerConfig]\`.
- You can maintain the same structure in a project-local file (for example \`mcp_config.json\`) and load it with an explicit path.

!!! note "Transport"
    The bundled MCP client path used by \`MCPHub\` / \`MCPClientV2\` is **stdio**-oriented (child process). HTTP or SSE MCP endpoints are usually fronted by a local command or proxy that speaks stdio to AgenticX.

---

## Remote tools

AgenticX does **not** ship a class named \`RemoteToolProvider\`. Remote capability is modeled as:

| Type | Use |
|------|-----|
| \`RemoteTool\` | One \`BaseTool\` wrapping a single MCP tool on a given \`MCPServerConfig\` |
| \`MCPClient\` | Legacy client helper to list tools and construct \`RemoteTool\` instances |
| \`MCPClientV2\` | Preferred session-based client; used internally by \`MCPHub\` |

\`MCPServerConfig\` fields include \`command\`, \`args\`, \`env\`, \`timeout\`, optional \`cwd\`, \`enabled_tools\`, and \`assign_to_agents\` for filtering.

!!! tip "Secrets"
    Put tokens in \`env\` on \`MCPServerConfig\`, or resolve them from \`CredentialStore\` before building the config.

---

## OpenAPI toolset

\`OpenAPIToolset\` (\`agenticx.tools.openapi_toolset\`) builds \`BaseTool\` instances from **OpenAPI 3.x** or **Swagger 2.0**:

- \`OpenAPIToolset.from_file(path)\`
- \`OpenAPIToolset.from_url(url)\`

Operations become callable tools with generated parameter models and HTTP execution aligned to the spec.

!!! warning "Auth and side effects"
    Generated tools execute real HTTP requests. Restrict base URLs, pin specs, and supply credentials deliberately—treat them like production API clients.

---

## Skill bundle

Skills follow the Anthropic-style \`SKILL.md\` layout with YAML front matter. **\`SkillBundleLoader\`** (\`agenticx.tools.skill_bundle\`) scans standard locations (\`.agents/skills\`, \`.agent/skills\`, \`~/.agents/skills\`, \`.claude/skills\`, package builtins, etc.), applies optional **\`SkillGate\`** rules (\`metadata.agenticx.gate\`), and exposes skills as tools (e.g. **\`SkillTool\`**) for list/read and progressive disclosure.

**Session-level injection**

- In Studio, \`skill_use\` / \`skill_list\` tie into the loader so activated skills affect the current session context.
- \`SkillBundleLoader\` accepts \`execution_backend\` for sandboxed or alternate execution paths when running skill payloads.

!!! note ""SkillBundle" vs loader"
    The codebase centers on \`SkillBundleLoader\` and \`SkillMetadata\`; there is no separate \`SkillBundle\` class. Conceptually a "bundle" is the loaded set of skills from configured search paths.

AGX Bundle installs also land in **\`~/.agenticx/skills/bundles/\`**, which is automatically included in the scan paths, so bundled skills are discovered without any extra config.

---

## AGX Bundle

An **AGX Bundle** (\`agenticx.extensions\`) is a distributable directory package that combines Skills, MCP server configs, Avatar presets, and Memory templates into a single distributable unit.

\`\`\`
my-bundle/
├── agx-bundle.yaml
├── skills/
│   └── my-skill/SKILL.md
├── mcp/
│   └── server.json
├── avatars/
│   └── preset.yaml
└── memory/
    └── template.md
\`\`\`

**Key modules:**

| Module | Purpose |
|--------|---------|
| \`agenticx.extensions.bundle\` | Parses \`agx-bundle.yaml\`, enforces safe relative paths |
| \`agenticx.extensions.installer\` | Install / uninstall bundles, manages \`~/.agenticx/bundles.json\` |
| \`agenticx.extensions.registry_hub\` | Multi-source marketplace search & install |

**Quick install:**

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle

result = install_bundle(Path("./my-bundle"))
print(result.skills_installed, result.mcp_servers_installed)
\`\`\`

See [Extensions & Skill Ecosystem](/docs/guides/extensions) for the full guide including AGX Bundle format, marketplace configuration, and Desktop UI walkthrough.

---

## Tool executor

\`ToolExecutor\` (\`agenticx.tools.executor\`) is the shared execution pipeline for \`BaseTool\` instances.

**Typical flow (\`execute\` / \`aexecute\`)**

1. Optional **\`policy_stack.check(tool.name)\`** — declarative deny rules (OpenClaw-inspired).
2. Resolve **timeout** from the tool and \`default_timeout\`.
3. Optional **\`SafetyLayer.validate_tool_input\`** — block or flag arguments before run.
4. **\`tool.run\` / \`tool.arun\`** — internally validates kwargs against **\`args_schema\`** (Pydantic).
5. Optional **\`SafetyLayer.sanitize_tool_output\`** for string results.
6. Optional **\`post_state_hook\`** on the tool for state sidecars.
7. **\`ToolCallingRecord\`** appended (success or failure), with rolling retention.

**Retry and timeout**

| Constructor arg | Meaning |
|-----------------|---------|
| \`max_retries\` | Extra attempts after failure (default \`3\`) |
| \`retry_delay\` | Sleep between attempts (seconds) |
| \`default_timeout\` | Fallback if the tool has no \`timeout\` |

Retries skip obvious non-retriable cases (e.g. \`ToolTimeoutError\`).

**Related**

- \`ApprovalRequiredError\` bubbles out without being treated as a generic failure.
- \`sandbox_config: SandboxConfig\` enables advanced backends (\`subprocess\`, \`microsandbox\`, \`docker\`) for code execution helpers on the same class.

---

## Credential management

**\`CredentialStore\`** (\`agenticx.tools.credentials\`) stores encrypted key–value material under \`~/.agenticx/credentials\` by default (Fernet when \`cryptography\` is installed). Use it for API keys and tokens that tools or MCP \`env\` maps need at runtime.

**\`SecurityManager\`** (\`agenticx.core.security\`) also embeds a \`CredentialStore\` for higher-level permission and audit integration.

!!! warning "Filesystem permissions"
    Encryption keys live beside the store (\`encryption.key\`). Ensure user-only permissions on \`~/.agenticx\` on shared machines.

---

## Sandbox integration

**\`SandboxConfig\`** (\`agenticx.tools.executor\`) selects a backend for advanced runs:

| Backend | Isolation |
|---------|-----------|
| \`subprocess\` | Separate OS process |
| \`microsandbox\` | Sandboxed runtime (when available) |
| \`docker\` | Container isolation |
| \`auto\` | Resolver picks a implementation |

**\`SandboxPolicy\`** (\`agenticx.safety.sandbox_policy\`) recommends backends from **risk level** or **tool name heuristics**:

| Inferred / assigned risk | Suggested backend |
|--------------------------|-------------------|
| \`LOW\` | No forced backend (\`None\`) |
| \`MEDIUM\` | \`subprocess\` |
| \`HIGH\` / \`CRITICAL\` | \`docker\` |

Optional **\`ToolRiskProfile\`** entries override inference per \`tool_name\` (\`force_backend\`, \`network_enabled\`, \`max_timeout\`).

!!! tip "Align policy with executor"
    Use \`SandboxPolicy.recommend()\` to build or tune a \`SandboxConfig\` for \`ToolExecutor\`; keep high-risk tools on stronger isolation even if default Studio tools run in the workspace process.
`,
  },
  zh: {
    title: '工具',
    description: 'AgenticX 工具系统概览与用法。',
    content: `# 工具

## 概览

工具是语言模型与运行环境之间的契约。在 AgenticX 中，它们位于**智能体推理**与**副作用**之间：文件系统、Shell、MCP 服务器、由规范生成的 REST 调用以及打包的技能。运行时收集工具 schema 供模型使用，将 \`tool_calls\` 路由到具体实现，并通过统一的策略、安全与审计钩子执行。

| 关注点 | 主要组件 |
|--------|----------|
| 声明工具 | \`@tool\`、\`FunctionTool\`、\`BaseTool\` 子类 |
| Studio / 工作区 | \`STUDIO_TOOLS\`（OpenAI 风格 function schema + 分发） |
| 外部 MCP | \`MCPHub\`、\`MCPClientV2\`、\`RemoteTool\` |
| 规范驱动 HTTP API | \`OpenAPIToolset\` |
| 技能包 | \`SkillBundleLoader\`、\`SkillTool\` |
| 执行 | \`ToolExecutor\`（\`agenticx.tools.executor\`） |
| 隔离提示 | \`SandboxPolicy\`、\`SandboxConfig\` |

!!! note "命名说明"
    公开 Python API 位于 \`agenticx.tools\` 与 \`agenticx.safety\`。部分旧版或适配层仍引用 \`agenticx.core.executor.ToolExecutor\`；下文所述沙箱、安全层与审计能力请优先使用 \`agenticx.tools.executor.ToolExecutor\`。

---

## \`@tool\` 装饰器

使用 \`agenticx.tools.function_tool.tool\` 将普通函数转为 \`FunctionTool\`（\`BaseTool\`）。

**参数**

| 参数 | 作用 |
|------|------|
| \`name\` | 暴露给模型的工具 id；默认为函数名 |
| \`description\` | 覆盖从 docstring 自动解析的摘要 |
| \`args_schema\` | 可选 Pydantic \`BaseModel\`；省略时根据类型注解与 docstring \`Args\` 构建 |
| \`timeout\` | 单工具超时（秒），与 executor 默认值合并 |
| \`organization_id\` | 可选租户范围，用于策略 / 存储 |

**行为**

- 解析 docstring（短描述、长描述、各参数说明）。
- 将参数映射为 Pydantic 模型，用于导出 JSON Schema 与运行时校验。

\`\`\`python
from agenticx.tools.function_tool import tool

@tool(name="add", description="Add two integers.", timeout=5.0)
def add(a: int, b: int) -> int:
    """Add a and b.

    Args:
        a: First operand.
        b: Second operand.
    """
    return a + b
\`\`\`

!!! tip "显式 schema"
    若需稳定的对外契约，请传入专用 Pydantic 模型的 \`args_schema=\`，而非仅依赖类型推断。

---

## 内置 Studio 工具

Studio 会话使用 \`agenticx.cli.agent_tools\` 中的 \`STUDIO_TOOLS\`：一组 OpenAI 风格 \`function\` 定义，绑定异步 handler。核心类别：

| 名称 | 用途 |
|------|------|
| \`bash_exec\` | 在工作区执行 Shell 命令（含守卫与确认流程） |
| \`file_read\` | 读取文件内容，可选行范围 |
| \`file_write\` | diff 预览与用户确认后整文件写入 |
| \`file_edit\` | diff 预览与用户确认后局部替换 |
| \`list_files\` | 列出工作区文件 |
| \`codegen\` | 驱动代码生成引擎（agent / workflow / tool / skill 目标） |
| \`mcp_connect\`、\`mcp_call\`、\`mcp_import\` | 连接 MCP 服务器、调用工具、导入外部 MCP JSON |
| \`skill_use\`、\`skill_list\` | 激活或枚举技能包 |
| \`todo_write\` | 会话结构化任务列表 |
| \`scratchpad_read\`、\`scratchpad_write\` | 会话草稿板 |
| \`memory_append\`、\`memory_search\` | 轻量记忆辅助 |
| \`lsp_goto_definition\`、\`lsp_find_references\`、\`lsp_hover\`、\`lsp_diagnostics\` | LSP 导航与诊断 |

仅 Meta 可用的工具（委派、资源检查等）单独定义（\`META_AGENT_TOOLS\`）；分身通常获得上述 Studio 子集。

!!! warning "破坏性写入"
    \`file_write\` 与 \`file_edit\` 设计为需确认的流程。自动化也应遵守 Studio 服务端相同的 UX 保障。

---

## MCP Hub

\`MCPHub\`（\`agenticx.tools.mcp_hub\`）聚合多个 MCP 服务器：

- **\`MCPClientV2\`**：每个 \`MCPServerConfig\` 一个客户端，持久会话，\`discover_tools()\` / \`call_tool()\`。
- **\`discover_all_tools()\`**：合并工具列表并构建**路由表**（名称冲突时用前缀路由名处理）。
- **\`get_tools_for_agent()\`**：当 \`auto_mode=True\` 时返回可注入的 \`MCPHubTool\` 实例（\`BaseTool\`）。
- **\`MCPHubConfig\`**：Pydantic 模型，含 \`servers: List[MCPServerConfig]\` 与 \`auto_mode\`。

\`\`\`python
from agenticx.tools.mcp_hub import MCPHub, MCPHubConfig
from agenticx.tools.remote_v2 import MCPServerConfig

config = MCPHubConfig(
    servers=[
        MCPServerConfig(name="docs", command="npx", args=["-y", "@some/mcp-server"]),
    ],
    auto_mode=True,
)
# hub = MCPHub.from_config(config)  # then await hub.discover_all_tools()
\`\`\`

**配置文件**

- \`agenticx.tools.remote\` 中的 \`load_mcp_config()\` 读取 JSON 文件（默认 \`~/.cursor/mcp.json\`）为 \`Dict[str, MCPServerConfig]\`。
- 可在项目本地维护相同结构（例如 \`mcp_config.json\`），并显式传入路径加载。

!!! note "传输层"
    \`MCPHub\` / \`MCPClientV2\` 内置 MCP 客户端路径以 **stdio** 为主（子进程）。HTTP 或 SSE MCP 端点通常需本地命令或代理转为 stdio 与 AgenticX 通信。

---

## 远程工具

AgenticX **不提供**名为 \`RemoteToolProvider\` 的类。远程能力建模如下：

| 类型 | 用途 |
|------|------|
| \`RemoteTool\` | 包装单个 MCP 工具的 \`BaseTool\`，绑定 \`MCPServerConfig\` |
| \`MCPClient\` | 旧版客户端，列出工具并构造 \`RemoteTool\` |
| \`MCPClientV2\` | 推荐的基于会话的客户端；\`MCPHub\` 内部使用 |

\`MCPServerConfig\` 字段包括 \`command\`、\`args\`、\`env\`、\`timeout\`、可选 \`cwd\`、\`enabled_tools\` 与 \`assign_to_agents\`（用于过滤）。

!!! tip "密钥"
    将 token 放在 \`MCPServerConfig\` 的 \`env\` 中，或在构建配置前从 \`CredentialStore\` 解析。

---

## OpenAPI 工具集

\`OpenAPIToolset\`（\`agenticx.tools.openapi_toolset\`）从 **OpenAPI 3.x** 或 **Swagger 2.0** 构建 \`BaseTool\` 实例：

- \`OpenAPIToolset.from_file(path)\`
- \`OpenAPIToolset.from_url(url)\`

各 operation 成为可调用工具，带生成的参数模型与按规范执行的 HTTP 请求。

!!! warning "鉴权与副作用"
    生成的工具会发起真实 HTTP 请求。请限制 base URL、固定 spec 并谨慎提供凭据——应像生产 API 客户端一样对待。

---

## 技能包

技能遵循 Anthropic 风格 \`SKILL.md\` 布局与 YAML front matter。**\`SkillBundleLoader\`**（\`agenticx.tools.skill_bundle\`）扫描标准路径（\`.agents/skills\`、\`.agent/skills\`、\`~/.agents/skills\`、\`.claude/skills\`、包内置等），应用可选 **\`SkillGate\`** 规则（\`metadata.agenticx.gate\`），并将技能暴露为工具（如 **\`SkillTool\`**）以支持列表/读取与渐进披露。

**会话级注入**

- Studio 中 \`skill_use\` / \`skill_list\` 与 loader 联动，激活的技能影响当前会话上下文。
- \`SkillBundleLoader\` 接受 \`execution_backend\`，运行技能载荷时可走沙箱或替代执行路径。

!!! note "SkillBundle 与 loader"
    代码以 \`SkillBundleLoader\` 与 \`SkillMetadata\` 为中心；没有单独的 \`SkillBundle\` 类。概念上的「bundle」指从配置搜索路径加载的技能集合。

AGX Bundle 安装也会落在 **\`~/.agenticx/skills/bundles/\`**，该路径自动纳入扫描，无需额外配置即可发现 bundled 技能。

---

## AGX Bundle

**AGX Bundle**（\`agenticx.extensions\`）是可分发目录包，将 Skills、MCP 服务器配置、Avatar 预设与 Memory 模板组合为单一单元。

\`\`\`
my-bundle/
├── agx-bundle.yaml
├── skills/
│   └── my-skill/SKILL.md
├── mcp/
│   └── server.json
├── avatars/
│   └── preset.yaml
└── memory/
    └── template.md
\`\`\`

**关键模块：**

| 模块 | 用途 |
|------|------|
| \`agenticx.extensions.bundle\` | 解析 \`agx-bundle.yaml\`，强制安全相对路径 |
| \`agenticx.extensions.installer\` | 安装/卸载 bundle，管理 \`~/.agenticx/bundles.json\` |
| \`agenticx.extensions.registry_hub\` | 多源市场搜索与安装 |

**快速安装：**

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle

result = install_bundle(Path("./my-bundle"))
print(result.skills_installed, result.mcp_servers_installed)
\`\`\`

详见 [扩展与技能生态](/docs/guides/extensions)，含 AGX Bundle 格式、市场配置与 Desktop UI  walkthrough。

---

## 工具执行器

\`ToolExecutor\`（\`agenticx.tools.executor\`）是 \`BaseTool\` 实例的共享执行流水线。

**典型流程（\`execute\` / \`aexecute\`）**

1. 可选 **\`policy_stack.check(tool.name)\`** — 声明式拒绝规则（受 OpenClaw 启发）。
2. 从工具与 \`default_timeout\` 解析**超时**。
3. 可选 **\`SafetyLayer.validate_tool_input\`** — 运行前拦截或标记参数。
4. **\`tool.run\` / \`tool.arun\`** — 内部按 **\`args_schema\`**（Pydantic）校验 kwargs。
5. 可选对字符串结果执行 **\`SafetyLayer.sanitize_tool_output\`**。
6. 工具上可选 **\`post_state_hook\`** 处理状态 sidecar。
7. 追加 **\`ToolCallingRecord\`**（成功或失败），滚动保留。

**重试与超时**

| 构造参数 | 含义 |
|----------|------|
| \`max_retries\` | 失败后额外尝试次数（默认 \`3\`） |
| \`retry_delay\` | 重试间隔（秒） |
| \`default_timeout\` | 工具未设 \`timeout\` 时的回退值 |

明显不可重试的情况（如 \`ToolTimeoutError\`）会跳过重试。

**相关**

- \`ApprovalRequiredError\` 会直接抛出，不按普通失败处理。
- 同一类上的 \`sandbox_config: SandboxConfig\` 可为代码执行辅助启用高级后端（\`subprocess\`、\`microsandbox\`、\`docker\`）。

---

## 凭据管理

**\`CredentialStore\`**（\`agenticx.tools.credentials\`）默认在 \`~/.agenticx/credentials\` 下存储加密的键值材料（安装 \`cryptography\` 时使用 Fernet）。供工具或 MCP \`env\` 映射在运行时需要的 API 密钥与 token。

**\`SecurityManager\`**（\`agenticx.core.security\`）也内嵌 \`CredentialStore\`，用于更高层的权限与审计集成。

!!! warning "文件系统权限"
    加密密钥与存储目录相邻（\`encryption.key\`）。共享机器上请确保 \`~/.agenticx\` 仅当前用户可访问。

---

## 沙箱集成

**\`SandboxConfig\`**（\`agenticx.tools.executor\`）为高级运行选择后端：

| 后端 | 隔离 |
|------|------|
| \`subprocess\` | 独立 OS 进程 |
| \`microsandbox\` | 沙箱运行时（可用时） |
| \`docker\` | 容器隔离 |
| \`auto\` | 解析器自动选择实现 |

**\`SandboxPolicy\`**（\`agenticx.safety.sandbox_policy\`）根据**风险等级**或**工具名启发式**推荐后端：

| 推断/指定风险 | 建议后端 |
|---------------|----------|
| \`LOW\` | 不强制后端（\`None\`） |
| \`MEDIUM\` | \`subprocess\` |
| \`HIGH\` / \`CRITICAL\` | \`docker\` |

可选 **\`ToolRiskProfile\`** 按 \`tool_name\` 覆盖推断（\`force_backend\`、\`network_enabled\`、\`max_timeout\`）。

!!! tip "策略与执行器对齐"
    用 \`SandboxPolicy.recommend()\` 构建或调优 \`ToolExecutor\` 的 \`SandboxConfig\`；即使默认 Studio 工具在工作区进程内运行，高风险工具仍应使用更强隔离。
`,
  },
};
