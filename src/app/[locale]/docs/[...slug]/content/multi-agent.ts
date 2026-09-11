export const multiAgentContent = {
  en: {
    title: 'Multi-Agent Collaboration',
    description: 'Avatars, group chat, and sub-agent teams.',
    content: `# Multi-Agent Collaboration

Use this when **more than one identity** must work on a task. Near group chat and Studio sub-agents are the product path. A Python script that calls \`AgentExecutor.run\` twice is just two sequential jobs — that is not a team.

![Meta routes mention, delegate, or spawn](/docs/svg/multi-agent-route-en.svg?v=2)

*Diagram: Meta routes @mention, delegate_to_avatar, or spawn_subagent.*

!!! warning "Do not spawn a registered avatar"
    If the name is already an avatar, Meta must call \`delegate_to_avatar\`. \`spawn_subagent\` is for ephemeral workers only.

---

## Three real surfaces

| Surface | When | Mechanism |
|---------|------|-----------|
| **Near group chat** | Humans talk to several avatars in one room | \`group_router\`: user-directed \`@\` or Meta fallback |
| **True delegation** | A registered avatar must execute | \`delegate_to_avatar\` runs in that avatar's real session |
| **Ephemeral team** | Unnamed parallel workers | \`AgentTeamManager.spawn_subagent\` |

\`AgentTeamManager\` is **not** constructed as \`AgentTeamManager(agents=[...])\`. It needs \`llm_factory\` and a \`StudioSession\` (\`base_session\`), plus optional \`owner_session_id\` and \`max_concurrent_subagents\` (default 4).

---

## Near group chat

1. Every new group implicitly includes Meta.
2. \`@Name\` routes to that member. Unmentioned turns go to Meta unless the text clearly names a member's job.
3. Progress noise (received / calling tool / tool done) should collapse into one foldable card per avatar — not one bubble per tool call.

See [Near Desktop](/docs/concepts/near) and [Studio](/docs/guides/studio).

---

## Delegation vs spawn

Meta tools live in \`agenticx/runtime/meta_tools.py\`:

- \`delegate_to_avatar(avatar_id, task)\` — find or create the avatar session, run there, inherit \`taskspaces\` / \`context_files\`
- \`spawn_subagent(...)\` — team-manager worker; blocked if the name is already a registered avatar
- \`chat_with_avatar\` — internal Q&A without a full execution session

The Meta system prompt is rebuilt each turn with an active-subagent snapshot (\`_build_active_subagents_context\`).

---

## A2A (library protocol)

\`agenticx.protocols.client.A2AClient\` talks to a remote A2A service. Construct it with a target \`AgentCard\`, then create and poll collaboration tasks. It is **not** \`A2AClient(); client.invoke_skill(...)\`. Near group chat does not go through A2A.

---

## Session isolation

Team runs are scoped by \`owner_session_id\`. Avatar history stays on that avatar's sessions. Automation sessions (\`automation:<task_id>\`) must not leak into Meta history.

Related: [Orchestration](/docs/concepts/orchestration), [Flow](/docs/concepts/flow), [Agent runtime](/docs/concepts/agent).
`,
  },
  zh: {
    title: '多智能体协作',
    description: '分身、群聊与子智能体团队。',
    content: `# 多智能体协作

需要**多个身份**一起干活时才看本页。产品主路径是 Near 群聊和 Studio 子智能体。脚本里连续两次 \`AgentExecutor.run\` 只是两个串行任务，不算团队。

![Meta 路由提及、委派或拉起子智能体](/docs/svg/multi-agent-route-zh.svg?v=2)

*示意图：Meta 路由 @提及、delegate_to_avatar 或 spawn_subagent。*

!!! warning "已注册分身不要 spawn"
    名字已经是分身时，Meta 必须 \`delegate_to_avatar\`。\`spawn_subagent\` 只给临时工人。

---

## 三条真实路径

| 表面 | 何时 | 机制 |
|------|------|------|
| **Near 群聊** | 人和多个分身在一个房间说话 | \`group_router\`：用户 \`@\` 或 Meta 兜底 |
| **真委派** | 已注册分身必须亲自执行 | \`delegate_to_avatar\` 跑在该分身真实 session |
| **临时团队** | 无名并行工人 | \`AgentTeamManager.spawn_subagent\` |

\`AgentTeamManager\` **不是** \`AgentTeamManager(agents=[...])\`。它需要 \`llm_factory\` 和 \`StudioSession\`（\`base_session\`），以及可选的 \`owner_session_id\`、\`max_concurrent_subagents\`（默认 4）。

---

## Near 群聊

1. 新建群聊默认隐式包含 Meta。
2. \`@名字\` 路由到该成员。未 @ 时由 Meta 兜底，除非正文明显指向某成员职责。
3. 「已接收 / 正在调用工具 / 工具完成」应聚合成该分身一张可折叠卡，不要每个工具一条气泡。

见 [Near 桌面](/docs/concepts/near) 与 [Studio](/docs/guides/studio)。

---

## 委派 vs spawn

Meta 工具在 \`agenticx/runtime/meta_tools.py\`：

- \`delegate_to_avatar(avatar_id, task)\` — 查找或创建分身会话并在那里执行，继承 \`taskspaces\` / \`context_files\`
- \`spawn_subagent(...)\` — 团队管理器工人；名字已是注册分身时会被拦截
- \`chat_with_avatar\` — 内部问答，不开完整执行会话

每轮 Meta 系统提示都会注入活跃子智能体快照（\`_build_active_subagents_context\`）。

---

## A2A（库协议）

\`agenticx.protocols.client.A2AClient\` 对接远程 A2A 服务。构造时传入目标 \`AgentCard\`，再创建并轮询协作任务。**不是** \`A2AClient(); client.invoke_skill(...)\`。Near 群聊不走 A2A。

---

## 会话隔离

团队运行按 \`owner_session_id\` 隔离。分身历史留在该分身的 session。自动化会话（\`automation:<task_id>\`）不得串进 Meta 历史。

相关：[编排](/docs/concepts/orchestration)、[Flow](/docs/concepts/flow)、[智能体运行时](/docs/concepts/agent)。
`,
  },
};
