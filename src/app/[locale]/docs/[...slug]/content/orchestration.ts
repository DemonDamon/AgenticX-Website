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

## Worked example: @ in a group, not a fake team constructor

**Scene.** In a Near group, you want the researcher to scan issues. You do not construct \`AgentTeamManager(agents=[...])\`.

1. Create a group (Meta is implicit). Type \`@研究员 把未关闭 issue 扫一遍\`.
2. \`group_router\` should send that turn to the named member. Their reply talks to **you**, not a courtesy ping to Meta.
3. Progress (“received / calling tool / done”) folds into **one** card for that avatar.
4. If you skip \`@\` but the text clearly names their job, routing should still prefer that member. Otherwise Meta plans or \`delegate_to_avatar\`.

**What you should see.** One researcher thread, one progress card, a final answer. \`delegate_to_avatar\` runs in that avatar’s real session so history is on the avatar, not a shadow spawn.

![Group chat @-routing to one avatar](/docs/cases/group-route.png)

*Illustration: one @, one foldable card, reply to the human.*

SDK graphs (\`Workflow\` / Flow) are for in-process pipelines. They are not how Near group chat is wired.

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

## 实践案例：群里 @，不要假的团队构造

**场景。** Near 群聊里让研究员扫 issue。不要写 \`AgentTeamManager(agents=[...])\`。

1. 建群（默认带 Meta）。输入 \`@研究员 把未关闭 issue 扫一遍\`。
2. \`group_router\` 应把这轮交给该成员。他的回复对着**你**，不是客套 @ Meta。
3. 「已接收 / 正在调用 / 完成」折进该分身**一张**卡。
4. 没写 @ 但正文明显是他的职责，也应优先他。否则 Meta 统筹或 \`delegate_to_avatar\`。

**你会看到。** 研究员一条线、一张进度卡、最终回答。\`delegate_to_avatar\` 跑在该分身真实 session，历史留在分身侧，不是影子 spawn。

![群聊 @ 路由到一个分身](/docs/cases/group-route.png)

*界面示意：一次 @、一张可折叠卡、对用户说话。*

SDK 里的图（\`Workflow\` / Flow）是进程内流水线，不是 Near 群聊的接线方式。

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
