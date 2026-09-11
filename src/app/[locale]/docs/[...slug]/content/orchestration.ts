export const orchestrationContent = {
  en: {
    title: 'Orchestration',
    description: 'Orchestration engine in AgenticX.',
    content: `# Orchestration

Use orchestration when **several agents or steps** must run in a fixed or conditional order. Do not use a graph for a single chat turn — that is \`AgentRuntime.run_turn\`.

Two complementary APIs:

- **Graph workflows** — explicit DAG (\`Workflow\`, \`Node\`, \`Edge\`)
- **Flow decorators** — a Python pipeline (\`@flow\`, \`@step\`); see [Flow](/docs/concepts/flow)

\`\`\`mermaid
flowchart LR
  fetch["fetch"] --> analyze["analyze"]
  analyze -->|high confidence| publish["publish"]
  analyze -->|low confidence| review["review"]
\`\`\`

---

## Graph-based Workflow

\`\`\`python
from agenticx.flow import Workflow, Node, Edge

workflow = Workflow(id="research-pipeline")

# Define nodes (each node is an agent task)
fetch = Node(id="fetch", agent=fetch_agent, task=fetch_task)
analyze = Node(id="analyze", agent=analyze_agent, task=analyze_task)
report = Node(id="report", agent=report_agent, task=report_task)

# Define edges (data flow)
workflow.add_edge(Edge(source="fetch", target="analyze"))
workflow.add_edge(Edge(source="analyze", target="report"))

result = workflow.run()
\`\`\`

---

## Conditional Routing

\`\`\`python
from agenticx.flow import ConditionalEdge

def route_based_on_result(output):
    if output.confidence > 0.8:
        return "publish"
    else:
        return "review"

workflow.add_edge(
    ConditionalEdge(
        source="analyze",
        condition=route_based_on_result,
        targets={"publish": publish_node, "review": review_node}
    )
)
\`\`\`

---

## Parallel Execution

\`\`\`python
from agenticx.flow import ParallelNode

# Run multiple agents concurrently
parallel = ParallelNode(
    id="parallel-research",
    nodes=[fetch_news, fetch_papers, fetch_code],
    merge_strategy="concat"
)
workflow.add_node(parallel)
\`\`\`

---

## Flow Decorators

For simpler pipelines, use the \`@flow\` decorator system:

\`\`\`python
from agenticx.flow import flow, step

@flow
class ResearchPipeline:

    @step
    def fetch_data(self, query: str) -> str:
        return self.fetch_agent.run(query)

    @step
    def analyze(self, data: str) -> dict:
        return self.analyze_agent.run(data)

    @step
    def generate_report(self, analysis: dict) -> str:
        return self.report_agent.run(analysis)

pipeline = ResearchPipeline()
result = pipeline.run(query="Latest AI research")
\`\`\`

---

## Execution Plans

For complex multi-step tasks, use execution plans:

\`\`\`python
from agenticx.planner import ExecutionPlan, PlanStep

plan = ExecutionPlan(
    steps=[
        PlanStep(id="1", description="Gather requirements", agent=analyst),
        PlanStep(id="2", description="Design architecture", agent=architect, depends_on=["1"]),
        PlanStep(id="3", description="Implement features", agent=developer, depends_on=["2"]),
        PlanStep(id="4", description="Write tests", agent=tester, depends_on=["3"]),
    ]
)

results = plan.execute()
\`\`\`
`,
  },
  zh: {
    title: '编排',
    description: 'AgenticX 编排引擎。',
    content: `# 编排

需要**多个智能体或步骤**按固定或条件顺序执行时才用编排。单轮对话请走 \`AgentRuntime.run_turn\`，不要硬套一张图。

两条互补 API：

- **图工作流** — 显式 DAG（\`Workflow\`、\`Node\`、\`Edge\`）
- **Flow 装饰器** — Python 流水线（\`@flow\`、\`@step\`）；见 [Flow](/docs/concepts/flow)

\`\`\`mermaid
flowchart LR
  fetch["抓取"] --> analyze["分析"]
  analyze -->|高置信度| publish["发布"]
  analyze -->|低置信度| review["复核"]
\`\`\`

---

## 基于图的工作流

\`\`\`python
from agenticx.flow import Workflow, Node, Edge

workflow = Workflow(id="research-pipeline")

# Define nodes (each node is an agent task)
fetch = Node(id="fetch", agent=fetch_agent, task=fetch_task)
analyze = Node(id="analyze", agent=analyze_agent, task=analyze_task)
report = Node(id="report", agent=report_agent, task=report_task)

# Define edges (data flow)
workflow.add_edge(Edge(source="fetch", target="analyze"))
workflow.add_edge(Edge(source="analyze", target="report"))

result = workflow.run()
\`\`\`

---

## 条件路由

\`\`\`python
from agenticx.flow import ConditionalEdge

def route_based_on_result(output):
    if output.confidence > 0.8:
        return "publish"
    else:
        return "review"

workflow.add_edge(
    ConditionalEdge(
        source="analyze",
        condition=route_based_on_result,
        targets={"publish": publish_node, "review": review_node}
    )
)
\`\`\`

---

## 并行执行

\`\`\`python
from agenticx.flow import ParallelNode

# Run multiple agents concurrently
parallel = ParallelNode(
    id="parallel-research",
    nodes=[fetch_news, fetch_papers, fetch_code],
    merge_strategy="concat"
)
workflow.add_node(parallel)
\`\`\`

---

## Flow 装饰器

对于更简单的流水线，可使用 \`@flow\` 装饰器体系：

\`\`\`python
from agenticx.flow import flow, step

@flow
class ResearchPipeline:

    @step
    def fetch_data(self, query: str) -> str:
        return self.fetch_agent.run(query)

    @step
    def analyze(self, data: str) -> dict:
        return self.analyze_agent.run(data)

    @step
    def generate_report(self, analysis: dict) -> str:
        return self.report_agent.run(analysis)

pipeline = ResearchPipeline()
result = pipeline.run(query="Latest AI research")
\`\`\`

---

## 执行计划

对于复杂的多步骤任务，可使用 execution plan：

\`\`\`python
from agenticx.planner import ExecutionPlan, PlanStep

plan = ExecutionPlan(
    steps=[
        PlanStep(id="1", description="Gather requirements", agent=analyst),
        PlanStep(id="2", description="Design architecture", agent=architect, depends_on=["1"]),
        PlanStep(id="3", description="Implement features", agent=developer, depends_on=["2"]),
        PlanStep(id="4", description="Write tests", agent=tester, depends_on=["3"]),
    ]
)

results = plan.execute()
\`\`\`
`,
  },
};
