export const studioContent = {
  en: {
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
  },
  zh: {
    title: 'Studio 服务',
    description: 'Studio 服务端与会话管理。',
    content: `# Studio 服务与会话管理

## 概述

**Studio** 是 **AgenticX Desktop** 的后端服务层，基于 **FastAPI** 提供 **Server-Sent Events (SSE)** 流式接口。

---

## 启动服务

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
\`\`\`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| Host | \`0.0.0.0\` | 监听地址 |
| Port | \`8000\` | 监听端口 |
| \`--reload\` | False | 开发模式热重载 |

---

## 会话管理

### \`ManagedSession\` 字段

| 字段 | 说明 |
| --- | --- |
| \`session_id\` | 稳定的 UUID 字符串 |
| \`studio_session\` | 持有 provider/model 与聊天历史的 \`StudioSession\` |
| \`confirm_gate\` | Meta-Agent 使用的 \`AsyncConfirmGate\` |
| \`team_manager\` | 子智能体的 \`AgentTeamManager\` |
| \`avatar_id\` / \`avatar_name\` | 可选的分身绑定 |
| \`session_name\` | 用户可见的会话标题 |
| \`pinned\` | 置顶排序布尔值 |
| \`archived\` | 归档可见性布尔值 |

### 持久化布局

| 存储 | 职责 |
| --- | --- |
| **SessionStore (SQLite)** | 待办、草稿区、元数据 |
| **\`messages.json\`** | 完整聊天历史快照 |
| **\`agent_messages.json\`** | 最近 40 条 agent 上下文消息 |

---

## API 参考

### 对话与执行

| 路由 | 方法 | 说明 |
| --- | --- | --- |
| \`/api/chat\` | POST | 主对话轮次；返回 SSE 流 |
| \`/api/confirm\` | POST | 处理待确认操作 |

### 会话管理

| 路由 | 方法 | 说明 |
| --- | --- | --- |
| \`/api/session\` | GET | 获取或创建会话 |
| \`/api/session\` | DELETE | 删除会话 |
| \`/api/sessions\` | GET | 列出会话 |
| \`/api/sessions/{id}/fork\` | POST | 分叉会话 |

### 分身与群聊

| 路由 | 方法 | 说明 |
| --- | --- | --- |
| \`/api/avatars\` | GET/POST | 列出或创建分身 |
| \`/api/groups\` | GET/POST | 列出或创建群聊 |
| \`/api/subagent/cancel\` | POST | 取消运行中的子智能体 |

---

## SSE 流式协议

**端点：** \`POST /api/chat\`
**响应：** \`Content-Type: text/event-stream\`

每个 JSON 对象遵循 \`SseEvent\` 模型：

\`\`\`json
{"type": "<event_type>", "data": { "...": "..." }}
\`\`\`

每条流以 **done** 哨兵结束：

\`\`\`json
{"type": "done", "data": {}}
\`\`\`

---

## 工作区上下文

Meta-Agent 系统提示会纳入 \`~/.agenticx/workspace/\` 下的文件：

| 键 | 源文件 |
| --- | --- |
| \`identity\` | \`IDENTITY.md\` |
| \`user\` | \`USER.md\` |
| \`soul\` | \`SOUL.md\` |
| \`memory\` | \`MEMORY.md\` |
| \`daily_memory\` | \`memory/<YYYY-MM-DD>.md\` |
`,
  },
};
