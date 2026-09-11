export const cliContent = {
  en: {
    title: 'CLI Reference',
    description: 'AgenticX CLI commands and usage.',
    content: `# AgenticX CLI Guide

\`agx\` is the Typer CLI in \`agenticx/cli/main.py\`. Daily commands are \`serve\`, \`studio\`, \`config\`, \`skills\`, \`hooks\`, \`feishu\`. Scaffold groups (\`project\` / \`agent\` / \`workflow\`) exist — run \`agx --help\` for the live list.

![agx serve, studio, and feishu](/docs/svg/cli-commands-en.svg?v=2)

*Diagram: agx serve is HTTP; agx studio is a REPL; feishu talks to serve.*

!!! warning "serve vs studio"
    \`agx serve\` is HTTP + SSE. \`agx studio\` is an interactive REPL. Near talks to \`serve\`.

---

## 5-minute start

\`\`\`bash
pip install agenticx
agx version
agx serve --host 127.0.0.1 --port 8000
# another terminal: REPL
agx studio
\`\`\`

Optional scaffold (separate from Near):

\`\`\`bash
agx project create my-first-agent --template basic
agx agent create researcher --role "Senior Research Analyst"
\`\`\`

---

## Command groups

Daily:

| Command | What it starts |
|---------|----------------|
| \`agx serve\` | Studio FastAPI (\`create_studio_app\`) |
| \`agx studio\` | Terminal REPL |
| \`agx feishu\` | Feishu long connection |
| \`agx gateway\` | IM webhook gateway |
| \`agx config\` | \`~/.agenticx/config.yaml\` |
| \`agx skills\` / \`agx hooks\` | Skills and hooks |

Also present: \`project\`, \`agent\`, \`workflow\`, \`deploy\`, \`monitor\`, \`docs\`, \`mineru\`, \`cc-bridge\`, \`sandbox\`. Confirm with \`agx --help\`.

---

## serve - Start Server

\`\`\`bash
agx serve --port 8000 --host 0.0.0.0 --reload
\`\`\`

| Option | Default | Description |
|--------|---------|-------------|
| \`--port\` | 8000 | Listen port |
| \`--host\` | 0.0.0.0 | Listen address |
| \`--reload\` | False | Hot reload in dev mode |

---

## project - Project Management

### project create

\`\`\`bash
agx project create my-agent --template basic
\`\`\`

| Template | Description |
|----------|-------------|
| \`basic\` | Basic single-agent project |
| \`basic_stream\` | Streaming output agent project |
| \`a2a\` | Agent-to-Agent multi-agent communication |
| \`mcp\` | MCP protocol integration project |
| \`knowledge\` | Knowledge base RAG project |

---

## agent - Agent Management

\`\`\`bash
# Create agent
agx agent create researcher --role "Research Analyst"

# Interactive create
agx agent create my-agent --interactive

# List agents
agx agent list
\`\`\`

---

## workflow - Workflow Management

\`\`\`bash
# Create workflow
agx workflow create research-pipeline --template sequential

# Attach multiple agents
agx workflow create data-pipeline --template parallel --agents "agent1,agent2"

# Run workflow
agx run workflows/my_pipeline.py --verbose
\`\`\`

---

## skills - Skills Management

\`\`\`bash
# List skills
agx skills list

# Search skills
agx skills search "data analysis"

# Install skill
agx skills install web-scraper

# Publish skill
agx skills publish ./my-skill
\`\`\`

---

## hooks - Hook Management

\`\`\`bash
# List hooks
agx hooks list

# Enable/disable hooks
agx hooks enable user-prompt-submit
agx hooks disable user-prompt-submit
\`\`\`

---

## Optional Dependencies

| Extra | Install command |
|-------|-----------------|
| \`server\` | \`pip install "agenticx[server]"\` |
| \`document\` | \`pip install "agenticx[document]"\` |
| \`volcengine\` | \`pip install "agenticx[volcengine]"\` |
| \`all\` | \`pip install "agenticx[all]"\` |
`,
  },
  zh: {
    title: 'CLI 参考',
    description: 'AgenticX CLI 命令与用法。',
    content: `# AgenticX CLI 使用指南

\`agx\` 是 \`agenticx/cli/main.py\` 里的 Typer CLI。日常命令是 \`serve\`、\`studio\`、\`config\`、\`skills\`、\`hooks\`、\`feishu\`。脚手架分组（\`project\` / \`agent\` / \`workflow\`）也在——以 \`agx --help\` 为准。

![agx serve、studio 与飞书](/docs/svg/cli-commands-zh.svg?v=2)

*示意图：agx serve 是 HTTP；agx studio 是 REPL；飞书挂在 serve 上。*

!!! warning "serve 与 studio"
    \`agx serve\` 是 HTTP + SSE。\`agx studio\` 是交互式 REPL。Near 连的是 \`serve\`。

---

## 5 分钟上手

\`\`\`bash
pip install agenticx
agx version
agx serve --host 127.0.0.1 --port 8000
# 另一个终端：REPL
agx studio
\`\`\`

可选脚手架（和 Near 不是一条路）：

\`\`\`bash
agx project create my-first-agent --template basic
agx agent create researcher --role "Senior Research Analyst"
\`\`\`

---

## 命令分组

日常：

| 命令 | 启动什么 |
|------|----------|
| \`agx serve\` | Studio FastAPI（\`create_studio_app\`） |
| \`agx studio\` | 终端 REPL |
| \`agx feishu\` | 飞书长连接 |
| \`agx gateway\` | IM Webhook 网关 |
| \`agx config\` | \`~/.agenticx/config.yaml\` |
| \`agx skills\` / \`agx hooks\` | 技能与钩子 |

另外还有 \`project\`、\`agent\`、\`workflow\`、\`deploy\`、\`monitor\`、\`docs\`、\`mineru\`、\`cc-bridge\`、\`sandbox\`。以 \`agx --help\` 为准。

---

## 5分钟快速开始（脚手架）

### 1. 安装

\`\`\`bash
pip install agenticx
agx version
\`\`\`

### 2. 创建项目

\`\`\`bash
agx project create my-first-agent --template basic
cd my-first-agent
agx project info
\`\`\`

### 3. 添加智能体

\`\`\`bash
agx agent create researcher --role "Senior Research Analyst"
agx agent list
\`\`\`

### 4. 运行工作流

\`\`\`bash
agx workflow create research-pipeline --agents "researcher"
agx run workflows/research-pipeline.py --verbose
\`\`\`

---

## 命令概览

\`\`\`
agx
├── version              # 显示版本信息
├── serve                # 启动 API 服务器
├── run                  # 执行工作流文件
├── validate             # 验证配置文件
├── test                 # 运行测试套件
│
├── project              # 项目管理
│   ├── create           # 创建新项目
│   └── info             # 显示项目信息
│
├── agent                # 智能体管理
│   ├── create           # 创建智能体
│   └── list             # 列出所有智能体
│
├── workflow             # 工作流管理
│   ├── create           # 创建工作流
│   └── list             # 列出所有工作流
│
├── deploy               # 部署
├── monitor              # 监控
├── docs                 # 文档生成
├── mineru               # 文档解析
├── skills               # 技能注册中心
└── hooks                # 钩子管理
\`\`\`

---

## serve - 启动服务器

\`\`\`bash
agx serve --port 8000 --host 0.0.0.0 --reload
\`\`\`

| 选项 | 默认值 | 说明 |
|------|--------|------|
| \`--port\` | 8000 | 监听端口 |
| \`--host\` | 0.0.0.0 | 监听地址 |
| \`--reload\` | False | 开发模式热重载 |

---

## project - 项目管理

### project create

\`\`\`bash
agx project create my-agent --template basic
\`\`\`

| 模板名 | 说明 |
|--------|------|
| \`basic\` | 基础单智能体项目 |
| \`basic_stream\` | 流式输出智能体项目 |
| \`a2a\` | Agent-to-Agent 多智能体通信 |
| \`mcp\` | MCP 协议集成项目 |
| \`knowledge\` | 知识库 RAG 项目 |

---

## agent - 智能体管理

\`\`\`bash
# 创建智能体
agx agent create researcher --role "Research Analyst"

# 交互式创建
agx agent create my-agent --interactive

# 列出智能体
agx agent list
\`\`\`

---

## workflow - 工作流管理

\`\`\`bash
# 创建工作流
agx workflow create research-pipeline --template sequential

# 关联多个智能体
agx workflow create data-pipeline --template parallel --agents "agent1,agent2"

# 运行工作流
agx run workflows/my_pipeline.py --verbose
\`\`\`

---

## skills - 技能管理

\`\`\`bash
# 列出技能
agx skills list

# 搜索技能
agx skills search "data analysis"

# 安装技能
agx skills install web-scraper

# 发布技能
agx skills publish ./my-skill
\`\`\`

---

## hooks - 钩子管理

\`\`\`bash
# 列出钩子
agx hooks list

# 启用/禁用钩子
agx hooks enable user-prompt-submit
agx hooks disable user-prompt-submit
\`\`\`

---

## 可选依赖

| 依赖组 | 安装命令 |
|--------|---------|
| \`server\` | \`pip install "agenticx[server]"\` |
| \`document\` | \`pip install "agenticx[document]"\` |
| \`volcengine\` | \`pip install "agenticx[volcengine]"\` |
| \`all\` | \`pip install "agenticx[all]"\` |
`,
  },
};
