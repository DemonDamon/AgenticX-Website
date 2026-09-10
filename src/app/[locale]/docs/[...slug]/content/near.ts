export const nearContent = {
  en: {
    title: 'Near Desktop',
    description: 'Local-first multi-agent workspace for AgenticX.',
    content: `# Near Desktop

Near is the local-first desktop workspace for AgenticX. It is Electron + React, and the default path starts a local \`agx serve / agx-server\` over REST API + SSE.

![Near and Studio runtime path](/diagrams/runtime-path.svg)

## What ships today

- Multi-pane chat, Meta-Agent, avatars, and group chat
- Per-pane model selection and session history
- Working directories, file references, and an embedded terminal
- Computer Use, MCP, Skills, Hooks, and the local knowledge base
- Automation, Voice Focus, Claude Code Bridge, and IM sidecars

## Runtime boundary

Near shares AgenticX abstractions with Enterprise, but the current deploy path is independent. Near talks to the local Python Runtime by default. A single remote \`agx serve\` backend is implemented. Cluster / HA multi-replica runtime remains planned.

See [Architecture](/docs/concepts/architecture) for the product stack, and [Studio Server](/docs/guides/studio) for the backend that Near attaches to.
`,
  },
  zh: {
    title: 'Near 桌面',
    description: 'AgenticX 的本地优先多智能体工作区。',
    content: `# Near 桌面

Near 是 AgenticX 的本地优先桌面工作区。技术栈为 Electron + React，默认路径会拉起本机 \`agx serve / agx-server\`，通过 REST API + SSE 通信。

![Near 与 Studio 运行路径](/diagrams/runtime-path.svg)

## 当前已落地

- 多窗格聊天、Meta-Agent、分身与群聊
- 按窗格选择模型，以及会话历史
- 工作目录、文件引用与内嵌终端
- Computer Use、MCP、Skills、Hooks 与本地知识库
- 自动化、语音焦点、Claude Code Bridge 与 IM sidecar

## 运行边界

Near 与 Enterprise 共用 AgenticX 抽象，但当前部署路径彼此独立。Near 默认连接本机 Python Runtime。单机远程 \`agx serve\` 已实现。集群 / 高可用多副本 Runtime 仍在规划中。

产品栈见 [架构](/docs/concepts/architecture)，后端见 [Studio 服务](/docs/guides/studio)。
`,
  },
};
