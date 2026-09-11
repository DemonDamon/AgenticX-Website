export const longRunContent = {
  en: {
    title: 'Long-Horizon Coding',
    description: 'Keep a coding task alive across polls and retries with isolated workspaces and a disk state machine.',
    content: `# Long-Horizon Coding

Use this when a coding job is **longer than one chat turn**: it must survive polls, stalls, and retries without stuffing the full history into one prompt.

Do **not** turn this on for a short SDK \`AgentExecutor.run\`. That path does not need \`longrun\` or \`project_state\`.

\`\`\`mermaid
flowchart TB
  sources["manual / cron / project feature"] --> orch["longrun orchestrator"]
  orch --> ws["isolated TaskWorkspace"]
  ws --> impl["implement"]
  impl --> stall["stall detector"]
  stall -->|healthy| verify["verify"]
  stall -->|stuck| retry["retry / backoff"]
  retry --> impl
  verify --> commit["commit + token ledger"]
\`\`\`

## Orchestrator

\`agenticx/longrun/\` polls task sources, gives each task an isolated workspace, heals stalls, and applies continuation / failure backoff. Token use is counted incrementally (\`TaskTokenAccountant\`), not guessed from a single completion.

Shipped sources include a manual queue, cron, and project-feature source. Treat a source as real only if it is wired in \`longrun/sources/\`.

## Disk state machine

\`project_state\` keeps a versioned feature state on disk (init → implement → verify → commit). File locks and atomic writes make the loop auditable after a crash.

## Isolated workspace

\`TaskWorkspace\` pins the task to its own directory and rejects path escapes (\`TaskWorkspaceSecurityError\`). Hooks can fail closed (\`TaskWorkspaceHookError\`).

## Related

- [Agent Runtime](/docs/concepts/agent) — single-turn \`run_turn\` vs this multi-poll loop
- [Studio Server](/docs/guides/studio) — HTTP routes under \`longrun/studio_routes.py\`
- [Deployment](/docs/guides/deployment) — where long jobs should not share a laptop lid-sleep session
`,
  },
  zh: {
    title: '长周期编码',
    description: '用隔离工作区和磁盘状态机，在轮询与重试之间把编码任务续住。',
    content: `# 长周期编码

任务**长于一轮对话**时用这一套：要在轮询、停滞、重试之后还能续上，而不能把整段历史塞进一次提示。

短 SDK 调用走 \`AgentExecutor.run\` 即可，**不必**上 \`longrun\` 或 \`project_state\`。

\`\`\`mermaid
flowchart TB
  sources["手动 / cron / 项目 feature"] --> orch["longrun 编排器"]
  orch --> ws["隔离 TaskWorkspace"]
  ws --> impl["实现"]
  impl --> stall["停滞检测"]
  stall -->|健康| verify["校验"]
  stall -->|卡住| retry["重试 / 退避"]
  retry --> impl
  verify --> commit["提交 + token 账本"]
\`\`\`

## 编排器

\`agenticx/longrun/\` 轮询任务源，给每个任务隔离工作区，处理停滞，并做续跑 / 失败退避。Token 按增量记账（\`TaskTokenAccountant\`），不是看一次 completion 估出来。

已有来源包括手动队列、cron、项目 feature。只有 \`longrun/sources/\` 里接上的才算真源。

## 磁盘状态机

\`project_state\` 在磁盘上保存版本化 feature 状态（初始化 → 实现 → 校验 → 提交）。文件锁和原子写让崩溃后仍可审计。

## 隔离工作区

\`TaskWorkspace\` 把任务钉在自己的目录，拒绝路径逃逸（\`TaskWorkspaceSecurityError\`）。钩子可以失败即停（\`TaskWorkspaceHookError\`）。

## 相关页

- [智能体运行时](/docs/concepts/agent) — 单轮 \`run_turn\` 和这套多轮轮询的区别
- [Studio 服务](/docs/guides/studio) — \`longrun/studio_routes.py\` 上的 HTTP
- [部署](/docs/guides/deployment) — 长任务不该和笔记本合盖休眠抢同一会话
`,
  },
};
