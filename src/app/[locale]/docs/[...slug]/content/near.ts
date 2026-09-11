export const nearContent = {
  en: {
    title: 'Near Desktop',
    description: 'Local-first workspace: Electron UI on top of a local agx serve.',
    content: `# Near Desktop

Near is the **desktop workspace**. It is Electron + React + Zustand + Vite. It is not a second agent runtime. The default path starts a local \`agx serve\` / \`agx-server\` and talks REST + SSE.

Use Near when you want multi-pane chat, avatars, group chat, a workspace, a terminal, automation, and Voice Focus on your machine. Do not use it as a hosted multi-tenant portal — that is Enterprise.

![Near Desktop architecture](/diagrams/near-architecture-en.jpg)

## Boot path

\`\`\`mermaid
flowchart LR
  app["Near app"] --> spawn["spawn agx serve"]
  spawn --> port["~/.agenticx/serve.port"]
  spawn --> token["~/.agenticx/serve.token"]
  app --> api["127.0.0.1 Studio API"]
  api --> runtime["AgentRuntime"]
\`\`\`

Desktop binds the local backend. A remote \`agx serve\` mode is not the default product path. After a successful start, the real port and \`AGX_DESKTOP_TOKEN\` are written under \`~/.agenticx/\`.

!!! warning "Empty avatars and history"
    If every list looks empty and you did not delete data, check that \`agx serve\` is still listening on the port in \`serve.port\`. A crashed import in \`agenticx/studio/server.py\` looks like data loss. It is not.

## What ships

- **Panes**: one session per pane; model choice is per pane, not a global override
- **Meta-Agent**: unnamed chat goes to Meta; \`@name\` routes to that avatar
- **Group chat**: Meta is always a member; smart routing, no mandatory orchestrator picker
- **Workspace**: folders bind per avatar / Meta; \`@file\` inserts a token with an absolute \`sourcePath\`
- **Tools**: MCP, Skills, Hooks, Computer Use, local knowledge brains
- **Automation**: scheduled runs use \`avatar_id\` like \`automation:<task_id>\` and must not leak into Meta history
- **Voice Focus**: 280×280 capsule; Meta answers; transcript lands in the current Meta session

## Session restore

Closing a pane and opening the same avatar should return the last session, not a new one. After lid close / relaunch, panes and the last sessions should come back from local workspace state.

## Related

- [Architecture](/docs/concepts/architecture) — product stack
- [Studio Server](/docs/guides/studio) — the process Near attaches to
- [Agent Runtime](/docs/concepts/agent) — the loop behind SSE
`,
  },
  zh: {
    title: 'Near 桌面',
    description: '本地优先工作区：Electron 界面连本机 agx serve。',
    content: `# Near 桌面

Near 是**桌面工作区**。技术栈是 Electron + React + Zustand + Vite。它不是第二套智能体运行时。默认路径会拉起本机 \`agx serve\` / \`agx-server\`，用 REST + SSE 通信。

要在本机用多窗格聊天、分身、群聊、工作区、终端、自动化和语音焦点时用 Near。不要把它当托管多租户门户 —— 那是 Enterprise。

![Near Desktop 架构](/diagrams/near-architecture-zh.jpg)

## 启动链路

\`\`\`mermaid
flowchart LR
  app["Near 应用"] --> spawn["拉起 agx serve"]
  spawn --> port["~/.agenticx/serve.port"]
  spawn --> token["~/.agenticx/serve.token"]
  app --> api["127.0.0.1 Studio API"]
  api --> runtime["AgentRuntime"]
\`\`\`

桌面端硬绑本机后端。连接远程 \`agx serve\` 不是默认产品路径。启动成功后，真实端口和 \`AGX_DESKTOP_TOKEN\` 会写到 \`~/.agenticx/\`。

!!! warning "分身和历史突然全空"
    如果列表全空而你没删过数据，先看 \`serve.port\` 对应进程还在不在听。\`agenticx/studio/server.py\` 导入崩溃会表现成像丢数据。数据通常还在。

## 当前已落地

- **窗格**：一窗格一会话；模型按窗格选，不覆盖全局
- **Meta-Agent**：没 @ 时由 Meta 接；\`@名字\` 路由到对应分身
- **群聊**：默认包含 Meta；智能路由，不必先选编排器
- **工作区**：目录按分身 / Meta 隔离；\`@file\` 插入带绝对 \`sourcePath\` 的 token
- **工具**：MCP、Skills、Hooks、Computer Use、本地知识脑
- **自动化**：定时运行的 \`avatar_id\` 形如 \`automation:<task_id>\`，不得串进 Meta 历史
- **语音焦点**：280×280 胶囊；由 Meta 回答；摘要写入当前元智能体会话

## 会话恢复

关掉窗格再打开同一分身，应回到最近会话，而不是新建。合盖 / 重启后应恢复窗格和上次会话。

## 相关页

- [架构](/docs/concepts/architecture) — 产品栈
- [Studio 服务](/docs/guides/studio) — Near 连上的进程
- [智能体运行时](/docs/concepts/agent) — SSE 背后的循环
`,
  },
};
