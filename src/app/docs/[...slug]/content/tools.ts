export const toolsContent = {
  title: 'Tools',
  description: 'Tool system in AgenticX.',
  content: `# Tools

## Overview

Tools are the contract between language models and your environment. In AgenticX they sit between **agent reasoning** and **side effects**: filesystem, shell, MCP servers, generated REST calls, and packaged skills.

| Concern | Primary components |
|--------|---------------------|
| Declaring tools | \`@tool\`, \`FunctionTool\`, \`BaseTool\` subclasses |
| Studio / workspace | \`STUDIO_TOOLS\` (OpenAI-style function schemas + dispatch) |
| External MCP | \`MCPHub\`, \`MCPClientV2\`, \`RemoteTool\` |
| Spec-driven HTTP APIs | \`OpenAPIToolset\` |
| Skill packages | \`SkillBundleLoader\`, \`SkillTool\` |
| Execution | \`ToolExecutor\` |

---

## \`@tool\` decorator

Use \`agenticx.tools.function_tool.tool\` to turn a plain function into a \`FunctionTool\` (\`BaseTool\`).

**Parameters**

| Parameter | Role |
|-----------|------|
| \`name\` | Tool id exposed to the model; defaults to the function name |
| \`description\` | Overrides auto-parsed docstring summary |
| \`args_schema\` | Optional Pydantic \`BaseModel\` for parameter validation |
| \`timeout\` | Per-tool timeout (seconds) |
| \`organization_id\` | Optional tenant scope |

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

---

## Built-in Studio tools

Studio sessions use \`STUDIO_TOOLS\`: a list of OpenAI-style \`function\` definitions wired to async handlers:

| Name | Purpose |
|------|---------|
| \`bash_exec\` | Run shell commands in the workspace |
| \`file_read\` | Read file content with optional line range |
| \`file_write\` | Full-file write after diff preview and confirmation |
| \`file_edit\` | Targeted replace after diff preview and confirmation |
| \`list_files\` | List workspace files |
| \`codegen\` | Drive the code generation engine |
| \`mcp_connect\`, \`mcp_call\`, \`mcp_import\` | Connect to MCP servers, invoke tools |
| \`skill_use\`, \`skill_list\` | Activate or enumerate skill bundles |
| \`todo_write\` | Structured task list for the session |
| \`scratchpad_read\`, \`scratchpad_write\` | Session scratchpad |
| \`memory_append\`, \`memory_search\` | Lightweight memory helpers |

---

## MCP Hub

\`MCPHub\` aggregates multiple MCP servers:

- **\`MCPClientV2\`**: one client per \`MCPServerConfig\`, persistent session
- **\`discover_all_tools()\`**: merges tool lists and builds a routing table
- **\`get_tools_for_agent()\`**: returns \`MCPHubTool\` instances ready for injection

\`\`\`python
from agenticx.tools.mcp_hub import MCPHub, MCPHubConfig
from agenticx.tools.remote_v2 import MCPServerConfig

config = MCPHubConfig(
    servers=[
        MCPServerConfig(name="docs", command="npx", args=["-y", "@some/mcp-server"]),
    ],
    auto_mode=True,
)
\`\`\`

---

## OpenAPI toolset

\`OpenAPIToolset\` builds \`BaseTool\` instances from **OpenAPI 3.x** or **Swagger 2.0**:

- \`OpenAPIToolset.from_file(path)\`
- \`OpenAPIToolset.from_url(url)\`

Operations become callable tools with generated parameter models and HTTP execution.

---

## Tool executor

\`ToolExecutor\` is the shared execution pipeline for \`BaseTool\` instances:

1. Optional **\`policy_stack.check(tool.name)\`** — declarative deny rules
2. Resolve **timeout** from the tool and \`default_timeout\`
3. Optional **\`SafetyLayer.validate_tool_input\`** — block or flag arguments
4. **\`tool.run\` / \`tool.arun\`** — validates kwargs against \`args_schema\`
5. Optional **\`SafetyLayer.sanitize_tool_output\`**
6. **\`ToolCallingRecord\`** appended with rolling retention

---

## Credential management

**\`CredentialStore\`** stores encrypted key–value material under \`~/.agenticx/credentials\` by default (Fernet when \`cryptography\` is installed).

---

## Sandbox integration

**\`SandboxConfig\`** selects a backend for advanced runs:

| Backend | Isolation |
|---------|-----------|
| \`subprocess\` | Separate OS process |
| \`microsandbox\` | Sandboxed runtime |
| \`docker\` | Container isolation |
| \`auto\` | Resolver picks implementation |

| Risk Level | Suggested backend |
|------------|-------------------|
| \`LOW\` | No forced backend |
| \`MEDIUM\` | \`subprocess\` |
| \`HIGH\` / \`CRITICAL\` | \`docker\` |
`,
};
