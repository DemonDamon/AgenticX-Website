export const apiAgentsContent = {
  en: {
    title: 'Agents API',
    description: 'Agent, Task, and AgentExecutor public fields.',
    content: `# agenticx.core — Agent API

This page is the **SDK** surface in \`agenticx.core\`. Near / Studio chat uses \`AgentRuntime\`, not this executor. Source lives under \`agenticx/core/\`, not \`agenticx/agents/\`.

\`\`\`mermaid
flowchart LR
  agent["Agent"] --> run["AgentExecutor.run"]
  task["Task"] --> run
  llm["llm_provider"] --> exec["AgentExecutor"]
  tools["tools"] --> exec
  exec --> run
  run --> result["dict result"]
\`\`\`

---

## Agent

\`agenticx.core.agent.Agent\` (Pydantic). Common fields:

| Field | Type | Notes |
|-------|------|-------|
| \`id\` | \`str\` | UUID if omitted |
| \`name\` / \`role\` / \`goal\` | \`str\` | Required persona |
| \`backstory\` | \`str \\| None\` | Optional |
| \`organization_id\` | \`str\` | Default \`"default-org"\` |
| \`tools\` | \`list\` | Bound \`BaseTool\` instances |
| \`max_iterations\` | \`int\` | Default **25**. There is **no** \`max_iter\` or \`verbose\` |

---

## Task

\`agenticx.core.task.Task\`:

| Field | Type | Notes |
|-------|------|-------|
| \`id\` | \`str\` | UUID if omitted |
| \`description\` | \`str\` | Required |
| \`expected_output\` | \`str\` | What “done” looks like |
| \`agent_id\` | \`str \\| None\` | Optional assignment |
| \`context\` | \`dict\` | Extra context |
| \`dependencies\` | \`list[str]\` | Other task IDs |

---

## AgentExecutor

Construct with a provider. Pass the agent at **run** time.

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider
from agenticx.tools import tool

@tool
def echo(text: str) -> str:
    """Return the input text."""
    return text

agent = Agent(
    name="Assistant",
    role="Helper",
    goal="Assist users",
    tools=[echo],
)
task = Task(description="Say hello", expected_output="A short greeting")

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[echo],
    max_iterations=50,
)
result = executor.run(agent=agent, task=task)
\`\`\`

\`__init__\` also accepts \`prompt_manager\`, \`compaction_config\`, \`enable_context_compilation\`, \`execution_lane\`. It does **not** take \`agent=\`, \`llm=\`, \`memory=\`, or \`human_in_the_loop=\`.

\`run(agent, task, session_key=None)\` returns a **dict**. Concurrent calls with the same \`session_key\` serialize when an \`ExecutionLane\` is set.

---

## Tool decorator

\`\`\`python
from agenticx.tools import tool

@tool
def my_tool(param: str) -> str:
    """One-line description.

    Args:
        param: What the argument is
    """
    return f"Processed: {param}"
\`\`\`

See [Tools](/docs/concepts/tools) and [Agent runtime](/docs/concepts/agent).
`,
  },
  zh: {
    title: 'Agents API',
    description: 'Agent、Task、AgentExecutor 公开字段。',
    content: `# agenticx.core — Agent API

本页是 \`agenticx.core\` 的 **SDK** 面。Near / Studio 对话走 \`AgentRuntime\`，不走这个执行器。源码在 \`agenticx/core/\`，不是 \`agenticx/agents/\`。

\`\`\`mermaid
flowchart LR
  agent["Agent"] --> run["AgentExecutor.run"]
  task["Task"] --> run
  llm["llm_provider"] --> exec["AgentExecutor"]
  tools["tools"] --> exec
  exec --> run
  run --> result["dict 结果"]
\`\`\`

---

## Agent

\`agenticx.core.agent.Agent\`（Pydantic）。常用字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| \`id\` | \`str\` | 省略则生成 UUID |
| \`name\` / \`role\` / \`goal\` | \`str\` | 必填人设 |
| \`backstory\` | \`str \\| None\` | 可选 |
| \`organization_id\` | \`str\` | 默认 \`"default-org"\` |
| \`tools\` | \`list\` | 绑定的 \`BaseTool\` |
| \`max_iterations\` | \`int\` | 默认 **25**。**没有** \`max_iter\` 或 \`verbose\` |

---

## Task

\`agenticx.core.task.Task\`：

| 字段 | 类型 | 说明 |
|------|------|------|
| \`id\` | \`str\` | 省略则生成 UUID |
| \`description\` | \`str\` | 必填 |
| \`expected_output\` | \`str\` | 「完成」长什么样 |
| \`agent_id\` | \`str \\| None\` | 可选指派 |
| \`context\` | \`dict\` | 额外上下文 |
| \`dependencies\` | \`list[str]\` | 其他任务 ID |

---

## AgentExecutor

构造时只传提供方。智能体在 **run** 时传入。

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider
from agenticx.tools import tool

@tool
def echo(text: str) -> str:
    """原样返回文本。"""
    return text

agent = Agent(
    name="Assistant",
    role="Helper",
    goal="Assist users",
    tools=[echo],
)
task = Task(description="Say hello", expected_output="一句短问候")

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[echo],
    max_iterations=50,
)
result = executor.run(agent=agent, task=task)
\`\`\`

\`__init__\` 还可收 \`prompt_manager\`、\`compaction_config\`、\`enable_context_compilation\`、\`execution_lane\`。**不收** \`agent=\`、\`llm=\`、\`memory=\`、\`human_in_the_loop=\`。

\`run(agent, task, session_key=None)\` 返回 **dict**。配置了 \`ExecutionLane\` 时，相同 \`session_key\` 的并发调用会串行。

---

## Tool 装饰器

\`\`\`python
from agenticx.tools import tool

@tool
def my_tool(param: str) -> str:
    """一句话说明。

    Args:
        param: 参数含义
    """
    return f"Processed: {param}"
\`\`\`

见 [工具](/docs/concepts/tools) 与 [智能体运行时](/docs/concepts/agent)。
`,
  },
};
