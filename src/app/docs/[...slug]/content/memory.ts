export const memoryContent = {
  title: 'Memory',
  description: 'Memory system in AgenticX.',
  content: `# Memory in AgenticX

## Overview

Agents need stable identity, recall of past work, and a bounded context window. AgenticX combines **file-backed workspace memory**, a **session scratchpad**, **automatic fact extraction**, **hybrid retrieval**, optional **Mem0** backends, and **LLM-assisted context compaction**.

---

## Memory hierarchy (six-layer model)

| Layer | Role | AgenticX realization |
|-------|------|----------------------|
| **Core memory** | Stable role, name, non-negotiable facts | \`IDENTITY.md\`, \`SOUL.md\`, avatar system prompts |
| **Episodic memory** | What was said and done in conversations | \`chat_history\`, \`messages.json\`, tool traces |
| **Semantic memory** | Reusable knowledge | \`MEMORY.md\`, optional Mem0, indexed chunks |
| **Short-term memory** | Scratch space for current task | Per-session \`scratchpad\` dict, \`scratchpad_write\` / \`scratchpad_read\` |
| **Long-term memory** | Cross-session persistence | \`MEMORY.md\`, SQLite session store, optional Mem0 |
| **Workspace memory** | Project-scoped files | \`USER.md\`, daily \`memory/<YYYY-MM-DD>.md\` |

---

## MemoryHook

\`MemoryHook\` is an \`AgentHook\` registered on \`AgentRuntime\` with **\`priority=-10\`**.

### When it runs

- **\`on_agent_end\`** is invoked after a turn completes.
- If \`len(chat_history) < MIN_CHAT_TURNS * 2\` (default **6**), it returns immediately.

### Extraction and limits

- **Heuristic only** (no extra LLM call): scans the **last 20** messages for request/completion cues.
- Caps output at **\`MAX_FACTS_PER_SESSION\` (8)** facts.

### Persistence

- Appends a dated block to **\`memory/<today>.md\`** under the workspace.
- If **\`MEMORY.md\`** exists and is under **4000** characters, appends an \`## Auto-extracted\` section.

---

## Workspace memory

### Directory layout (\`~/.agenticx/workspace/\`)

| Path | Purpose |
|------|---------|
| \`IDENTITY.md\` | Who the agent is; stable persona |
| \`USER.md\` | User profile, preferences |
| \`SOUL.md\` | Deeper style / values / tone |
| \`MEMORY.md\` | Long-form durable notes |
| \`memory/<YYYY-MM-DD>.md\` | Daily session-fact log |

---

## Mem0 integration

Mem0 is **optional**. Install with:

\`\`\`bash
pip install "agenticx[memory]"
\`\`\`

Use Mem0 when you want **managed long-term semantic memory** with add/search APIs.

---

## Session scratchpad

Each \`StudioSession\` carries a **\`scratchpad\`** dictionary persisted via SQLite:

| Key pattern | Purpose |
|-------------|---------|
| \`subagent_result::<id>\` | Summary after a subagent completes |
| \`session_facts\` | Incremental lines from \`MemoryHook\` |
| \`__pending_subagent_summaries__\` | Queue of pending subagent reports |

---

## Context compaction (\`ContextCompactor\`)

Before each turn, \`AgentRuntime\` runs \`ContextCompactor.maybe_compact\`:

| Parameter | Default | Behavior |
|-----------|---------|----------|
| \`threshold_messages\` | \`20\` | Compact if message count exceeds this |
| \`threshold_chars\` | \`48000\` | Or if total character count exceeds this |
| \`retain_recent_messages\` | \`8\` | Oldest portion is summarized; tail stays verbatim |

Process:
1. Split into **prefix** (to compact) and **suffix** (retained).
2. Call the runtime LLM with a compaction instruction.
3. Replace the prefix with a single **system** message prefixed with \`[compacted]\`.

---

## Memory-related configuration

| Item | Where | Description |
|------|-------|-------------|
| \`memory.backend\` | \`~/.agenticx/config.yaml\` | Pluggable memory backends (\`sqlite\`, \`redis\`, \`postgresql\`) |
| \`memory.path\` | \`~/.agenticx/config.yaml\` | Workspace root for memory features |
| \`AGX_WORKSPACE_ROOT\` | Environment | Fallback workspace directory |
| \`MIN_CHAT_TURNS\` | Code constant | \`MemoryHook\` gate: needs \`len(chat_history) >= 6\` |
| \`MAX_FACTS_PER_SESSION\` | Code constant | Cap on heuristic facts per \`on_agent_end\` |
`,
};
