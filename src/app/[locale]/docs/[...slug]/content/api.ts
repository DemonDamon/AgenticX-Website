export const apiContent = {
  en: {
    title: 'API Reference',
    description: 'SDK constructors versus the Near / Studio chat loop.',
    content: `# API Reference

The **Agents** page is a field-level SDK reference for \`agenticx.core\`. Near chat does **not** use \`AgentExecutor\`. It uses \`AgentRuntime.run_turn\`.

![SDK types versus the chat loop](/docs/svg/api-map-en.svg?v=2)

*Diagram: construct AgentExecutor in your process; Near / Studio still run AgentRuntime.*

| Page | What is actually documented |
|------|-----------------------------|
| [Agents](/docs/api/agents) | \`Agent\`, \`Task\`, \`AgentExecutor(llm_provider=).run(agent=, task=)\` |
| [LLMs](/docs/concepts/llm-providers) | Provider config, green/red status, non-vision models |
| [Tools](/docs/concepts/tools) | \`@tool\`, \`dispatch_tool_async\`, MCP, \`skill_use\` |
| [Memory](/docs/concepts/memory) | \`MEMORY.md\`, \`messages.json\`, session SQLite |
| [Flow](/docs/concepts/flow) | \`@start\` / \`@listen\` / \`@router\`, \`kickoff()\` |

!!! warning "Sidebar labels"
    LLMs / Tools / Memory / Flow in the sidebar still open the **concept** pages until a dedicated SDK reference exists. Do not invent constructors that are not on those pages.

See also [Agent runtime](/docs/concepts/agent) and [CLI](/docs/cli).
`,
  },
  zh: {
    title: 'API 参考',
    description: 'SDK 构造器，以及它和 Near / Studio 对话循环的区别。',
    content: `# API 参考

**Agents** 页是 \`agenticx.core\` 的字段级 SDK 参考。Near 对话**不走** \`AgentExecutor\`，走 \`AgentRuntime.run_turn\`。

![SDK 类型与对话循环](/docs/svg/api-map-zh.svg?v=2)

*示意图：在你的进程里构造 AgentExecutor；Near / Studio 仍然跑 AgentRuntime。*

| 页面 | 实际写了什么 |
|------|-------------|
| [Agents](/docs/api/agents) | \`Agent\`、\`Task\`、\`AgentExecutor(llm_provider=).run(agent=, task=)\` |
| [LLMs](/docs/concepts/llm-providers) | 供应商配置、红绿状态、非视觉模型 |
| [Tools](/docs/concepts/tools) | \`@tool\`、\`dispatch_tool_async\`、MCP、\`skill_use\` |
| [Memory](/docs/concepts/memory) | \`MEMORY.md\`、\`messages.json\`、会话 SQLite |
| [Flow](/docs/concepts/flow) | \`@start\` / \`@listen\` / \`@router\`、\`kickoff()\` |

!!! warning "侧栏标签"
    侧栏里的 LLMs / Tools / Memory / Flow 在独立 SDK 页补齐前，打开的是**概念**页。不要发明那些页上没有的构造器。

另见 [智能体运行时](/docs/concepts/agent) 与 [CLI](/docs/cli)。
`,
  },
};
