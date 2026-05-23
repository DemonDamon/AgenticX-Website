export const studioContent = {
  title: 'Studio Server',
  description: 'Studio server and session management.',
  content: `# Studio Server & Session Management

## Overview

**Studio** is the backend service layer for **AgenticX Desktop**. It exposes a **FastAPI** application with **Server-Sent Events (SSE)** streaming endpoints.

---

## Starting the Server

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

| Setting | Default | Description |
| --- | --- | --- |
| Host | \`0.0.0.0\` | Listen address |
| Port | \`8000\` | Listen port |
| \`--reload\` | False | Development mode hot reload |

---

## Session Management

### \`ManagedSession\` fields

| Field | Description |
| --- | --- |
| \`session_id\` | Stable UUID string |
| \`studio_session\` | \`StudioSession\` holding provider/model, chat history |
| \`confirm_gate\` | \`AsyncConfirmGate\` for the Meta-Agent |
| \`team_manager\` | \`AgentTeamManager\` for sub-agents |
| \`avatar_id\` / \`avatar_name\` | Optional avatar binding |
| \`session_name\` | User-visible title |
| \`pinned\` | Boolean for ordering |
| \`archived\` | Boolean for visibility |

### Persistence layout

| Store | Role |
| --- | --- |
| **SessionStore (SQLite)** | Todos, scratchpad, metadata |
| **\`messages.json\`** | Full chat history snapshot |
| **\`agent_messages.json\`** | Last 40 agent-context messages |

---

## API Reference

### Chat & execution

| Route | Method | Description |
| --- | --- | --- |
| \`/api/chat\` | POST | Main chat turn; returns SSE stream |
| \`/api/confirm\` | POST | Resolve pending confirmation |

### Session management

| Route | Method | Description |
| --- | --- | --- |
| \`/api/session\` | GET | Get or create session |
| \`/api/session\` | DELETE | Delete session |
| \`/api/sessions\` | GET | List sessions |
| \`/api/sessions/{id}/fork\` | POST | Fork session |

### Avatar & group

| Route | Method | Description |
| --- | --- | --- |
| \`/api/avatars\` | GET/POST | List or create avatars |
| \`/api/groups\` | GET/POST | List or create group chats |
| \`/api/subagent/cancel\` | POST | Cancel running sub-agent |

---

## SSE Streaming Protocol

**Endpoint:** \`POST /api/chat\`
**Response:** \`Content-Type: text/event-stream\`

Each JSON object follows the \`SseEvent\` model:

\`\`\`json
{"type": "<event_type>", "data": { "...": "..." }}
\`\`\`

Every stream ends with a **done** sentinel:

\`\`\`json
{"type": "done", "data": {}}
\`\`\`

---

## Workspace Context

Meta-Agent system prompts incorporate files under \`~/.agenticx/workspace/\`:

| Key | Source file |
| --- | --- |
| \`identity\` | \`IDENTITY.md\` |
| \`user\` | \`USER.md\` |
| \`soul\` | \`SOUL.md\` |
| \`memory\` | \`MEMORY.md\` |
| \`daily_memory\` | \`memory/<YYYY-MM-DD>.md\` |
`,
};
