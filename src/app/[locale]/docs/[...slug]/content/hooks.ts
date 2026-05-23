export const hooksContent = {
  title: 'Hooks',
  description: 'Hook system in AgenticX.',
  content: `# Hook System

## Overview

AgenticX exposes **two hook layers** for different execution surfaces:

| Layer | Package path | Purpose |
|-------|--------------|---------|
| **Core hooks** | \`agenticx/core/hooks/\` | Synchronous interception around **LLM** and **tool** calls |
| **Runtime hooks** | \`agenticx/runtime/hooks/\` | **Async** lifecycle hooks on **\`AgentRuntime\`** |

---

## Core Hooks (\`agenticx/core/hooks/\`)

Core hooks are plain **callables** registered **globally** or on an **\`Agent\`** instance.

### LLM hooks

Context type: **\`LLMCallHookContext\`**.

**Before call fields:**

| Field | Description |
|-------|-------------|
| \`agent_id\` | Agent identifier |
| \`task_id\` | Optional task id |
| \`messages\` | Message list (may be mutated) |
| \`model\` | Optional model name |
| \`temperature\` | Optional sampling temperature |
| \`max_tokens\` | Optional cap |
| \`iteration\` | Loop iteration index |

**Registration:**

\`\`\`python
from agenticx.core.hooks import (
    LLMCallHookContext,
    register_before_llm_call_hook,
    register_after_llm_call_hook,
)

def log_before_llm(ctx: LLMCallHookContext) -> bool:
    # Mutate ctx.messages in place if needed
    return True  # False blocks the LLM call

register_before_llm_call_hook(log_before_llm)
\`\`\`

### Tool hooks

Context type: **\`ToolCallHookContext\`**.

**Before call fields:**

| Field | Description |
|-------|-------------|
| \`agent_id\` | Agent identifier |
| \`tool_name\` | Tool being invoked |
| \`tool_args\` | Argument dict (may be mutated) |
| \`iteration\` | Loop iteration |

---

## Runtime Hooks (\`agenticx/runtime/hooks/\`)

Runtime hooks are **async** methods on subclasses of **\`AgentHook\`**, coordinated by **\`HookRegistry\`**.

### \`AgentHook\` base class

| Method | Role |
|--------|------|
| \`before_model(messages, session)\` | Transform message sequence before LLM call |
| \`after_model(response, session)\` | Observe or side-effect after model returns |
| \`before_tool_call(tool_name, arguments, session)\` | Return \`HookOutcome(blocked=True)\` to veto |
| \`after_tool_call(tool_name, result, session)\` | Replace tool result string |
| \`on_compaction(compacted_count, summary, session)\` | After context compaction |
| \`on_agent_end(final_text, session)\` | End of agent turn |

### \`HookOutcome\`

\`\`\`python
@dataclass
class HookOutcome:
    blocked: bool = False
    reason: str = ""
\`\`\`

### Example: block a tool

\`\`\`python
from agenticx.runtime.hooks import AgentHook, HookOutcome

class DenyShellHook(AgentHook):
    async def before_tool_call(self, tool_name, arguments, session):
        if tool_name in {"run_terminal_cmd", "bash"}:
            return HookOutcome(blocked=True, reason="Shell tools disabled")
        return None

runtime.hooks.register(DenyShellHook(), priority=100)
\`\`\`

---

## Core vs Runtime hooks

| Aspect | Core | Runtime |
|--------|------|---------|
| **Execution model** | Synchronous callables | \`async\` methods on \`AgentHook\` |
| **Block LLM** | \`before\` hook returns \`False\` | Transform in \`before_model\` |
| **Block tool** | \`before\` hook returns \`False\` | \`HookOutcome(blocked=True)\` |
| **Registry** | Module-level lists + \`Agent.llm_hooks\` | \`HookRegistry\` with numeric priority |
| **Typical uses** | Logging, policy, rewriting | Streaming lifecycle, memory hooks |
`,
};
