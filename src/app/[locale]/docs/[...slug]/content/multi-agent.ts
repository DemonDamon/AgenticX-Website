export const multiAgentContent = {
  en: {
    title: 'Multi-Agent Collaboration',
    description: 'Build multi-agent systems with AgenticX.',
    content: `# Multi-Agent Collaboration

## Overview

AgenticX is designed from the ground up for multi-agent systems. Multiple agents can collaborate on complex tasks through delegation, parallel execution, and structured communication protocols.

---

## Agent Teams

\`\`\`python
from agenticx.runtime import AgentTeamManager
from agenticx import Agent
from agenticx.llms import OpenAIProvider

llm = OpenAIProvider(model="gpt-4o")

# Define team members
researcher = Agent(id="researcher", name="Researcher", role="Information Gatherer",
                   goal="Find accurate information", organization_id="team")
analyst = Agent(id="analyst", name="Analyst", role="Data Analyst",
                goal="Analyze and interpret data", organization_id="team")
writer = Agent(id="writer", name="Writer", role="Content Writer",
               goal="Produce clear written content", organization_id="team")

# Team manager handles concurrency, session isolation, and agent lifecycle
team = AgentTeamManager(agents=[researcher, analyst, writer], max_concurrency=3)
\`\`\`

---

## Meta-Agent Pattern

The Meta-Agent acts as a CEO/project manager, dispatching work to specialized sub-agents:

\`\`\`
User Request
    ↓
Meta-Agent (analyzes, plans, delegates)
    ↓
┌───────────────────────────────┐
│  Researcher │ Analyst │ Writer │  ← Sub-agents running concurrently
└───────────────────────────────┘
    ↓
Meta-Agent (aggregates, synthesizes)
    ↓
Final Response to User
\`\`\`

The Meta-Agent maintains an active snapshot of all running sub-agents and injects their status into its system prompt each turn.

---

## A2A Communication Protocol

Agents can communicate directly using the A2A (Agent-to-Agent) protocol:

\`\`\`python
from agenticx.protocols.a2a import A2AClient, A2AServer, AgentCard

# Publish an agent as an A2A service
card = AgentCard(
    agent_id="researcher",
    skills=["web_search", "document_analysis"],
    endpoint="http://localhost:8001"
)
server = A2AServer(agent=researcher, card=card)
server.start()

# Another agent calls it
client = A2AClient()
result = client.invoke_skill(
    agent_id="researcher",
    skill="web_search",
    params={"query": "latest AI papers"}
)
\`\`\`

---

## Parallel Execution

Run multiple agents simultaneously:

\`\`\`python
from agenticx.flow import ParallelExecutor

executor = ParallelExecutor(max_workers=4)

tasks = [
    (researcher, Task(description="Research topic A")),
    (researcher, Task(description="Research topic B")),
    (researcher, Task(description="Research topic C")),
]

results = executor.run_all(tasks)
\`\`\`

---

## Human-in-the-Loop

Pause agent execution to get human approval:

\`\`\`python
from agenticx.runtime import HumanInTheLoop

hitl = HumanInTheLoop(
    trigger_on=["tool_call:delete_file", "tool_call:send_email"],
    timeout_seconds=300,
    default_action="reject"  # auto-reject if no human response
)

executor = AgentExecutor(agent=agent, llm=llm, human_in_the_loop=hitl)
\`\`\`

---

## Session Isolation

Each agent team run is isolated by \`owner_session_id\`, preventing cross-contamination between concurrent sessions. The global registry allows looking up agent status across sessions for monitoring purposes.
`,
  },
  zh: {
    title: '多智能体协作',
    description: '使用 AgenticX 构建多智能体系统。',
    content: `# 多智能体协作

## 概述

AgenticX 从设计之初就面向多智能体系统。多个智能体可通过委派、并行执行与结构化通信协议协作完成复杂任务。

---

## 智能体团队

\`\`\`python
from agenticx.runtime import AgentTeamManager
from agenticx import Agent
from agenticx.llms import OpenAIProvider

llm = OpenAIProvider(model="gpt-4o")

# Define team members
researcher = Agent(id="researcher", name="Researcher", role="Information Gatherer",
                   goal="Find accurate information", organization_id="team")
analyst = Agent(id="analyst", name="Analyst", role="Data Analyst",
                goal="Analyze and interpret data", organization_id="team")
writer = Agent(id="writer", name="Writer", role="Content Writer",
               goal="Produce clear written content", organization_id="team")

# Team manager handles concurrency, session isolation, and agent lifecycle
team = AgentTeamManager(agents=[researcher, analyst, writer], max_concurrency=3)
\`\`\`

---

## Meta-Agent 模式

Meta-Agent 充当 CEO/项目经理，将工作分派给专职子智能体：

\`\`\`
User Request
    ↓
Meta-Agent (analyzes, plans, delegates)
    ↓
┌───────────────────────────────┐
│  Researcher │ Analyst │ Writer │  ← Sub-agents running concurrently
└───────────────────────────────┘
    ↓
Meta-Agent (aggregates, synthesizes)
    ↓
Final Response to User
\`\`\`

Meta-Agent 维护所有运行中子智能体的活跃快照，并在每轮对话中将其状态注入系统提示。

---

## A2A 通信协议

智能体可通过 A2A（Agent-to-Agent）协议直接通信：

\`\`\`python
from agenticx.protocols.a2a import A2AClient, A2AServer, AgentCard

# Publish an agent as an A2A service
card = AgentCard(
    agent_id="researcher",
    skills=["web_search", "document_analysis"],
    endpoint="http://localhost:8001"
)
server = A2AServer(agent=researcher, card=card)
server.start()

# Another agent calls it
client = A2AClient()
result = client.invoke_skill(
    agent_id="researcher",
    skill="web_search",
    params={"query": "latest AI papers"}
)
\`\`\`

---

## 并行执行

同时运行多个智能体：

\`\`\`python
from agenticx.flow import ParallelExecutor

executor = ParallelExecutor(max_workers=4)

tasks = [
    (researcher, Task(description="Research topic A")),
    (researcher, Task(description="Research topic B")),
    (researcher, Task(description="Research topic C")),
]

results = executor.run_all(tasks)
\`\`\`

---

## 人在回路（Human-in-the-Loop）

暂停智能体执行以获取人工审批：

\`\`\`python
from agenticx.runtime import HumanInTheLoop

hitl = HumanInTheLoop(
    trigger_on=["tool_call:delete_file", "tool_call:send_email"],
    timeout_seconds=300,
    default_action="reject"  # auto-reject if no human response
)

executor = AgentExecutor(agent=agent, llm=llm, human_in_the_loop=hitl)
\`\`\`

---

## 会话隔离

每次智能体团队运行通过 \`owner_session_id\` 隔离，避免并发会话间相互污染。全局注册表支持跨会话查询智能体状态，便于监控。
`,
  },
};
