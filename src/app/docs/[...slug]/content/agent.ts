export const agentContent = {
  title: 'Agent Runtime',
  description: 'Agent runtime execution in AgenticX.',
  content: `# Agent runtime

This page describes the **\`AgentRuntime\`** execution path in AgenticX: the think-act loop, event stream, timeouts, confirmation gates, compaction, loop detection, and hook points.

---

## Agent definition (\`Agent\` model)

The primary agent record is \`agenticx.core.agent.Agent\` (Pydantic \`BaseModel\`). Fields commonly used for persona and tenancy:

| Field | Type | Notes |
|-------|------|-------|
| \`id\` | \`str\` | Defaults to a new UUID if omitted. |
| \`name\` | \`str\` | Display name. |
| \`role\` | \`str\` | Role description for prompts. |
| \`goal\` | \`str\` | Primary objective. |
| \`backstory\` | \`str | None\` | Optional persona context. |
| \`organization_id\` | \`str\` | Multi-tenant namespace; default \`"default-org"\`. |

The model also carries tools, LLM hooks, \`max_iterations\` (default **25**), \`max_retry_limit\`, and related configuration.

---

## Running an agent (\`AgentExecutor\`)

\`agenticx.core.agent_executor.AgentExecutor\` is the control-flow engine for **\`Agent\` + \`Task\`**: it builds prompts, calls the configured \`BaseLLMProvider\`, parses actions, runs \`BaseTool\` instances, applies GuideRails, and can compact context.

Typical usage:

\`\`\`python
from agenticx.core.agent import Agent
from agenticx.core.agent_executor import AgentExecutor
from agenticx.core.task import Task
from agenticx.llms import OpenAIProvider

agent = Agent(
    name="Research Assistant",
    role="Analyst",
    goal="Summarize findings",
    organization_id="my-org",
)
task = Task(
    id="t1",
    description="Research topic X",
    expected_output="Short report",
)
executor = AgentExecutor(llm_provider=OpenAIProvider(model="gpt-4o"))
result = executor.run(agent=agent, task=task)
\`\`\`

---

## The think-act loop (\`AgentRuntime.run_turn\`)

Each user turn runs **\`AgentRuntime.run_turn\`**, which loops at most **\`max_tool_rounds\`** times. One round is:

1. **Message sanitization** — Repairs history so every \`assistant\` message with \`tool_calls\` is followed by matching \`tool\` rows.
2. **Context compaction** — \`ContextCompactor.maybe_compact\` may replace older history with a single \`system\` summary message.
3. **LLM call** — If \`llm.stream_with_tools\` exists and succeeds, the runtime streams content and tool_call_delta chunks.
4. **Tool-call filtering** — Parsed \`tool_calls\` drop empty names.
5. **Tool dispatch** — For each call: \`run_before_tool_call\` may block. Unknown tools produce error results.
6. **Loop detection** — After each executed tool, \`LoopDetector.record_call\` / \`check\` run.

---

## Runtime event stream (\`EventType\`)

| \`EventType\` | Value | Role |
|---------------|--------|------|
| \`ROUND_START\` | \`round_start\` | New tool round |
| \`TOKEN\` | \`token\` | Streamed model text |
| \`TOOL_CALL\` | \`tool_call\` | Tool name, arguments |
| \`TOOL_RESULT\` | \`tool_result\` | Tool output string |
| \`CONFIRM_REQUIRED\` | \`confirm_required\` | Tool asks for confirmation |
| \`COMPACTION\` | \`compaction\` | History was compacted |
| \`FINAL\` | \`final\` | Terminal natural-language reply |
| \`ERROR\` | \`error\` | Failure, timeout, or abort |

---

## Timeout configuration

| Variable | Default | Role |
|----------|---------|------|
| \`AGX_LLM_INVOKE_TIMEOUT_SECONDS\` | **120** | Idle budget before the first streamed chunk |
| \`AGX_LLM_HEARTBEAT_TIMEOUT_SECONDS\` | **60** | Max idle time between streamed chunks |
| \`AGX_LLM_HARD_TIMEOUT_SECONDS\` | **300** | Wall-clock cap for the streaming worker |

---

## Confirm gate

| Class | Behavior |
|-------|-----------|
| **\`ConfirmGate\`** | Abstract \`request_confirm(question, context) -> bool\`. |
| **\`SyncConfirmGate\`** | Blocking \`input()\`; for CLI. |
| **\`AsyncConfirmGate\`** | Publishes a pending \`Future\`; server/UI resolves. |
| **\`AutoApproveConfirmGate\`** | Always returns \`True\`. |

---

## Context compaction

**\`ContextCompactor.maybe_compact\`**:

- Triggers when history length > \`threshold_messages\` (default **20**) **or** total character count > \`threshold_chars\` (default **48,000**).
- Keeps the last **\`retain_recent_messages\`** messages (default **8**).
- Summarizes the prefix via \`llm.invoke\` on a compaction prompt.

---

## Loop detection

**\`LoopDetector\`** tracks recent \`(tool_name, args_signature)\` pairs:

- **generic_repeat** — same tool + same arguments repeated.
- **ping_pong** — alternating pattern on the tail.
- **no_progress** — many calls without progress.

**Warning** adds a reminder message; **critical** stops the run with **\`ERROR\`**.

---

## Related

- [Orchestration](orchestration.md) — multi-step workflows and coordination.
- [Tools](tools.md) — tool definitions and dispatch.
- [Memory](memory.md) — long-horizon recall and hooks.
`,
};
