export const agentContent = {
  en: {
    title: 'Agent Runtime',
    description: 'Agent runtime execution in AgenticX.',
    content: `# Agent runtime

This page describes the **\`AgentRuntime\`** execution path in AgenticX (\`agenticx/runtime/agent_runtime.py\`): the think-act loop, event stream, timeouts, confirmation gates, compaction, loop detection, and hook points. It is distinct from the older **\`AgentExecutor\`** pipeline in \`agenticx/core/agent_executor.py\`, which uses its own event log and context compiler.

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

The model also carries tools, LLM hooks, \`max_iterations\` (default **25**), \`max_retry_limit\`, and related configuration. There is **no** \`verbose\` boolean on \`Agent\`, and there is **no** field named \`max_iter\`—iteration limits for the **runtime tool loop** are configured separately.

---

## Running an agent (\`AgentExecutor\`)

\`agenticx.core.agent_executor.AgentExecutor\` is the control-flow engine for **\`Agent\` + \`Task\`**: it builds prompts, calls the configured \`BaseLLMProvider\`, parses actions, runs \`BaseTool\` instances (including parallel batches), applies GuideRails, and can compact context via **\`ContextCompiler.maybe_compact\`** on an internal event log.

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

\`AgentExecutor.__init__\` accepts \`max_iterations\` (default **50**), independent of \`Agent.max_iterations\`.

!!! note "Two stacks"
    **\`AgentRuntime\`** drives the Studio/Desktop chat path (OpenAI-style messages, \`STUDIO_TOOLS\`, SSE-friendly \`RuntimeEvent\`s). **\`AgentExecutor\`** drives the classic task/agent pipeline. Both are valid; this page focuses on **\`AgentRuntime\`** below.

---

## The think-act loop (\`AgentRuntime.run_turn\`)

Each user turn runs **\`AgentRuntime.run_turn\`**, which loops at most **\`max_tool_rounds\`** times. One round is:

1. **Message sanitization** — \`_sanitize_context_messages\` repairs history so every \`assistant\` message with \`tool_calls\` is followed by matching \`tool\` rows (by \`tool_call_id\`). Orphan tool rows and dangling \`tool_calls\` are dropped so providers do not return HTTP 400 on broken sequences.
2. **Context compaction** — \`ContextCompactor.maybe_compact\` may replace older history with a single \`system\` summary message. On success, a **\`COMPACTION\`** event is emitted and **\`on_compaction\`** hooks run.
3. **LLM call** — If \`llm.stream_with_tools\` exists and succeeds, the runtime streams **content** and **tool_call_delta** chunks in a worker thread, enforces **first-feedback**, **invoke**, **heartbeat**, and **hard** timeouts, normalizes invalid tool names (e.g. \`"None"\`), and repairs streamed JSON arguments. On any failure, it **falls back** to **\`llm.invoke\`** with \`tools\`, \`tool_choice="auto"\`. **\`run_before_model\`** / **\`run_after_model\`** hooks wrap the call.
4. **Tool-call filtering** — Parsed \`tool_calls\` drop empty names and \`name.lower() == "none"\`. If the model returns no native tool calls, the runtime may extract an **inline** tool call from plaintext when it matches the allowed tool set.
5. **Tool dispatch** — For each call: **\`run_before_tool_call\`** may block. Unknown tools and invalid names produce **\`TOOL_RESULT\`** (and often **\`ERROR\`**) without executing. Tools in **\`_meta_only_names\`** go through **\`dispatch_meta_tool_async\`** (requires \`team_manager\`); all others use **\`dispatch_tool_async\`** with the runtime **\`confirm_gate\`**. Nested tool events from the dispatcher are re-yielded as **\`RuntimeEvent\`**s.
6. **Loop detection** — After each executed tool, **\`LoopDetector.record_call\`** / **\`check\`** run. **Warning** level injects a user-role reminder into \`messages\`; **critical** level emits **\`ERROR\`** and ends the turn.

If the model returns text and no tools, the runtime streams final text if needed, runs **\`run_on_agent_end\`**, yields **\`FINAL\`**, and returns. If **\`max_tool_rounds\`** is exhausted without a final answer, **meta** agents get **\`ERROR\`**; non-meta agents get **\`SUBAGENT_PAUSED\`** with checkpoint metadata.

---

## Runtime event stream (\`EventType\`)

\`agenticx/runtime/events.py\` defines the string enum consumed by Studio and tests:

| \`EventType\` | Value | Role |
|---------------|--------|------|
| \`ROUND_START\` | \`round_start\` | New tool round; payload includes \`round\`, \`max_rounds\`. |
| \`TOKEN\` | \`token\` | Streamed model text (or first-idle waiting pulse from the runtime). |
| \`TOOL_CALL\` | \`tool_call\` | Tool name, arguments, \`tool_call_id\`. |
| \`TOOL_RESULT\` | \`tool_result\` | Tool output string (including synthetic errors for blocked/unknown tools). |
| \`CONFIRM_REQUIRED\` | \`confirm_required\` | Emitted when a tool asks for confirmation and an event callback is wired. |
| \`CONFIRM_RESPONSE\` | \`confirm_response\` | Emitted after the gate resolves with \`approved\` boolean. |
| \`COMPACTION\` | \`compaction\` | History was compacted; includes \`compacted_count\`, \`summary\`. |
| \`SUBAGENT_CHECKPOINT\` | \`subagent_checkpoint\` | Periodic progress for non-meta agents (every 8 rounds). |
| \`SUBAGENT_PAUSED\` | \`subagent_paused\` | Sub-agent hit max rounds without finishing. |
| \`FINAL\` | \`final\` | Terminal natural-language reply for the turn. |
| \`ERROR\` | \`error\` | Failure, user stop, timeout, or loop guard abort. |
| \`SUBAGENT_STARTED\` | \`subagent_started\` | Delegation started (e.g. meta tools / team manager). |
| \`SUBAGENT_PROGRESS\` | \`subagent_progress\` | Mid-run subagent updates. |
| \`SUBAGENT_COMPLETED\` | \`subagent_completed\` | Subagent finished successfully. |
| \`SUBAGENT_ERROR\` | \`subagent_error\` | Subagent failed. |

---

## Timeout configuration

Resolved in **\`agent_runtime.py\`** via environment variables. Values are **seconds**.

| Variable | Default | Role |
|----------|---------|------|
| \`AGX_LLM_INVOKE_TIMEOUT_SECONDS\` | **120** | Idle budget **before** the first streamed chunk (streaming) or total wait for **\`invoke\`** completion (non-streaming path). |
| \`AGX_LLM_HEARTBEAT_TIMEOUT_SECONDS\` | **60** | Max idle time **between** streamed chunks after the first chunk. |
| \`AGX_LLM_HARD_TIMEOUT_SECONDS\` | **300** | Wall-clock cap for the streaming worker; stops the stream when exceeded. |
| \`AGX_LLM_FIRST_FEEDBACK_SECONDS\` | **8** | After this delay with no first chunk, the runtime may emit a short waiting **\`TOKEN\`**. |

The LLM request timeout passed into providers is derived as **\`max(invoke, heartbeat, hard) + 15\`** seconds.

---

## Confirm gate

| Class | Behavior |
|-------|-----------|
| **\`ConfirmGate\`** | Abstract \`request_confirm(question, context) -> bool\`. |
| **\`SyncConfirmGate\`** | Blocking **\`input()\`**; for CLI. |
| **\`AsyncConfirmGate\`** | Publishes a pending \`Future\`; server/UI resolves via **\`resolve(request_id, approved)\`**. Emits **\`confirm_required\`** / **\`confirm_response\`** when an event callback is used. |
| **\`AutoApproveConfirmGate\`** | Always returns **\`True\`**; used e.g. for delegated sub-agents that must not block on human input. **\`last_request\`** stays unset. |

**Run Everything** (Desktop permission mode **\`auto\`**) means the product treats risky operations as pre-approved for that session: confirmations should resolve without repeated prompts, consistent with auto-approval policy.

---

## Context compaction

**\`ContextCompactor.maybe_compact\`** (\`agenticx/runtime/compactor.py\`):

- Triggers when history length **> \`threshold_messages\`** (default **20**, minimum **8**) **or** total character count **> \`threshold_chars\`** (default **48,000**).
- Keeps the last **\`retain_recent_messages\`** messages (default **8**, minimum **4**).
- Summarizes the prefix via **\`llm.invoke\`** on a Chinese prompt; on failure, falls back to truncated snippets.
- Returns a list starting with one **\`system\`** message tagged \`[compacted] ...\` plus retained tail messages.

---

## Loop detection

**\`LoopDetector\`** (\`agenticx/runtime/loop_detector.py\`) tracks recent \`(tool_name, args_signature)\` pairs and progress marks.

**\`AgentRuntime\`** constructs it with **\`warning_threshold=4\`** and **\`critical_threshold=8\`** (constructor arguments). Detectors include:

- **generic_repeat** — same tool + same arguments repeated.
- **ping_pong** — alternating pattern on the tail.
- **no_progress** — many calls without artifacts/scratchpad progress or other heuristics.

**Warning** adds a reminder message; **critical** stops the run with **\`ERROR\`**.

---

## Runtime configuration

| Variable / knob | Default (Studio server) | Meaning |
|-----------------|------------------------|---------|
| \`AGX_MAX_TOOL_ROUNDS\` / \`runtime.max_tool_rounds\` | **30** if unset (clamped **10–120** in \`studio/server.py\`) | Max think-act rounds per user message. Bare **\`AgentRuntime()\`** uses Python default **10** unless overridden. |
| \`AGX_STATUS_QUERY_BUDGET_PER_TURN\` | **2** | Meta-agent budget for **\`query_subagent_status\`** per turn. |
| \`AGX_STATUS_QUERY_COOLDOWN_SECONDS\` | **8** | Minimum spacing between status queries for meta. |

---

## Events hook (\`HookRegistry\` / \`AgentHook\`)

Registered hooks (\`agenticx/runtime/hooks/__init__.py\`) run in priority order:

| Hook | When |
|------|------|
| **\`before_model\`** | After compaction/sanitization assembly, immediately before the LLM call. May replace the message list. |
| **\`after_model\`** | After a successful LLM response object is produced. |
| **\`before_tool_call\`** | Before dispatch; may **\`block\`** with a reason (synthetic tool error). |
| **\`after_tool_call\`** | May rewrite the tool result string. |
| **\`on_compaction\`** | After a successful compaction (mirrors **\`COMPACTION\`** event). |
| **\`on_agent_end\`** | Immediately before emitting **\`FINAL\`**, or when ending with max-round messages. |

\`AgentRuntime\` registers **\`MemoryHook\`** at low priority when available.

---

## Related

- [Orchestration](/docs/concepts/orchestration) — multi-step workflows and coordination.
- [Tools](/docs/concepts/tools) — tool definitions and dispatch.
- [Memory](/docs/concepts/memory) — long-horizon recall and hooks.
`,
  },
  zh: {
    title: '智能体运行时',
    description: 'AgenticX 智能体运行时执行。',
    content: `# 智能体运行时

本页描述 AgenticX 中的 **\`AgentRuntime\`** 执行路径（\`agenticx/runtime/agent_runtime.py\`）：think-act 循环、事件流、超时、确认门控、压缩、循环检测与钩子接入点。它与 \`agenticx/core/agent_executor.py\` 中较旧的 **\`AgentExecutor\`** 流水线不同——后者使用独立事件日志与上下文编译器。

---

## 智能体定义（\`Agent\` 模型）

主智能体记录为 \`agenticx.core.agent.Agent\`（Pydantic \`BaseModel\`）。常用于人设与租户的字段：

| Field | Type | Notes |
|-------|------|-------|
| \`id\` | \`str\` | Defaults to a new UUID if omitted. |
| \`name\` | \`str\` | Display name. |
| \`role\` | \`str\` | Role description for prompts. |
| \`goal\` | \`str\` | Primary objective. |
| \`backstory\` | \`str | None\` | Optional persona context. |
| \`organization_id\` | \`str\` | Multi-tenant namespace; default \`"default-org"\`. |

模型还携带 tools、LLM hooks、\`max_iterations\`（默认 **25**）、\`max_retry_limit\` 等配置。\`Agent\` 上 **没有** \`verbose\` 布尔字段，也 **没有** 名为 \`max_iter\` 的字段——**运行时工具循环** 的迭代上限需单独配置。

---

## 运行智能体（\`AgentExecutor\`）

\`agenticx.core.agent_executor.AgentExecutor\` 是 **\`Agent\` + \`Task\`** 的控制流引擎：构建提示、调用配置的 \`BaseLLMProvider\`、解析动作、运行 \`BaseTool\` 实例（含并行批次）、应用 GuideRails，并可通过内部事件日志上的 **\`ContextCompiler.maybe_compact\`** 压缩上下文。

典型用法：

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

\`AgentExecutor.__init__\` 接受 \`max_iterations\`（默认 **50**），与 \`Agent.max_iterations\` 独立。

!!! note "两套栈"
    **\`AgentRuntime\`** 驱动 Studio/Desktop 聊天路径（OpenAI 风格消息、\`STUDIO_TOOLS\`、适配 SSE 的 \`RuntimeEvent\`）。**\`AgentExecutor\`** 驱动经典 task/agent 流水线。两者均有效；下文聚焦 **\`AgentRuntime\`**。

---

## Think-act 循环（\`AgentRuntime.run_turn\`）

每个用户轮次运行 **\`AgentRuntime.run_turn\`**，最多循环 **\`max_tool_rounds\`** 次。一轮包括：

1. **消息清洗** — \`_sanitize_context_messages\` 修复历史，使每个带 \`tool_calls\` 的 \`assistant\` 消息后紧跟匹配的 \`tool\` 行（按 \`tool_call_id\`）。孤立 tool 行与悬空 \`tool_calls\` 会被丢弃，避免 provider 因序列断裂返回 HTTP 400。
2. **上下文压缩** — \`ContextCompactor.maybe_compact\` 可能用单一 \`system\` 摘要消息替换较早历史。成功时发出 **\`COMPACTION\`** 事件并运行 **\`on_compaction\`** 钩子。
3. **LLM 调用** — 若 \`llm.stream_with_tools\` 存在且成功，运行时在 worker 线程中流式输出 **content** 与 **tool_call_delta** chunk，强制执行 **first-feedback**、**invoke**、**heartbeat**、**hard** 超时，规范化无效工具名（如 \`"None"\`）并修复流式 JSON 参数。任何失败时 **回退** 到带 \`tools\`、\`tool_choice="auto"\` 的 **\`llm.invoke\`**。**\`run_before_model\`** / **\`run_after_model\`** 钩子包裹调用。
4. **工具调用过滤** — 解析的 \`tool_calls\` 丢弃空名与 \`name.lower() == "none"\`。若模型未返回原生 tool call，运行时可从纯文本提取 **inline** tool call（当匹配允许工具集时）。
5. **工具分发** — 每次调用：**\`run_before_tool_call\`** 可阻塞。未知工具与无效名产生 **\`TOOL_RESULT\`**（常伴随 **\`ERROR\`**）但不执行。**\`_meta_only_names\`** 中的工具走 **\`dispatch_meta_tool_async\`**（需 \`team_manager\`）；其余通过运行时 **\`confirm_gate\`** 使用 **\`dispatch_tool_async\`**。分发器嵌套工具事件会 re-yield 为 **\`RuntimeEvent\`**。
6. **循环检测** — 每次工具执行后运行 **\`LoopDetector.record_call\`** / **\`check\`**。**Warning** 级别向 \`messages\` 注入 user 角色提醒；**critical** 级别发出 **\`ERROR\`** 并结束本轮。

若模型返回文本且无工具，运行时按需流式输出最终文本，运行 **\`run_on_agent_end\`**，yield **\`FINAL\`** 并返回。若 **\`max_tool_rounds\`** 耗尽仍无最终答案，**meta** 智能体得到 **\`ERROR\`**；非 meta 智能体得到带 checkpoint 元数据的 **\`SUBAGENT_PAUSED\`**。

---

## 运行时事件流（\`EventType\`）

\`agenticx/runtime/events.py\` 定义 Studio 与测试消费的字符串枚举：

| \`EventType\` | Value | Role |
|---------------|--------|------|
| \`ROUND_START\` | \`round_start\` | New tool round; payload includes \`round\`, \`max_rounds\`. |
| \`TOKEN\` | \`token\` | Streamed model text (or first-idle waiting pulse from the runtime). |
| \`TOOL_CALL\` | \`tool_call\` | Tool name, arguments, \`tool_call_id\`. |
| \`TOOL_RESULT\` | \`tool_result\` | Tool output string (including synthetic errors for blocked/unknown tools). |
| \`CONFIRM_REQUIRED\` | \`confirm_required\` | Emitted when a tool asks for confirmation and an event callback is wired. |
| \`CONFIRM_RESPONSE\` | \`confirm_response\` | Emitted after the gate resolves with \`approved\` boolean. |
| \`COMPACTION\` | \`compaction\` | History was compacted; includes \`compacted_count\`, \`summary\`. |
| \`SUBAGENT_CHECKPOINT\` | \`subagent_checkpoint\` | Periodic progress for non-meta agents (every 8 rounds). |
| \`SUBAGENT_PAUSED\` | \`subagent_paused\` | Sub-agent hit max rounds without finishing. |
| \`FINAL\` | \`final\` | Terminal natural-language reply for the turn. |
| \`ERROR\` | \`error\` | Failure, user stop, timeout, or loop guard abort. |
| \`SUBAGENT_STARTED\` | \`subagent_started\` | Delegation started (e.g. meta tools / team manager). |
| \`SUBAGENT_PROGRESS\` | \`subagent_progress\` | Mid-run subagent updates. |
| \`SUBAGENT_COMPLETED\` | \`subagent_completed\` | Subagent finished successfully. |
| \`SUBAGENT_ERROR\` | \`subagent_error\` | Subagent failed. |

---

## 超时配置

在 **\`agent_runtime.py\`** 中通过环境变量解析。单位为 **秒**。

| Variable | Default | Role |
|----------|---------|------|
| \`AGX_LLM_INVOKE_TIMEOUT_SECONDS\` | **120** | Idle budget **before** the first streamed chunk (streaming) or total wait for **\`invoke\`** completion (non-streaming path). |
| \`AGX_LLM_HEARTBEAT_TIMEOUT_SECONDS\` | **60** | Max idle time **between** streamed chunks after the first chunk. |
| \`AGX_LLM_HARD_TIMEOUT_SECONDS\` | **300** | Wall-clock cap for the streaming worker; stops the stream when exceeded. |
| \`AGX_LLM_FIRST_FEEDBACK_SECONDS\` | **8** | After this delay with no first chunk, the runtime may emit a short waiting **\`TOKEN\`**. |

传入 provider 的 LLM 请求超时 derived 为 **\`max(invoke, heartbeat, hard) + 15\`** 秒。

---

## 确认门控

| Class | Behavior |
|-------|-----------|
| **\`ConfirmGate\`** | Abstract \`request_confirm(question, context) -> bool\`. |
| **\`SyncConfirmGate\`** | Blocking **\`input()\`**; for CLI. |
| **\`AsyncConfirmGate\`** | Publishes a pending \`Future\`; server/UI resolves via **\`resolve(request_id, approved)\`**. Emits **\`confirm_required\`** / **\`confirm_response\`** when an event callback is used. |
| **\`AutoApproveConfirmGate\`** | Always returns **\`True\`**; used e.g. for delegated sub-agents that must not block on human input. **\`last_request\`** stays unset. |

**Run Everything**（Desktop 权限模式 **\`auto\`**）表示产品将会话内高风险操作视为预批准：确认应无重复弹窗地 resolve，与自动批准策略一致。

---

## 上下文压缩

**\`ContextCompactor.maybe_compact\`**（\`agenticx/runtime/compactor.py\`）：

- 当历史长度 **> \`threshold_messages\`**（默认 **20**，最小 **8**）**或** 总字符数 **> \`threshold_chars\`**（默认 **48,000**）时触发。
- 保留最后 **\`retain_recent_messages\`** 条消息（默认 **8**，最小 **4**）。
- 通过中文提示上的 **\`llm.invoke\`** 摘要前缀；失败时回退为截断片段。
- 返回以一条带 \`[compacted] ...\` 标签的 **\`system\`** 消息开头、外加保留尾部消息的列表。

---

## 循环检测

**\`LoopDetector\`**（\`agenticx/runtime/loop_detector.py\`）跟踪近期 \`(tool_name, args_signature)\` 对与进度标记。

**\`AgentRuntime\`** 以 **\`warning_threshold=4\`** 与 **\`critical_threshold=8\`**（构造参数）实例化。检测器包括：

- **generic_repeat** — 相同工具 + 相同参数重复。
- **ping_pong** — 尾部交替模式。
- **no_progress** — 多次调用无 artifact/scratchpad 进度等启发式。

**Warning** 添加提醒消息；**critical** 以 **\`ERROR\`** 停止运行。

---

## 运行时配置

| Variable / knob | Default (Studio server) | Meaning |
|-----------------|------------------------|---------|
| \`AGX_MAX_TOOL_ROUNDS\` / \`runtime.max_tool_rounds\` | **30** if unset (clamped **10–120** in \`studio/server.py\`) | Max think-act rounds per user message. Bare **\`AgentRuntime()\`** uses Python default **10** unless overridden. |
| \`AGX_STATUS_QUERY_BUDGET_PER_TURN\` | **2** | Meta-agent budget for **\`query_subagent_status\`** per turn. |
| \`AGX_STATUS_QUERY_COOLDOWN_SECONDS\` | **8** | Minimum spacing between status queries for meta. |

---

## 事件钩子（\`HookRegistry\` / \`AgentHook\`）

已注册钩子（\`agenticx/runtime/hooks/__init__.py\`）按优先级顺序运行：

| Hook | When |
|------|------|
| **\`before_model\`** | After compaction/sanitization assembly, immediately before the LLM call. May replace the message list. |
| **\`after_model\`** | After a successful LLM response object is produced. |
| **\`before_tool_call\`** | Before dispatch; may **\`block\`** with a reason (synthetic tool error). |
| **\`after_tool_call\`** | May rewrite the tool result string. |
| **\`on_compaction\`** | After a successful compaction (mirrors **\`COMPACTION\`** event). |
| **\`on_agent_end\`** | Immediately before emitting **\`FINAL\`**, or when ending with max-round messages. |

\`AgentRuntime\` 在可用时以低优先级注册 **\`MemoryHook\`**。

---

## 相关

- [编排](/docs/concepts/orchestration) — 多步骤工作流与协调。
- [工具](/docs/concepts/tools) — 工具定义与分发。
- [记忆](/docs/concepts/memory) — 长程回忆与钩子。
`,
  },
};
