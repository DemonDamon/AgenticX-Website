export const hooksContent = {
  en: {
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
  },
  zh: {
    title: '钩子',
    description: 'AgenticX 钩子系统。',
    content: `# 钩子系统

## 概述

AgenticX 为不同执行面暴露 **两层钩子**：

| 层级 | 包路径 | 用途 |
|-------|--------------|---------|
| **Core hooks** | \`agenticx/core/hooks/\` | 围绕 **LLM** 与 **工具** 调用的同步拦截 |
| **Runtime hooks** | \`agenticx/runtime/hooks/\` | 挂载于 **\`AgentRuntime\`** 的 **异步** 生命周期钩子 |

---

## Core Hooks（\`agenticx/core/hooks/\`）

Core hooks 是普通 **callable**，可在 **全局** 或 **\`Agent\`** 实例上注册。

### LLM 钩子

上下文类型：**\`LLMCallHookContext\`**。

**调用前字段：**

| 字段 | 说明 |
|-------|-------------|
| \`agent_id\` | 智能体标识 |
| \`task_id\` | 可选任务 ID |
| \`messages\` | 消息列表（可原地修改） |
| \`model\` | 可选模型名 |
| \`temperature\` | 可选采样温度 |
| \`max_tokens\` | 可选 token 上限 |
| \`iteration\` | 循环迭代索引 |

**注册方式：**

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

### 工具钩子

上下文类型：**\`ToolCallHookContext\`**。

**调用前字段：**

| 字段 | 说明 |
|-------|-------------|
| \`agent_id\` | 智能体标识 |
| \`tool_name\` | 被调用的工具名 |
| \`tool_args\` | 参数字典（可原地修改） |
| \`iteration\` | 循环迭代 |

---

## Runtime Hooks（\`agenticx/runtime/hooks/\`）

Runtime hooks 是 **\`AgentHook\`** 子类上的 **async** 方法，由 **\`HookRegistry\`** 协调调度。

### \`AgentHook\` 基类

| 方法 | 职责 |
|--------|------|
| \`before_model(messages, session)\` | LLM 调用前转换消息序列 |
| \`after_model(response, session)\` | 模型返回后观察或产生副作用 |
| \`before_tool_call(tool_name, arguments, session)\` | 返回 \`HookOutcome(blocked=True)\` 可否决调用 |
| \`after_tool_call(tool_name, result, session)\` | 替换工具返回字符串 |
| \`on_compaction(compacted_count, summary, session)\` | 上下文压缩完成后 |
| \`on_agent_end(final_text, session)\` | 智能体轮次结束 |

### \`HookOutcome\`

\`\`\`python
@dataclass
class HookOutcome:
    blocked: bool = False
    reason: str = ""
\`\`\`

### 示例：拦截工具

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

## Core 与 Runtime 钩子对比

| 维度 | Core | Runtime |
|--------|------|---------|
| **执行模型** | 同步 callable | \`AgentHook\` 上的 \`async\` 方法 |
| **拦截 LLM** | \`before\` 钩子返回 \`False\` | 在 \`before_model\` 中转换 |
| **拦截工具** | \`before\` 钩子返回 \`False\` | \`HookOutcome(blocked=True)\` |
| **注册表** | 模块级列表 + \`Agent.llm_hooks\` | 带数值优先级的 \`HookRegistry\` |
| **典型用途** | 日志、策略、改写 | 流式生命周期、记忆钩子 |
`,
  },
};
