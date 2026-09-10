export const changelogContent = {
  en: {
    title: 'Changelog',
    description: 'AgenticX version history and changes.',
    content: `# Changelog

All notable product changes are summarized here. Full history stays on [GitHub Releases](https://github.com/DemonDamon/AgenticX/releases).

## Capability snapshot

These items are in the current tree, not a marketing roadmap.

| Capability | Notes |
|---|---|
| Embeddable ReActAgent | Async function-calling loop, typed events, optional loop-detector / compactor / offloader |
| Unified offload | Large tool results leave live history and come back on demand |
| Skill self-evolution | Tool-call observations, session review, quality gate |
| Multi-brain knowledge | Isolatable doc brain + code brain, hybrid code index |
| Long-horizon coding | Isolated workspaces, stall healing, disk project state machine |
| Near Desktop | Local-first workspace over \`agx serve\` |
| IM channels | Feishu / WeCom / DingTalk / personal WeChat sidecar |
| Claude Code Bridge | Local HTTP / NDJSON control plane |
| AGX Bundles | Skills, MCP servers, avatars, memory templates |

## Earlier foundation

Avatar and group chat, MCP Hub, hierarchical memory, Studio SSE, and the Desktop workspace landed before the snapshot above. See [Roadmap](/docs/roadmap) for the M1-M17 module map.

## Honesty notes

- Studio does not yet send every operation through one complete \`SafetyLayer\`
- Some storage adapters are placeholders
- Enterprise Gateway is not the Python Agent Runtime
- Cluster / HA runtime remains planned
`,
  },
  zh: {
    title: '更新日志',
    description: 'AgenticX 版本历史与变更记录。',
    content: `# 更新日志

产品侧重要变更汇总如下。完整历史仍以 [GitHub Releases](https://github.com/DemonDamon/AgenticX/releases) 为准。

## 能力快照

这些项已经在当前代码树里，不是宣传用路线图。

| 能力 | 说明 |
|---|---|
| 可嵌入 ReActAgent | 异步 function-calling 循环、类型化事件、可选 loop-detector / compactor / offloader |
| 统一卸载 | 大工具结果离开热历史，需要时再取回 |
| 技能自进化 | 工具调用观察、会话复盘、质量门禁 |
| 多脑知识库 | 可隔离的文档脑 + 代码脑，混合代码索引 |
| 长周期编码 | 隔离工作区、停滞自愈、磁盘项目状态机 |
| Near 桌面 | 本地优先工作区，默认连 \`agx serve\` |
| IM 通道 | 飞书 / 企业微信 / 钉钉 / 个人微信 sidecar |
| Claude Code Bridge | 本机 HTTP / NDJSON 控制面 |
| AGX Bundle | skills、MCP、avatars、memory templates |

## 更早的基础

分身与群聊、MCP Hub、分层记忆、Studio SSE 与桌面工作区，都在上表之前落地。模块对照见 [路线图](/docs/roadmap)。

## 边界说明

- Studio 尚未把每次操作都送进完整的 \`SafetyLayer\`
- 部分存储适配器仍是占位
- Enterprise 网关不是 Python Agent Runtime
- 集群 / 高可用 Runtime 仍在规划中
`,
  },
};
