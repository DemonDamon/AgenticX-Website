export const guidesContent = {
  en: {
    title: 'Guides',
    description: 'How-to walks on the Python / Near path.',
    content: `# Guides

These pages are **first successful runs**. Concepts explain the loop; a guide is the shortest path that actually works.

![Six how-to pages](/docs/svg/guides-map-en.svg?v=2)

*Diagram: each guide does one job — SDK agent, routing, Studio, knowledge, extensions, or deploy.*

| Guide | Use it when |
|-------|-------------|
| [First Agent](/docs/guides/first-agent) | You want \`AgentExecutor(llm_provider=).run(agent=, task=)\` to return a report |
| [Multi-Agent](/docs/guides/multi-agent) | Meta should route \`@\`, \`delegate_to_avatar\`, or \`spawn_subagent\` |
| [Studio Server](/docs/guides/studio) | Near or an HTTP client must talk to \`agx serve\` |
| [Knowledge & RAG](/docs/guides/knowledge) | Documents should go through LiteParse → embed → \`knowledge_search\` |
| [Extensions](/docs/guides/extensions) | Skills, MCP, or an AGX Bundle need to become visible |
| [Deployment](/docs/guides/deployment) | \`create_studio_app()\` should stay up and keep \`~/.agenticx\` on disk |

!!! note "Not the Enterprise portal"
    Employee login, Admin Console, and the Go AI Gateway live under [Enterprise](/enterprise). This section stays on the local Python / Near path.
`,
  },
  zh: {
    title: '指南',
    description: 'Python / Near 路径上的 HOWTO。',
    content: `# 指南

这些页是**第一次跑通**。概念页讲循环；指南是最短的能用路径。

![六篇 HOWTO](/docs/svg/guides-map-zh.svg?v=2)

*示意图：每篇指南只做一件事——SDK 智能体、路由、Studio、知识库、扩展或部署。*

| 指南 | 什么时候用 |
|------|-----------|
| [第一个智能体](/docs/guides/first-agent) | 要用 \`AgentExecutor(llm_provider=).run(agent=, task=)\` 产出报告 |
| [多智能体](/docs/guides/multi-agent) | Meta 该路由 \`@\`、\`delegate_to_avatar\` 或 \`spawn_subagent\` |
| [Studio 服务](/docs/guides/studio) | Near 或 HTTP 客户端必须连 \`agx serve\` |
| [知识库与 RAG](/docs/guides/knowledge) | 文档要走 LiteParse → 向量化 → \`knowledge_search\` |
| [扩展与技能生态](/docs/guides/extensions) | 技能、MCP 或 AGX Bundle 要进入可见集 |
| [部署](/docs/guides/deployment) | \`create_studio_app()\` 要稳住，并把 \`~/.agenticx\` 留在磁盘 |

!!! note "不是 Enterprise 门户"
    员工登录、管理台和 Go AI 网关在 [Enterprise](/enterprise)。本节只走本机 Python / Near。
`,
  },
};
