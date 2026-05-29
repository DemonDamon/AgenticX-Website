export const flowContent = {
  en: {
    title: 'Flow & Workflow',
    description: 'Flow and workflow engine in AgenticX.',
    content: `# Flow & Workflow Engine

AgenticX exposes two complementary ways to orchestrate multi-step logic: a **decorator-driven Flow system** for in-process method graphs, and a **configuration-driven \`WorkflowEngine\`** for graph-based execution.

---

## Overview

| Layer | Module | Best for |
|-------|--------|----------|
| Flow | \`agenticx.flow\` | Python classes with \`@start\` / \`@listen\` / \`@router\` |
| Execution plan | \`agenticx.flow.execution_plan\` | Staged goals, pause/resume, persistence |
| Graph engine | \`agenticx.core.graph\` | Async nodes returning next node or \`End\` |
| Workflow engine | \`agenticx.core.workflow_engine\` | \`Workflow\` / \`WorkflowGraph\`, concurrent branches |

---

## Flow system

### \`Flow\` base class

- Generic over state type **\`T\`** (dict or Pydantic model).
- Entry points: **\`kickoff()\`** (sync) and **\`kickoff_async()\`**.

### Decorators

| Decorator | Role |
|-----------|------|
| **\`@start()\`** | Unconditional entry point |
| **\`@listen(...)\`** | Runs when trigger condition is satisfied |
| **\`@router(...)\`** | Returns a string label for routing |

### Example: simple data pipeline

\`\`\`python
from agenticx.flow import Flow, start, listen, router

class DataPipeline(Flow[dict]):
    @start()
    def fetch_data(self):
        return {"data": [1, 2, 3]}

    @listen("fetch_data")
    def process_data(self, result):
        return {"processed": [x * 2 for x in result["data"]]}

    @router("process_data")
    def branch(self, result):
        values = result.get("processed", [])
        return "NONEMPTY" if values else "EMPTY"

    @listen("NONEMPTY")
    def on_success(self):
        self.state["status"] = "ok"

    @listen("EMPTY")
    def on_empty(self):
        self.state["status"] = "empty"

flow = DataPipeline()
flow.kickoff()
\`\`\`

---

## Execution plan

### \`ExecutionPlan\`

| Field | Description |
|-------|-------------|
| **\`stages\`** | List of \`ExecutionStage\` |
| **\`current_stage_index\`** | Index of the active stage |
| **\`intervention_state\`** | \`InterventionState\` for external control |

### \`ExecutionStage\` and \`Subtask\`

- **\`ExecutionStage\`**: name, \`subtasks\`, \`status\`
- **\`Subtask\`**: \`id\`, \`name\`, \`query\`, \`status\`, result/error

### Core capabilities

- **\`ExecutionPlan.to_mermaid()\`**: returns a Mermaid diagram string
- **\`pause()\` / \`resume()\` / \`reset_node(subtask_id)\`**
- **\`overall_progress\`**: fraction of subtasks completed

---

## Graph engine

**Module:** \`agenticx.core.graph\`

Each node implements **\`BaseNode.run(ctx) -> NextNode | End[T]\`**, and edges are inferred from return type annotations.

\`\`\`python
from agenticx.core.graph import Graph, BaseNode, End, GraphRunContext

class StartNode(BaseNode):
    async def run(self, ctx: GraphRunContext) -> ProcessNode | End[str]:
        # Do work
        return ProcessNode()

class ProcessNode(BaseNode):
    async def run(self, ctx: GraphRunContext) -> End[str]:
        return End(result="done")

graph = Graph(nodes=[StartNode, ProcessNode])
result = await graph.run(StartNode())
\`\`\`

---

## WorkflowEngine

**Module:** \`agenticx.core.workflow_engine\`

- **\`WorkflowEngine\`** runs a **\`Workflow\`** model or **\`WorkflowGraph\`**
- **Concurrency**: entry nodes and downstream fan-out run via \`asyncio.gather\`
- **Condition routing**: edges may encode JSON \`condition_config\`
- **Observability**: \`ExecutionContext\` holds \`event_log\`

---

## Quick reference imports

\`\`\`python
# Flow
from agenticx.flow import (
    Flow,
    FlowState,
    start,
    listen,
    router,
    or_,
    and_,
)

# Execution plan
from agenticx.flow import (
    ExecutionPlan,
    ExecutionStage,
    Subtask,
    ExecutionPlanManager,
)

# Graph
from agenticx.core.graph import Graph, BaseNode, End, GraphRunContext

# Workflow
from agenticx.core.workflow_engine import WorkflowEngine, WorkflowGraph
\`\`\`
`,
  },
  zh: {
    title: 'Flow 与工作流',
    description: 'AgenticX 中的 Flow 与工作流引擎。',
    content: `# Flow 与工作流引擎

AgenticX 提供两种互补的多步骤编排方式：**装饰器驱动的 Flow 系统**（进程内方法图），以及 **配置驱动的 \`WorkflowEngine\`**（基于图的执行）。

---

## 概述

| Layer | Module | Best for |
|-------|--------|----------|
| Flow | \`agenticx.flow\` | Python classes with \`@start\` / \`@listen\` / \`@router\` |
| Execution plan | \`agenticx.flow.execution_plan\` | Staged goals, pause/resume, persistence |
| Graph engine | \`agenticx.core.graph\` | Async nodes returning next node or \`End\` |
| Workflow engine | \`agenticx.core.workflow_engine\` | \`Workflow\` / \`WorkflowGraph\`, concurrent branches |

---

## Flow 系统

### \`Flow\` 基类

- 泛型状态类型 **\`T\`**（dict 或 Pydantic model）。
- 入口：**\`kickoff()\`**（同步）与 **\`kickoff_async()\`**。

### 装饰器

| Decorator | Role |
|-----------|------|
| **\`@start()\`** | Unconditional entry point |
| **\`@listen(...)\`** | Runs when trigger condition is satisfied |
| **\`@router(...)\`** | Returns a string label for routing |

### 示例：简单数据流水线

\`\`\`python
from agenticx.flow import Flow, start, listen, router

class DataPipeline(Flow[dict]):
    @start()
    def fetch_data(self):
        return {"data": [1, 2, 3]}

    @listen("fetch_data")
    def process_data(self, result):
        return {"processed": [x * 2 for x in result["data"]]}

    @router("process_data")
    def branch(self, result):
        values = result.get("processed", [])
        return "NONEMPTY" if values else "EMPTY"

    @listen("NONEMPTY")
    def on_success(self):
        self.state["status"] = "ok"

    @listen("EMPTY")
    def on_empty(self):
        self.state["status"] = "empty"

flow = DataPipeline()
flow.kickoff()
\`\`\`

---

## 执行计划

### \`ExecutionPlan\`

| Field | Description |
|-------|-------------|
| **\`stages\`** | List of \`ExecutionStage\` |
| **\`current_stage_index\`** | Index of the active stage |
| **\`intervention_state\`** | \`InterventionState\` for external control |

### \`ExecutionStage\` 与 \`Subtask\`

- **\`ExecutionStage\`**：name、\`subtasks\`、\`status\`
- **\`Subtask\`**：\`id\`、\`name\`、\`query\`、\`status\`、result/error

### 核心能力

- **\`ExecutionPlan.to_mermaid()\`**：返回 Mermaid 图字符串
- **\`pause()\` / \`resume()\` / \`reset_node(subtask_id)\`**
- **\`overall_progress\`**：已完成子任务占比

---

## 图引擎

**Module:** \`agenticx.core.graph\`

每个节点实现 **\`BaseNode.run(ctx) -> NextNode | End[T]\`**，边由返回类型注解推断。

\`\`\`python
from agenticx.core.graph import Graph, BaseNode, End, GraphRunContext

class StartNode(BaseNode):
    async def run(self, ctx: GraphRunContext) -> ProcessNode | End[str]:
        # Do work
        return ProcessNode()

class ProcessNode(BaseNode):
    async def run(self, ctx: GraphRunContext) -> End[str]:
        return End(result="done")

graph = Graph(nodes=[StartNode, ProcessNode])
result = await graph.run(StartNode())
\`\`\`

---

## WorkflowEngine

**Module:** \`agenticx.core.workflow_engine\`

- **\`WorkflowEngine\`** 运行 **\`Workflow\`** 模型或 **\`WorkflowGraph\`**
- **并发**：入口节点与下游扇出通过 \`asyncio.gather\` 执行
- **条件路由**：边可编码 JSON \`condition_config\`
- **可观测性**：\`ExecutionContext\` 持有 \`event_log\`

---

## 快速参考 import

\`\`\`python
# Flow
from agenticx.flow import (
    Flow,
    FlowState,
    start,
    listen,
    router,
    or_,
    and_,
)

# Execution plan
from agenticx.flow import (
    ExecutionPlan,
    ExecutionStage,
    Subtask,
    ExecutionPlanManager,
)

# Graph
from agenticx.core.graph import Graph, BaseNode, End, GraphRunContext

# Workflow
from agenticx.core.workflow_engine import WorkflowEngine, WorkflowGraph
\`\`\`
`,
  },
};
