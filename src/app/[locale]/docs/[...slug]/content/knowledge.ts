export const knowledgeContent = {
  en: {
    title: 'Knowledge & RAG',
    description: 'Document intelligence and RAG with AgenticX.',
    content: `# Knowledge & RAG

Near's knowledge panel manages **brains**: a document brain for \`knowledge_search\`, a code brain for \`code_search\`. Each brain has its own config, files, and index. Avatars mount zero or more brains.

The Python \`KnowledgeBase\` helper below is the library API (\`agenticx/memory/knowledge_base.py\`). Studio ingest goes through \`agenticx/studio/kb/\` and \`LiteParseAdapter\`. Do not treat them as one object.

\`\`\`mermaid
flowchart LR
  files["Files / folders"] --> parse["LiteParseAdapter"]
  parse --> chunk["chunk"]
  chunk --> embed["embedding batches"]
  embed --> store["Chroma default"]
  store --> search["knowledge_search"]
  code["Repo index"] --> codeSearch["code_search"]
\`\`\`

!!! warning "Embedding batch size"
    Bailian / DashScope embeddings reject batches larger than **10**. The provider layer must split to ≤10 or ingest fails with \`InvalidParameter: batch size is invalid\`.

Default vector store for Desktop is **Chroma**. Switching embedding config usually requires a rebuild. Ingest must show a real percent or phase, and failures must include filename, type, and a traceback summary.

---

## Document Ingestion

\`\`\`python
from agenticx.knowledge import KnowledgeBase

kb = KnowledgeBase(name="my-docs")

# Add documents
kb.add_file("report.pdf")
kb.add_url("https://example.com/article")
kb.add_text("AgenticX is a multi-agent framework...", source="manual")

# Process (chunk, embed, index)
kb.build()
\`\`\`

---

## Retrieval

\`\`\`python
# Vector retrieval
results = kb.search("What are the key features?", top_k=5)

# Hybrid retrieval (vector + BM25)
results = kb.search("key features", mode="hybrid", top_k=10)

# With reranking
results = kb.search("key features", mode="hybrid", rerank=True, top_k=5)
\`\`\`

---

## GraphRAG

For complex documents with rich relationships, use GraphRAG:

\`\`\`python
from agenticx.knowledge import GraphKnowledgeBase

gkb = GraphKnowledgeBase(
    name="research-papers",
    graph_backend="neo4j",  # or "nebula"
    neo4j_uri="bolt://localhost:7687"
)

gkb.add_file("research_paper.pdf")
gkb.build()  # Extracts entities and relationships

# Graph-aware retrieval
results = gkb.search("relationship between agent memory and performance")
\`\`\`

---

## Giving a Knowledge Base to an Agent

In Near, mount a document brain and let the model call \`knowledge_search\`. There is no \`KnowledgeBaseTool\` on the Studio path.

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

executor = AgentExecutor(llm_provider=OpenAIProvider(model="gpt-4o"))
result = executor.run(agent=agent, task=task)
\`\`\`

---

## Supported Document Formats

| Format | Studio path | Library notes |
|--------|-------------|---------------|
| PDF / DOCX / PPTX / images | \`LiteParseAdapter\` (\`npm i -g @llamaindex/liteparse\`) | Do not feed PDF bytes as raw text |
| \`.xlsx\` / \`.xls\` | Needs local LibreOffice | Hidden from the UI list if missing |
| Markdown / plain text | LiteParse or native | — |

---

## Embeddings

\`\`\`python
from agenticx.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
kb = KnowledgeBase(name="my-docs", embeddings=embeddings)
\`\`\`

Supported embedding providers: OpenAI, Bailian, SiliconFlow, LiteLLM.

---

## Vector Stores

| Store | Notes |
|-------|-------|
| **Faiss** | Local, fast, no server required |
| **Chroma** | Local or server mode |
| **Qdrant** | Production-grade, cloud available |
| **Milvus** | High-scale enterprise |
| **PgVector** | PostgreSQL extension |
| **Pinecone** | Managed cloud |
| **Weaviate** | Managed cloud with GraphQL |

Desktop knowledge base defaults to **Chroma**. Extra vector adapters exist in the tree; they are not all wired into the Studio main path.

---

## Multi-brain knowledge

![Document brain and code brain](/diagrams/knowledge-brains.svg)

Current tree can isolate and mount a **document brain** plus a **code brain**, then optionally search across mounted brains.

- Document brain: ingest, chunk, embed, retrieve
- Code brain: hybrid semantic index over one or more codebases
- Cross-brain search is optional, not a forced merge of every index

See [Skills](/docs/concepts/skills) and [Long-horizon coding](/docs/concepts/long-run) for neighboring v0.5 capabilities.
`
  },
  zh: {
    title: '知识与 RAG',
    description: '使用 AgenticX 构建文档智能与 RAG。',
    content: `# 知识与 RAG

Near 知识库面板管的是**脑**：文档脑走 \`knowledge_search\`，代码脑走 \`code_search\`。每个脑有自己的配置、文件和索引。分身可以挂零个或多个脑。

下面的 Python \`KnowledgeBase\` 是库 API（\`agenticx/memory/knowledge_base.py\`）。Studio 入库走 \`agenticx/studio/kb/\` 和 \`LiteParseAdapter\`。不要把它们当成同一个对象。

\`\`\`mermaid
flowchart LR
  files["文件 / 文件夹"] --> parse["LiteParseAdapter"]
  parse --> chunk["分块"]
  chunk --> embed["embedding 分批"]
  embed --> store["默认 Chroma"]
  store --> search["knowledge_search"]
  code["仓库索引"] --> codeSearch["code_search"]
\`\`\`

!!! warning "Embedding 批量上限"
    百炼 / DashScope embedding 拒绝大于 **10** 的 batch。提供方必须按 ≤10 拆批，否则入库会报 \`InvalidParameter: batch size is invalid\`。

Desktop 默认向量库是 **Chroma**。改 embedding 配置通常要重建索引。入库必须露出真实百分比或阶段；失败须带文件名、类型和 traceback 摘要。

---

## 文档入库

\`\`\`python
from agenticx.knowledge import KnowledgeBase

kb = KnowledgeBase(name="my-docs")

# Add documents
kb.add_file("report.pdf")
kb.add_url("https://example.com/article")
kb.add_text("AgenticX is a multi-agent framework...", source="manual")

# Process (chunk, embed, index)
kb.build()
\`\`\`

---

## 检索

\`\`\`python
# Vector retrieval
results = kb.search("What are the key features?", top_k=5)

# Hybrid retrieval (vector + BM25)
results = kb.search("key features", mode="hybrid", top_k=10)

# With reranking
results = kb.search("key features", mode="hybrid", rerank=True, top_k=5)
\`\`\`

---

## GraphRAG

对于关系复杂的文档，可使用 GraphRAG：

\`\`\`python
from agenticx.knowledge import GraphKnowledgeBase

gkb = GraphKnowledgeBase(
    name="research-papers",
    graph_backend="neo4j",  # or "nebula"
    neo4j_uri="bolt://localhost:7687"
)

gkb.add_file("research_paper.pdf")
gkb.build()  # Extracts entities and relationships

# Graph-aware retrieval
results = gkb.search("relationship between agent memory and performance")
\`\`\`

---

## 为智能体挂载知识库

在 Near 里挂文档脑，让模型调 \`knowledge_search\`。Studio 路径上没有 \`KnowledgeBaseTool\`。

\`\`\`python
from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

executor = AgentExecutor(llm_provider=OpenAIProvider(model="gpt-4o"))
result = executor.run(agent=agent, task=task)
\`\`\`

---

## 支持的文档格式

| 格式 | Studio 路径 | 库侧说明 |
|------|-------------|----------|
| PDF / DOCX / PPTX / 图片 | \`LiteParseAdapter\`（\`npm i -g @llamaindex/liteparse\`） | 不要把 PDF 当原始文本塞给模型 |
| \`.xlsx\` / \`.xls\` | 需要本机 LibreOffice | 未安装时从 UI 支持列表剔除 |
| Markdown / 纯文本 | LiteParse 或原生 | — |

---

## 嵌入（Embeddings）

\`\`\`python
from agenticx.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
kb = KnowledgeBase(name="my-docs", embeddings=embeddings)
\`\`\`

支持的 embedding 供应商：OpenAI、Bailian、SiliconFlow、LiteLLM。

---

## 向量存储

| 存储 | 说明 |
|-------|-------|
| **Faiss** | 本地、快速，无需独立服务 |
| **Chroma** | 本地或 server 模式 |
| **Qdrant** | 生产级，支持云端 |
| **Milvus** | 大规模企业场景 |
| **PgVector** | PostgreSQL 扩展 |
| **Pinecone** | 托管云服务 |
| **Weaviate** | 托管云服务，支持 GraphQL |

桌面知识库默认向量后端是 **Chroma**。仓库里还有其它向量适配器，并非都已接到 Studio 主路径。

---

## 多脑知识库

![文档脑与代码脑](/diagrams/knowledge-brains.svg)

当前代码树可以把 **文档脑** 与 **代码脑** 隔离挂载，并可选地做跨脑检索。

- 文档脑：入库、分块、嵌入、检索
- 代码脑：对一个或多个代码库做混合语义索引
- 跨脑检索是可选能力，不会强制合并所有索引

相邻的 v0.5 能力见 [技能](/docs/concepts/skills) 与 [长周期编码](/docs/concepts/long-run)。
`
  },
};
