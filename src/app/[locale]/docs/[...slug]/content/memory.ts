export const memoryContent = {
  en: {
    title: 'Memory',
    description: 'Memory system in AgenticX.',
    content: `# Memory in AgenticX

## Overview

Agents need stable identity, recall of past work, and a bounded context window. AgenticX combines **file-backed workspace memory**, a **session scratchpad**, **automatic fact extraction** after each turn, **hybrid retrieval** into the Meta-Agent system prompt, optional **Mem0** backends, and **LLM-assisted context compaction** on long threads.

Together these mechanisms approximate a layered memory stack: what must always be true (identity), what happened recently (episodes), what generalizes (semantics), what the model sees this turn (working set), what survives across sessions (long-term files and stores), and what is scoped to the user's workspace on disk.

---

## Memory hierarchy (six-layer model)

The table maps a classic cognitive-style hierarchy to concrete AgenticX surfaces. Layers are **conceptual**; several features overlap in implementation.

| Layer | Role | AgenticX realization |
|-------|------|----------------------|
| **Core memory** | Stable role, name, non-negotiable facts | \`IDENTITY.md\`, \`SOUL.md\`, avatar/session system prompts, Meta-Agent identity blocks |
| **Episodic memory** | What was said and done in conversations | \`chat_history\` / persisted \`messages.json\`, tool traces in history |
| **Semantic memory** | Reusable knowledge, not tied to one chat | Curated \`MEMORY.md\`, optional Mem0 / knowledge components, indexed chunks in \`WorkspaceMemoryStore\` |
| **Short-term / working memory** | Scratch space for the current task | Per-session \`scratchpad\` dict, \`scratchpad_write\` / \`scratchpad_read\` tools, recent message window |
| **Long-term memory** | Cross-session persistence | \`MEMORY.md\` (manual + auto-append), SQLite session store for scratchpad, optional Mem0 |
| **Workspace memory** | Project- and user-scoped files under \`~/.agenticx/workspace\` | \`USER.md\`, daily \`memory/<YYYY-MM-DD>.md\`, directory layout per avatar/project |

!!! note "Indexing vs raw files"
    Hybrid search (\`WorkspaceMemoryStore\`) indexes \`MEMORY.md\`, \`IDENTITY.md\`, \`USER.md\`, \`SOUL.md\`, and all \`memory/*.md\` under the workspace directory. Keeping these files concise improves recall quality.

---

## MemoryHook

\`MemoryHook\` is an \`AgentHook\` registered on \`AgentRuntime\` with **\`priority=-10\`**, so it runs **after** hooks with higher numeric priority when \`run_on_agent_end\` walks the registry.

### When it runs

- **\`on_agent_end\`** is invoked after a turn completes.
- It reads \`session.chat_history\`. If \`len(chat_history) < MIN_CHAT_TURNS * 2\` it returns immediately. Defaults: \`MIN_CHAT_TURNS = 3\` → **at least six chat records** required.
- Workspace directory: \`session.workspace_dir\`, else \`AGX_WORKSPACE_ROOT\`, else the user home directory.

### Extraction and limits

- **Heuristic only** (no extra LLM call): scans the **last 20** messages for Chinese user-request cues and assistant completion cues, emits bullet lines such as \`- 用户请求:\` / \`- 完成事项:\`.
- Caps output at **\`MAX_FACTS_PER_SESSION\` (8)** facts.

### Persistence

- Appends a dated block to **\`memory/<today>.md\`** under the workspace. Skips append if existing daily file plus new block would exceed **8000** characters.
- If **\`MEMORY.md\`** exists and is under **4000** characters, appends an \`## Auto-extracted\` section with up to **four** of the facts.

### Scratchpad

- Merges facts into \`session.scratchpad["session_facts"]\` (concatenated with newlines).

### \`_maybe_compact_daily\`

- If today's \`memory/<YYYY-MM-DD>.md\` exceeds **2000** characters, rewrites it: keeps headings, drops duplicate bullet lines keyed by the **first 80 characters** (case-folded), preserving first occurrence. This is **deterministic deduplication**, not an LLM summarizer.

\`\`\`python
# Reference constants (agenticx/runtime/hooks/memory_hook.py)
MIN_CHAT_TURNS = 3          # requires len(chat_history) >= MIN_CHAT_TURNS * 2
MAX_FACTS_PER_SESSION = 8
\`\`\`

!!! warning "LANGUAGE HEURISTICS"
    Fact patterns target **Chinese** request keywords and Chinese/English completion markers. Conversations in other languages may yield fewer or no extracted lines until heuristics are extended.

---

## Workspace memory

### Directory layout (\`~/.agenticx/workspace/\`)

| Path | Purpose |
|------|---------|
| \`IDENTITY.md\` | Who the agent is; stable persona |
| \`USER.md\` | User profile, preferences |
| \`SOUL.md\` | Deeper style / values / tone |
| \`MEMORY.md\` | Long-form durable notes; receives optional auto-extracted sections |
| \`memory/<YYYY-MM-DD>.md\` | Daily session-fact log from \`MemoryHook\` |

Additional session artifacts (avatars, groups) may live alongside; the **search index** explicitly pulls the four root markdown files plus \`memory/*.md\`.

### Automatic recall: \`_build_memory_recall_context\`

Defined in \`agenticx/runtime/prompts/meta_agent.py\`. When building the Meta-Agent system prompt it:

1. Collects text from the **last five** user messages (up to **200** characters each).
2. Builds a query string (max **500** characters).
3. Calls \`WorkspaceMemoryStore.search_sync(..., limit=5, mode="hybrid")\`.
4. Injects a \`## 相关历史记忆（自动召回）\` section with snippets capped around **500** characters total.

If there are no user messages or no hits, the section is omitted.

!!! tip "Recall quality"
    Run or schedule \`WorkspaceMemoryStore.index_workspace_sync(workspace_dir)\` after large edits to markdown so FTS and hybrid ranking see fresh content.

---

## Mem0 integration

Mem0 is **optional**. Install with the extra that pulls memory dependencies:

\`\`\`bash
pip install "agenticx[memory]"
\`\`\`

At runtime, \`agenticx.memory\` exposes \`Mem0\` / async variants when dependencies are present; the vendored integration under \`agenticx/integrations/mem0/\` supports multiple vector stores and configs. Use Mem0 when you want **managed long-term semantic memory** (add/search APIs, hosted or local) instead of or alongside file-based \`MEMORY.md\`.

!!! note "Separation from MemoryHook"
    \`MemoryHook\` writes markdown under the workspace. Mem0 is a separate data plane; wiring both is valid if you want file logs plus vector search.

---

## Session scratchpad

Each \`StudioSession\` carries a **\`scratchpad\`** dictionary persisted via SQLite (\`agenticx/memory/session_store.py\`). Besides user/agent keys from \`scratchpad_write\`, the runtime uses reserved patterns:

| Key pattern | Purpose |
|-------------|---------|
| \`subagent_result::<id>\` | Summary text after a subagent / delegation completes |
| \`delegation_result::<id>\` | Same pipeline writes delegation outcomes for Meta-Agent follow-up |
| \`session_facts\` | Incremental lines from \`MemoryHook\` |
| \`__pending_subagent_summaries__\` | Queue of pending subagent reports (internal) |
| \`__taskspace_hint__\` / \`__taskspace_label_hint__\` | Taskspace path hints from tools |

Meta-Agent context building reads \`subagent_result::*\` entries for "historical subagent results" when registry rows are missing.

---

## Context compaction (\`ContextCompactor\`)

Before each turn, \`AgentRuntime\` runs \`ContextCompactor.maybe_compact\` on **sanitized** \`agent_messages\`.

| Parameter | Default | Behavior |
|-----------|---------|----------|
| \`threshold_messages\` | \`20\` | Compact if message count **exceeds** this |
| \`threshold_chars\` | \`48000\` | Or if sum of \`content\` string lengths exceeds this |
| \`retain_recent_messages\` | \`8\` | Oldest portion is summarized; these tail messages stay verbatim |

Process:

1. Split into **prefix** (to compact) and **suffix** (retained).
2. Call the runtime LLM with a Chinese compaction instruction (temperature \`0\`, \`max_tokens\` \`400\`).
3. Replace the prefix with a single **system** message prefixed with \`[compacted]\` and the summary.
4. On failure, fall back to concatenated short snippets.

Minimum enforced floors: \`threshold_messages >= 8\`, \`threshold_chars >= 4000\`, \`retain_recent_messages >= 4\`.

!!! note "Configuration surface"
    Defaults are fixed in \`AgentRuntime.__init__\` (\`ContextCompactor(llm)\` with no YAML overrides). Custom deployments can construct \`AgentRuntime\` with a preconfigured \`ContextCompactor\` if needed.

---

## Memory-related configuration

| Item | Where | Description |
|------|-------|-------------|
| \`memory.backend\` | \`~/.agenticx/config.yaml\` | Declared in docs for pluggable memory backends (\`sqlite\`, \`redis\`, \`postgresql\`, etc.) |
| \`memory.path\` | \`~/.agenticx/config.yaml\` | Workspace root for memory features |
| \`AGX_WORKSPACE_ROOT\` | Environment | Fallback workspace directory for \`MemoryHook\` when \`session.workspace_dir\` is unset |
| \`MIN_CHAT_TURNS\` | Code constant | \`MemoryHook\` gate: needs \`len(chat_history) >= MIN_CHAT_TURNS * 2\` |
| \`MAX_FACTS_PER_SESSION\` | Code constant | Cap on heuristic facts per \`on_agent_end\` |
| \`WorkspaceMemoryStore\` DB | Default path | \`~/.agenticx/memory/main.sqlite\` (\`DEFAULT_WORKSPACE_MEMORY_DB\`) |
| \`ContextCompactor\` thresholds | Code defaults | \`20\` messages / \`48000\` chars trigger; retain \`8\` messages |

\`\`\`yaml
# ~/.agenticx/config.yaml (illustrative memory block)
memory:
  backend: sqlite
  path: ~/.agenticx/workspace
\`\`\`

## See also

- [Configuration](/docs/getting-started/configuration) — global \`config.yaml\` and environment variables
- [Architecture](/docs/concepts/architecture) — high-level runtime overview
`,
  },
  zh: {
    title: '记忆',
    description: 'AgenticX 记忆系统。',
    content: `# AgenticX 中的记忆

## 概述

智能体需要稳定的身份、对过往工作的回忆，以及有界的上下文窗口。AgenticX 结合了 **文件型工作区记忆**、**会话 scratchpad**、每轮结束后的 **自动事实抽取**、注入 Meta-Agent 系统提示的 **混合检索**、可选的 **Mem0** 后端，以及长对话上的 **LLM 辅助上下文压缩**。

这些机制共同构成近似分层的记忆栈：必须始终成立的内容（身份）、最近发生的事（情节）、可泛化的知识（语义）、本轮模型可见的内容（工作集）、跨会话保留的内容（长期文件与存储），以及落在用户磁盘工作区内的范围化记忆。

---

## 记忆层级（六层模型）

下表将经典认知式层级映射到 AgenticX 的具体实现。各层为 **概念性** 划分；多项能力在实现上会有重叠。

| Layer | Role | AgenticX realization |
|-------|------|----------------------|
| **Core memory** | Stable role, name, non-negotiable facts | \`IDENTITY.md\`, \`SOUL.md\`, avatar/session system prompts, Meta-Agent identity blocks |
| **Episodic memory** | What was said and done in conversations | \`chat_history\` / persisted \`messages.json\`, tool traces in history |
| **Semantic memory** | Reusable knowledge, not tied to one chat | Curated \`MEMORY.md\`, optional Mem0 / knowledge components, indexed chunks in \`WorkspaceMemoryStore\` |
| **Short-term / working memory** | Scratch space for the current task | Per-session \`scratchpad\` dict, \`scratchpad_write\` / \`scratchpad_read\` tools, recent message window |
| **Long-term memory** | Cross-session persistence | \`MEMORY.md\` (manual + auto-append), SQLite session store for scratchpad, optional Mem0 |
| **Workspace memory** | Project- and user-scoped files under \`~/.agenticx/workspace\` | \`USER.md\`, daily \`memory/<YYYY-MM-DD>.md\`, directory layout per avatar/project |

!!! note "索引与原始文件"
    混合搜索（\`WorkspaceMemoryStore\`）会索引 \`MEMORY.md\`、\`IDENTITY.md\`、\`USER.md\`、\`SOUL.md\` 以及工作区下全部 \`memory/*.md\`。保持这些文件简洁可提升召回质量。

---

## MemoryHook

\`MemoryHook\` 是注册在 \`AgentRuntime\` 上的 \`AgentHook\`，**\`priority=-10\`**，因此在 \`run_on_agent_end\` 遍历注册表时，会在数值优先级更高的钩子 **之后** 运行。

### 触发时机

- 一轮对话结束后调用 **\`on_agent_end\`**。
- 读取 \`session.chat_history\`。若 \`len(chat_history) < MIN_CHAT_TURNS * 2\` 则立即返回。默认 \`MIN_CHAT_TURNS = 3\` → 至少需要 **六条聊天记录**。
- 工作区目录：\`session.workspace_dir\`，否则 \`AGX_WORKSPACE_ROOT\`，再否则用户主目录。

### 抽取与上限

- **仅启发式**（无额外 LLM 调用）：扫描 **最近 20 条** 消息中的中文用户请求线索与助手完成线索，输出如 \`- 用户请求:\` / \`- 完成事项:\` 的 bullet 行。
- 输出上限为 **\`MAX_FACTS_PER_SESSION\`（8）** 条事实。

### 持久化

- 向工作区 **\`memory/<today>.md\`** 追加带日期的块。若现有日文件加新块将超过 **8000** 字符则跳过追加。
- 若 **\`MEMORY.md\`** 存在且不足 **4000** 字符，追加 \`## Auto-extracted\` 节，最多 **四条** 事实。

### Scratchpad

- 将事实合并进 \`session.scratchpad["session_facts"]\`（以换行拼接）。

### \`_maybe_compact_daily\`

- 若当日 \`memory/<YYYY-MM-DD>.md\` 超过 **2000** 字符则重写：保留标题，按 **前 80 字符**（大小写折叠）去重 bullet 行，保留首次出现。这是 **确定性去重**，不是 LLM 摘要。

\`\`\`python
# Reference constants (agenticx/runtime/hooks/memory_hook.py)
MIN_CHAT_TURNS = 3          # requires len(chat_history) >= MIN_CHAT_TURNS * 2
MAX_FACTS_PER_SESSION = 8
\`\`\`

!!! warning "语言启发式"
    事实模式针对 **中文** 请求关键词及中英文完成标记。其他语言的对话可能抽取较少或为空，需扩展启发式后才改善。

---

## 工作区记忆

### 目录结构（\`~/.agenticx/workspace/\`）

| Path | Purpose |
|------|---------|
| \`IDENTITY.md\` | Who the agent is; stable persona |
| \`USER.md\` | User profile, preferences |
| \`SOUL.md\` | Deeper style / values / tone |
| \`MEMORY.md\` | Long-form durable notes; receives optional auto-extracted sections |
| \`memory/<YYYY-MM-DD>.md\` | Daily session-fact log from \`MemoryHook\` |

分身/群聊等额外会话产物可并存；**搜索索引** 明确拉取四个根 markdown 文件及 \`memory/*.md\`。

### 自动召回：\`_build_memory_recall_context\`

定义于 \`agenticx/runtime/prompts/meta_agent.py\`。构建 Meta-Agent 系统提示时：

1. 从 **最近五条** 用户消息收集文本（每条最多 **200** 字符）。
2. 构建查询字符串（最多 **500** 字符）。
3. 调用 \`WorkspaceMemoryStore.search_sync(..., limit=5, mode="hybrid")\`。
4. 注入 \`## 相关历史记忆（自动召回）\` 节，片段总量约 **500** 字符上限。

若无用户消息或无命中，则省略该节。

!!! tip "召回质量"
    大规模编辑 markdown 后运行或调度 \`WorkspaceMemoryStore.index_workspace_sync(workspace_dir)\`，以便 FTS 与混合排序看到最新内容。

---

## Mem0 集成

Mem0 为 **可选**。通过附带 memory 依赖的 extra 安装：

\`\`\`bash
pip install "agenticx[memory]"
\`\`\`

运行时，依赖就绪时 \`agenticx.memory\` 暴露 \`Mem0\` / 异步变体；\`agenticx/integrations/mem0/\` 下的集成支持多种向量存储与配置。当你需要 **托管的长期语义记忆**（add/search API，托管或本地）而非或辅以基于文件的 \`MEMORY.md\` 时使用 Mem0。

!!! note "与 MemoryHook 分离"
    \`MemoryHook\` 在工作区下写 markdown。Mem0 是独立数据平面；若既要文件日志又要向量搜索，可同时接入。

---

## 会话 scratchpad

每个 \`StudioSession\` 携带通过 SQLite 持久化的 **\`scratchpad\`** 字典（\`agenticx/memory/session_store.py\`）。除 \`scratchpad_write\` 的用户/智能体键外，运行时使用保留模式：

| Key pattern | Purpose |
|-------------|---------|
| \`subagent_result::<id>\` | Summary text after a subagent / delegation completes |
| \`delegation_result::<id>\` | Same pipeline writes delegation outcomes for Meta-Agent follow-up |
| \`session_facts\` | Incremental lines from \`MemoryHook\` |
| \`__pending_subagent_summaries__\` | Queue of pending subagent reports (internal) |
| \`__taskspace_hint__\` / \`__taskspace_label_hint__\` | Taskspace path hints from tools |

Meta-Agent 构建上下文时，在注册表行缺失时会读取 \`subagent_result::*\` 作为「历史子智能体结果」。

---

## 上下文压缩（\`ContextCompactor\`）

每轮开始前，\`AgentRuntime\` 对 **已清洗** 的 \`agent_messages\` 运行 \`ContextCompactor.maybe_compact\`。

| Parameter | Default | Behavior |
|-----------|---------|----------|
| \`threshold_messages\` | \`20\` | Compact if message count **exceeds** this |
| \`threshold_chars\` | \`48000\` | Or if sum of \`content\` string lengths exceeds this |
| \`retain_recent_messages\` | \`8\` | Oldest portion is summarized; these tail messages stay verbatim |

流程：

1. 拆分为 **前缀**（待压缩）与 **后缀**（保留）。
2. 用中文压缩指令调用运行时 LLM（temperature \`0\`，\`max_tokens\` \`400\`）。
3. 用带 \`[compacted]\` 前缀的单一 **system** 消息与摘要替换前缀。
4. 失败时回退为拼接的短片段。

强制下限：\`threshold_messages >= 8\`、\`threshold_chars >= 4000\`、\`retain_recent_messages >= 4\`。

!!! note "配置面"
    默认值固定于 \`AgentRuntime.__init__\`（\`ContextCompactor(llm)\`，无 YAML 覆盖）。自定义部署可按需构造带预配置 \`ContextCompactor\` 的 \`AgentRuntime\`。

---

## 记忆相关配置

| Item | Where | Description |
|------|-------|-------------|
| \`memory.backend\` | \`~/.agenticx/config.yaml\` | Declared in docs for pluggable memory backends (\`sqlite\`, \`redis\`, \`postgresql\`, etc.) |
| \`memory.path\` | \`~/.agenticx/config.yaml\` | Workspace root for memory features |
| \`AGX_WORKSPACE_ROOT\` | Environment | Fallback workspace directory for \`MemoryHook\` when \`session.workspace_dir\` is unset |
| \`MIN_CHAT_TURNS\` | Code constant | \`MemoryHook\` gate: needs \`len(chat_history) >= MIN_CHAT_TURNS * 2\` |
| \`MAX_FACTS_PER_SESSION\` | Code constant | Cap on heuristic facts per \`on_agent_end\` |
| \`WorkspaceMemoryStore\` DB | Default path | \`~/.agenticx/memory/main.sqlite\` (\`DEFAULT_WORKSPACE_MEMORY_DB\`) |
| \`ContextCompactor\` thresholds | Code defaults | \`20\` messages / \`48000\` chars trigger; retain \`8\` messages |

\`\`\`yaml
# ~/.agenticx/config.yaml (illustrative memory block)
memory:
  backend: sqlite
  path: ~/.agenticx/workspace
\`\`\`

## 另见

- [配置](/docs/getting-started/configuration) — 全局 \`config.yaml\` 与环境变量
- [架构](/docs/concepts/architecture) — 运行时高层概览
`,
  },
};
