export const quickstartContent = {
  en: {
    title: 'Quick Start',
    description: 'Run an agent from Python, or start the local Studio server Near talks to.',
    content: `# Quick Start

Two valid first runs. Pick one. They are not the same loop.

| Path | Entry | Loop |
|------|-------|------|
| **SDK** | \`Agent\` + \`Task\` + \`AgentExecutor\` | Classic task executor in \`agenticx/core/agent_executor.py\` |
| **Studio / Near** | \`agx serve\` then the desktop app | \`AgentRuntime.run_turn\` in \`agenticx/runtime/agent_runtime.py\` |

!!! note "Do not mix constructor arguments"
    \`AgentExecutor\` takes \`llm_provider=\`, not \`llm=\` or \`agent=\`. You pass the agent into \`run(agent=, task=)\`.

![SDK executor versus Studio SSE](/docs/svg/quickstart-paths-en.svg?v=2)

*Diagram: two first runs — AgentExecutor.run returns a dict; Studio streams SSE.*

## Path A — embed in Python

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider
from agenticx.tools.function_tool import tool

@tool(name="add", description="Add two integers.")
def add(a: int, b: int) -> int:
    return a + b

agent = Agent(
    name="Analyst",
    role="Data analysis helper",
    goal="Answer numeric questions",
    organization_id="my-org",
)
task = Task(
    id="sum-1",
    description="What is 42 + 58?",
    expected_output="The integer sum",
)

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[add],
)
result = executor.run(agent=agent, task=task)
print(result)
\`\`\`

You need a working provider key in the environment. Details: [Agent Runtime](/docs/concepts/agent), [Tools](/docs/concepts/tools).

## Path B — local Studio for Near

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

Desktop usually spawns this for you on \`127.0.0.1\` with an ephemeral port, then writes \`~/.agenticx/serve.port\` and \`~/.agenticx/serve.token\`. If you start it yourself, Near must point at that host and port.

\`agx studio\` is the **terminal REPL**, not the FastAPI process. See [Studio Server](/docs/guides/studio).

## Path C — one-shot CLI

\`\`\`bash
agx run "Summarize what AgenticX is in two sentences"
\`\`\`

Use this to check that the provider config works before opening the desktop UI.

## If nothing happens

1. \`agx --version\` fails → package not on this \`PATH\`
2. Provider 401 → key missing or wrong env
3. Desktop empty avatars / history → \`agx serve\` is not listening (check \`~/.agenticx/serve.port\`)
4. Tool loop stops early → raise \`runtime.max_tool_rounds\` / \`AGX_MAX_TOOL_ROUNDS\` in [Configuration](/docs/getting-started/configuration)

## Next

- [Configuration →](/docs/getting-started/configuration)
- [Architecture →](/docs/concepts/architecture)
- [Building Your First Agent →](/docs/guides/first-agent)
`,
  },
  zh: {
    title: '快速上手',
    description: '用 Python 跑一个智能体，或启动 Near 连接的本机 Studio。',
    content: `# 快速上手

两条都成立的第一次运行，选一条。它们不是同一套循环。

| 路径 | 入口 | 循环 |
|------|------|------|
| **SDK** | \`Agent\` + \`Task\` + \`AgentExecutor\` | \`agenticx/core/agent_executor.py\` 里的经典任务执行器 |
| **Studio / Near** | \`agx serve\` 再开桌面 | \`agenticx/runtime/agent_runtime.py\` 的 \`AgentRuntime.run_turn\` |

!!! note "不要混构造参数"
    \`AgentExecutor\` 收 \`llm_provider=\`，不是 \`llm=\` 或 \`agent=\`。智能体要传给 \`run(agent=, task=)\`。

![SDK 执行器与 Studio SSE](/docs/svg/quickstart-paths-zh.svg?v=2)

*示意图：两条第一次运行——AgentExecutor.run 返回 dict；Studio 推 SSE。*

## 路径 A — 嵌进 Python

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider
from agenticx.tools.function_tool import tool

@tool(name="add", description="Add two integers.")
def add(a: int, b: int) -> int:
    return a + b

agent = Agent(
    name="Analyst",
    role="Data analysis helper",
    goal="Answer numeric questions",
    organization_id="my-org",
)
task = Task(
    id="sum-1",
    description="What is 42 + 58?",
    expected_output="The integer sum",
)

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[add],
)
result = executor.run(agent=agent, task=task)
print(result)
\`\`\`

环境里要有能用的供应商密钥。细节见 [智能体运行时](/docs/concepts/agent)、[工具](/docs/concepts/tools)。

## 路径 B — 给 Near 用的本机 Studio

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

桌面端通常会自己在 \`127.0.0.1\` 上拉起，端口随机，并写入 \`~/.agenticx/serve.port\` 与 \`~/.agenticx/serve.token\`。若你自己起服务，Near 必须指到这个地址。

\`agx studio\` 是**终端 REPL**，不是 FastAPI 进程。见 [Studio 服务](/docs/guides/studio)。

## 路径 C — 一次性 CLI

\`\`\`bash
agx run "用两句话说明 AgenticX 是什么"
\`\`\`

适合在开桌面之前先确认供应商配置能通。

## 如果没反应

1. \`agx --version\` 失败 → 当前 \`PATH\` 里没有这个包
2. 供应商 401 → 密钥没配或环境变量不对
3. 桌面分身 / 历史全空 → \`agx serve\` 没在听（看 \`~/.agenticx/serve.port\`）
4. 工具循环过早停 → 在 [配置](/docs/getting-started/configuration) 里调大 \`runtime.max_tool_rounds\` / \`AGX_MAX_TOOL_ROUNDS\`

## 下一步

- [配置 →](/docs/getting-started/configuration)
- [架构 →](/docs/concepts/architecture)
- [第一个智能体 →](/docs/guides/first-agent)
`,
  },
};
