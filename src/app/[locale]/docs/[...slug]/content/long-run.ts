export const longRunContent = {
  en: {
    title: 'Long-Horizon Coding',
    description: 'Long-run orchestration and the disk-backed project state machine.',
    content: `# Long-Horizon Coding

AgenticX can keep a coding task alive across polls, stalls, and retries without stuffing the entire history into one prompt.

## Long-run orchestration

The \`longrun\` module polls task sources (manual queue, Cron, and project features), gives each task an isolated workspace, heals stalls, and uses continuation / failure backoff with incremental token accounting.

## Project state machine

\`project_state\` keeps a versioned feature state machine on disk. File locks and atomic writes make the loop auditable: init, implement, verify, commit.

Use this when a task is longer than one chat turn. Short SDK calls still go through \`Agent\` / \`ReActAgent\` and do not need the state machine.
`,
  },
  zh: {
    title: '长周期编码',
    description: '长任务编排，以及落在磁盘上的项目状态机。',
    content: `# 长周期编码

AgenticX 可以在轮询、停滞和重试之间把编码任务续住，而不把整段历史塞进一次提示。

## 长任务编排

\`longrun\` 会轮询任务源（手动队列、Cron、项目 feature），给每个任务隔离工作区，处理停滞，并用续跑 / 失败退避加上增量 token 记账。

## 项目状态机

\`project_state\` 在磁盘上维护版本化的 feature 状态机。文件锁与原子写让闭环可审计：初始化、实现、校验、提交。

任务长于一轮对话时再用这一套。短调用仍走 \`Agent\` / \`ReActAgent\`，不必上状态机。
`,
  },
};
