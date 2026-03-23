export const cliContent = {
  title: 'CLI Reference',
  description: 'AgenticX CLI commands and usage.',
  content: `# AgenticX CLI 使用指南

AgenticX 提供了功能完整的命令行工具 \`agx\`，涵盖项目创建、智能体管理、工作流编排、部署、监控等全流程操作。

---

## 5分钟快速开始

### 1. 安装

\`\`\`bash
pip install agenticx
agx --version
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
};
