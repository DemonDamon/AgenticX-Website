export const firstAgentContent = {
  en: {
    title: 'Building Your First Agent',
    description: 'Step-by-step guide to building a research agent.',
    content: `# Building Your First Agent

Build a research agent that takes a topic, calls tools, and returns a structured report. This is the **SDK** path: \`Agent\` + \`Task\` + \`AgentExecutor\`. For Near chat, start \`agx serve\` instead — see [Quickstart](/docs/getting-started/quickstart).

\`\`\`mermaid
flowchart LR
  topic["Topic"] --> task["Task"]
  task --> exec["AgentExecutor.run"]
  exec --> llm["LLM"]
  llm -->|tool_calls| tools["search / fetch"]
  tools --> llm
  llm -->|text| report["Report"]
\`\`\`

!!! warning "Constructor vs run"
    \`AgentExecutor\` takes \`llm_provider=\`. Pass the agent into \`run(agent=, task=)\`. There is no \`max_iter\` or \`verbose\` on \`Agent\` — use \`max_iterations\`.

---

## Step 1: Set up

\`\`\`bash
pip install agenticx
export OPENAI_API_KEY="your-key"
\`\`\`

---

## Step 2: Define tools

\`\`\`python
from agenticx.tools import tool
import httpx

@tool
def search_web(query: str) -> str:
    """Search the web for information about a topic.

    Args:
        query: The search query
    """
    response = httpx.get(
        "https://api.search.com/search",
        params={"q": query, "key": "your-api-key"},
        timeout=30,
    )
    return response.text

@tool
def fetch_page(url: str) -> str:
    """Fetch the first 5000 characters of a web page.

    Args:
        url: The URL to fetch
    """
    response = httpx.get(url, follow_redirects=True, timeout=30)
    return response.text[:5000]
\`\`\`

Replace the search URL with a real API. \`@tool\` wraps a function as a \`FunctionTool\` / \`BaseTool\`.

---

## Step 3: Define the agent

\`\`\`python
from agenticx import Agent

research_agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Senior Research Analyst",
    goal=(
        "Conduct thorough research on any given topic. "
        "Find authoritative sources, synthesize information, "
        "and produce clear, well-structured reports."
    ),
    backstory=(
        "You are an expert researcher with a background in "
        "information synthesis and critical analysis."
    ),
    organization_id="my-research-org",
    max_iterations=15,
    tools=[search_web, fetch_page],
)
\`\`\`

---

## Step 4: Run a task

\`\`\`python
from agenticx import Task, AgentExecutor
from agenticx.llms import OpenAIProvider

task = Task(
    description="Research: Multi-agent AI systems and software development",
    expected_output=(
        "A structured research report with:\\n"
        "1. Executive summary\\n"
        "2. Key findings\\n"
        "3. Detailed analysis\\n"
        "4. Sources and references"
    ),
)

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[search_web, fetch_page],
)
result = executor.run(agent=research_agent, task=task)
print(result)
\`\`\`

\`run\` returns a **dict** with the final output and metadata, not a bare string.

---

## Next

- [Agent runtime](/docs/concepts/agent) — \`AgentRuntime\` vs \`AgentExecutor\`
- [Tools](/docs/concepts/tools) — MCP, Studio tools, OpenAPI
- [Near Desktop](/docs/concepts/near) — same stack, chat UI instead of a script
`,
  },
  zh: {
    title: '构建你的第一个智能体',
    description: '分步构建一个研究型智能体。',
    content: `# 构建你的第一个智能体

做一个研究型智能体：接收主题、调用工具、产出结构化报告。这是 **SDK** 路径：\`Agent\` + \`Task\` + \`AgentExecutor\`。Near 聊天请走 \`agx serve\`，见 [快速上手](/docs/getting-started/quickstart)。

\`\`\`mermaid
flowchart LR
  topic["主题"] --> task["Task"]
  task --> exec["AgentExecutor.run"]
  exec --> llm["LLM"]
  llm -->|tool_calls| tools["搜索 / 抓取"]
  tools --> llm
  llm -->|文本| report["报告"]
\`\`\`

!!! warning "构造与 run 分开"
    \`AgentExecutor\` 收 \`llm_provider=\`。智能体要传给 \`run(agent=, task=)\`。\`Agent\` 上没有 \`max_iter\` 或 \`verbose\`，请用 \`max_iterations\`。

---

## 第 1 步：安装

\`\`\`bash
pip install agenticx
export OPENAI_API_KEY="your-key"
\`\`\`

---

## 第 2 步：定义工具

\`\`\`python
from agenticx.tools import tool
import httpx

@tool
def search_web(query: str) -> str:
    """按主题搜索网页。

    Args:
        query: 搜索词
    """
    response = httpx.get(
        "https://api.search.com/search",
        params={"q": query, "key": "your-api-key"},
        timeout=30,
    )
    return response.text

@tool
def fetch_page(url: str) -> str:
    """抓取网页前 5000 个字符。

    Args:
        url: 要抓取的 URL
    """
    response = httpx.get(url, follow_redirects=True, timeout=30)
    return response.text[:5000]
\`\`\`

把搜索 URL 换成真实 API。\`@tool\` 会把函数包成 \`FunctionTool\` / \`BaseTool\`。

---

## 第 3 步：定义智能体

\`\`\`python
from agenticx import Agent

research_agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Senior Research Analyst",
    goal=(
        "对给定主题做充分调研。"
        "找权威来源，综合信息，产出结构清楚的报告。"
    ),
    backstory="你是信息综合与批判分析方面的研究者。",
    organization_id="my-research-org",
    max_iterations=15,
    tools=[search_web, fetch_page],
)
\`\`\`

---

## 第 4 步：跑任务

\`\`\`python
from agenticx import Task, AgentExecutor
from agenticx.llms import OpenAIProvider

task = Task(
    description="调研：多智能体 AI 与软件开发",
    expected_output=(
        "结构化调研报告，含：\\n"
        "1. 摘要\\n"
        "2. 关键发现\\n"
        "3. 详细分析\\n"
        "4. 来源"
    ),
)

executor = AgentExecutor(
    llm_provider=OpenAIProvider(model="gpt-4o"),
    tools=[search_web, fetch_page],
)
result = executor.run(agent=research_agent, task=task)
print(result)
\`\`\`

\`run\` 返回带最终产出和元数据的 **dict**，不是裸字符串。

---

## 接下来

- [智能体运行时](/docs/concepts/agent) — \`AgentRuntime\` 与 \`AgentExecutor\`
- [工具](/docs/concepts/tools) — MCP、Studio 工具、OpenAPI
- [Near 桌面](/docs/concepts/near) — 同一套栈，换成聊天界面
`,
  },
};
