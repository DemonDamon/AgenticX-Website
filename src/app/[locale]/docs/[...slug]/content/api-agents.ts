export const apiAgentsContent = {
  en: {
    title: 'Agents API',
    description: 'AgenticX agents API reference.',
    content: `# agenticx.agents

## Agent

\`\`\`python
class Agent(BaseModel):
    id: str
    name: str
    role: str
    goal: str
    backstory: str = ""
    organization_id: str
    max_iter: int = 10
    verbose: bool = False
\`\`\`

The core agent definition. Agents are stateless — all state lives in the executor context.

---

## AgentExecutor

\`\`\`python
class AgentExecutor:
    def __init__(
        self,
        agent: Agent,
        llm: BaseLLMProvider,
        tools: list[Callable] = [],
        memory: MemoryManager | None = None,
        tracer: BaseTracer | None = None,
        human_in_the_loop: HumanInTheLoop | None = None,
        sanitizer: InputSanitizer | None = None,
        policy: PolicyEngine | None = None,
    ): ...

    def run(self, task: Task) -> str: ...
    async def arun(self, task: Task) -> str: ...
\`\`\`

---

## Task

\`\`\`python
class Task(BaseModel):
    id: str = ""
    description: str
    expected_output: str = ""
    context: dict = {}
\`\`\`

---

## Tool decorator

\`\`\`python
from agenticx.tools import tool

@tool
def my_tool(param: str) -> str:
    """Tool description.
    
    Args:
        param: Parameter description
    
    Returns:
        Output description
    """
    return f"Processed: {param}"
\`\`\`

---

## Common patterns

### Basic agent

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="my-agent",
    name="Assistant",
    role="Helper",
    goal="Assist users"
)

task = Task(description="Help me with...")

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o")
)

result = executor.run(task)
\`\`\`

### With tools

\`\`\`python
@tool
def search(query: str) -> str:
    return f"Results for: {query}"

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o"),
    tools=[search]
)
\`\`\`

### With memory

\`\`\`python
from agenticx.memory import MemoryManager

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o"),
    memory=MemoryManager()
)
\`\`\`

!!! tip "Full API Reference"
    Auto-generated API docs from source code are coming soon. In the meantime, refer to the [source on GitHub](https://github.com/DemonDamon/AgenticX/tree/main/agenticx/agents).
`,
  },
  zh: {
    title: 'Agents API',
    description: 'AgenticX 智能体 API 参考。',
    content: `# agenticx.agents

## Agent

\`\`\`python
class Agent(BaseModel):
    id: str
    name: str
    role: str
    goal: str
    backstory: str = ""
    organization_id: str
    max_iter: int = 10
    verbose: bool = False
\`\`\`

核心智能体定义。智能体本身无状态——所有状态保存在执行器上下文中。

---

## AgentExecutor

\`\`\`python
class AgentExecutor:
    def __init__(
        self,
        agent: Agent,
        llm: BaseLLMProvider,
        tools: list[Callable] = [],
        memory: MemoryManager | None = None,
        tracer: BaseTracer | None = None,
        human_in_the_loop: HumanInTheLoop | None = None,
        sanitizer: InputSanitizer | None = None,
        policy: PolicyEngine | None = None,
    ): ...

    def run(self, task: Task) -> str: ...
    async def arun(self, task: Task) -> str: ...
\`\`\`

---

## Task

\`\`\`python
class Task(BaseModel):
    id: str = ""
    description: str
    expected_output: str = ""
    context: dict = {}
\`\`\`

---

## Tool 装饰器

\`\`\`python
from agenticx.tools import tool

@tool
def my_tool(param: str) -> str:
    """Tool description.
    
    Args:
        param: Parameter description
    
    Returns:
        Output description
    """
    return f"Processed: {param}"
\`\`\`

---

## 常见模式

### 基础智能体

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="my-agent",
    name="Assistant",
    role="Helper",
    goal="Assist users"
)

task = Task(description="Help me with...")

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o")
)

result = executor.run(task)
\`\`\`

### 带工具

\`\`\`python
@tool
def search(query: str) -> str:
    return f"Results for: {query}"

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o"),
    tools=[search]
)
\`\`\`

### 带记忆

\`\`\`python
from agenticx.memory import MemoryManager

executor = AgentExecutor(
    agent=agent,
    llm=OpenAIProvider(model="gpt-4o"),
    memory=MemoryManager()
)
\`\`\`

!!! tip "完整 API 参考"
    基于源码自动生成的 API 文档即将推出。在此之前，请参阅 [GitHub 源码](https://github.com/DemonDamon/AgenticX/tree/main/agenticx/agents)。
`,
  },
};
