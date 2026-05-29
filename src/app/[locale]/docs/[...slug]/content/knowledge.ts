export const knowledgeContent = {
  en: {
    title: 'Knowledge & RAG',
    description: 'Document intelligence and RAG with AgenticX.',
    content: `# Knowledge & RAG

## Overview

AgenticX provides a complete document intelligence pipeline — from ingestion and chunking to hybrid retrieval and GraphRAG.

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

\`\`\`python
from agenticx.tools import KnowledgeBaseTool

kb_tool = KnowledgeBaseTool(knowledge_base=kb)

executor = AgentExecutor(
    agent=agent,
    llm=llm,
    tools=[kb_tool]
)
\`\`\`

---

## Supported Document Formats

| Format | Reader |
|--------|--------|
| PDF | MinerU / PyMuPDF |
| Word (.docx) | python-docx |
| PowerPoint (.pptx) | python-pptx |
| Markdown | Native |
| HTML | BeautifulSoup |
| CSV / Excel | Pandas |
| Plain text | Native |

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
`,
  },
  zh: {
    title: '知识与 RAG',
    description: '使用 AgenticX 构建文档智能与 RAG。',
    content: `# 知识与 RAG

## 概述

AgenticX 提供完整的文档智能流水线 — 从入库、分块到混合检索与 GraphRAG。

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

\`\`\`python
from agenticx.tools import KnowledgeBaseTool

kb_tool = KnowledgeBaseTool(knowledge_base=kb)

executor = AgentExecutor(
    agent=agent,
    llm=llm,
    tools=[kb_tool]
)
\`\`\`

---

## 支持的文档格式

| 格式 | 解析器 |
|--------|--------|
| PDF | MinerU / PyMuPDF |
| Word (.docx) | python-docx |
| PowerPoint (.pptx) | python-pptx |
| Markdown | Native |
| HTML | BeautifulSoup |
| CSV / Excel | Pandas |
| Plain text | Native |

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
`,
  },
};
