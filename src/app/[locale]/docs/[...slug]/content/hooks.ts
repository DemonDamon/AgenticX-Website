export const hooksContent = {
  en: {
    title: 'Hooks',
    description: 'Hook system in AgenticX.',
    content: `# Hook System

Hooks intercept LLM and tool calls without forking the runtime. Use them for guardrails, logging, and policy. They are **not** skills and **not** MCP servers.

Two layers:

![Hook lifecycle with a confirm side door](/docs/svg/hooks-lifecycle-en.svg?v=2)

*Diagram: pre_tool_guard only runs if tool:before_call is dispatched.*

!!! warning "Dangerous shell"
    Bundled \`pre_tool_guard\` only fires if \`tool:before_call\` is actually dispatched. \`rm -rf\` matching must cover merged flags and must not fire on quoted commit messages.

## Worked example: confirm a risky shell

**Scene.** The model wants \`bash_exec\` on a destructive command.

1. Permissions are **Ask Every Time** or an allowlist that does not include this command.
2. Runtime emits \`tool:before_call\`. Bundled \`pre_tool_guard\` can block merged \`rm -rf\` flags. A quoted commit message must not match.
3. Near should show an **in-app** confirm (themed dialog), not a bare \`window.confirm\`. Choose Allow / Deny. \`Run Everything\` must stick — no second popup for the same class of call.

**What you should see.** A dialog over a folded \`bash_exec\` card, countdown if the gate has one. After deny, the tool result explains the block; the chat continues.

![In-app confirm over a shell tool card](/docs/cases/hooks-confirm.png)

*Illustration: themed confirm, not the OS default alert.*

---

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

钩子在不拆分运行时的前提下拦截 LLM 与工具调用，用来做护栏、日志和策略。它们**不是**技能，也**不是** MCP。

两层：

![钩子生命周期与确认岔路](/docs/svg/hooks-lifecycle-zh.svg?v=2)

*示意图：只有真正派发了 tool:before_call，pre_tool_guard 才会拦。*

!!! warning "危险 Shell"
    预置 \`pre_tool_guard\` 只有在真正派发了 \`tool:before_call\` 时才会拦。\`rm -rf\` 匹配要覆盖合并 flag，且不能误伤带引号的 commit message。

## 实践案例：确认一条危险 shell

**场景。** 模型要对一条破坏性命令走 \`bash_exec\`。

1. 权限是「每次询问」，或白名单里没有这条命令。
2. 运行时派发 \`tool:before_call\`。预置 \`pre_tool_guard\` 能拦合并写法的 \`rm -rf\`。带引号的 commit message 不应误伤。
3. Near 应弹出**应用内**主题化确认，而不是裸 \`window.confirm\`。选允许 / 拒绝。「全部自动执行」必须稳住，同类调用不应再弹第二次。

**你会看到。** 折叠的 \`bash_exec\` 卡上方有确认框，门控若带倒计时会显示。拒绝后工具结果说明原因，对话继续。

![工具卡上方的应用内确认](/docs/cases/hooks-confirm.png)

*界面示意：主题化确认，不是系统默认警报。*

---

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
