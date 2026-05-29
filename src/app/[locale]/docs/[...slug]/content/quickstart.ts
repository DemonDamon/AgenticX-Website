export const quickstartContent = {
  en: {
    title: 'Quick Start',
    description: 'Get up and running in 5 minutes.',
    content: `# Quick Start

Get up and running in 5 minutes.

## 1. Install

\`\`\`bash
pip install agenticx
\`\`\`

## 2. Create Your First Agent

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

# Define the agent
agent = Agent(
    id="data-analyst",
    name="Data Analyst",
    role="Data Analysis Expert",
    goal="Help users analyze and understand data",
    organization_id="my-org"
)

# Define a task
task = Task(
    id="analysis-task",
    description="Analyze sales data trends for Q4 2025",
    expected_output="A detailed analysis report with key insights"
)

# Run
llm = OpenAIProvider(model="gpt-4o")
executor = AgentExecutor(agent=agent, llm=llm)
result = executor.run(task)
print(result)
\`\`\`

## 3. Add Tools

Give your agent the ability to call custom functions:

\`\`\`python
from agenticx.tools import tool
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

@tool
def calculate_sum(x: int, y: int) -> int:
    """Calculate the sum of two numbers."""
    return x + y

@tool
def search_web(query: str) -> str:
    """Search the web for information."""
    # integrate with your search provider
    return f"Results for: {query}"

agent = Agent(
    id="assistant",
    name="Assistant",
    role="General Assistant",
    goal="Help with any task",
    organization_id="my-org"
)

task = Task(
    description="What is 42 + 58?",
    expected_output="The numerical answer"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider(), tools=[calculate_sum, search_web])
result = executor.run(task)
\`\`\`

## 4. CLI Quick Start

After installation, the \`agx\` CLI is available:

\`\`\`bash
# Create a new project
agx project create my-agent --template basic
cd my-agent

# Start the Studio API server
agx serve --port 8000

# Run a workflow file
agx run workflows/my_pipeline.py --verbose
\`\`\`

## 5. Use the Studio UI

AgenticX ships with a web-based Studio for managing agents, sessions, and group chats:

\`\`\`bash
agx serve --port 8000
# Open http://localhost:8000 in your browser
\`\`\`

## Next Steps

- [Configuration →](/docs/getting-started/configuration)
- [Agent Core concepts →](/docs/concepts/agent)
- [Multi-Agent Collaboration →](/docs/guides/multi-agent)
- [CLI Reference →](/docs/cli)
`,
  },
  zh: {
    title: '快速上手',
    description: '5 分钟内完成安装并运行第一个智能体。',
    content: `# 快速上手

5 分钟内完成安装并运行第一个智能体。

## 1. 安装

\`\`\`bash
pip install agenticx
\`\`\`

## 2. 创建第一个智能体

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

# Define the agent
agent = Agent(
    id="data-analyst",
    name="Data Analyst",
    role="Data Analysis Expert",
    goal="Help users analyze and understand data",
    organization_id="my-org"
)

# Define a task
task = Task(
    id="analysis-task",
    description="Analyze sales data trends for Q4 2025",
    expected_output="A detailed analysis report with key insights"
)

# Run
llm = OpenAIProvider(model="gpt-4o")
executor = AgentExecutor(agent=agent, llm=llm)
result = executor.run(task)
print(result)
\`\`\`

## 3. 添加工具

为智能体接入自定义函数调用能力：

\`\`\`python
from agenticx.tools import tool
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

@tool
def calculate_sum(x: int, y: int) -> int:
    """Calculate the sum of two numbers."""
    return x + y

@tool
def search_web(query: str) -> str:
    """Search the web for information."""
    # integrate with your search provider
    return f"Results for: {query}"

agent = Agent(
    id="assistant",
    name="Assistant",
    role="General Assistant",
    goal="Help with any task",
    organization_id="my-org"
)

task = Task(
    description="What is 42 + 58?",
    expected_output="The numerical answer"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider(), tools=[calculate_sum, search_web])
result = executor.run(task)
\`\`\`

## 4. CLI 快速入门

安装完成后即可使用 \`agx\` CLI：

\`\`\`bash
# Create a new project
agx project create my-agent --template basic
cd my-agent

# Start the Studio API server
agx serve --port 8000

# Run a workflow file
agx run workflows/my_pipeline.py --verbose
\`\`\`

## 5. 使用 Studio UI

AgenticX 内置基于 Web 的 Studio，用于管理智能体、会话与群聊：

\`\`\`bash
agx serve --port 8000
# Open http://localhost:8000 in your browser
\`\`\`

## 下一步

- [配置 →](/docs/getting-started/configuration)
- [智能体核心概念 →](/docs/concepts/agent)
- [多智能体协作 →](/docs/guides/multi-agent)
- [CLI 参考 →](/docs/cli)
`,
  },
};
