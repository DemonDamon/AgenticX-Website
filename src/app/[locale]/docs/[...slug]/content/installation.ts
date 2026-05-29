export const installationContent = {
  en: {
    title: 'Installation',
    description: 'How to install AgenticX and set up your environment.',
    content: `# Installation

## Requirements

- Python 3.10+
- pip or uv

## Install from PyPI (Recommended)

\`\`\`bash
pip install agenticx
\`\`\`

For all optional features (document parsing, vector stores, etc.):

\`\`\`bash
pip install "agenticx[all]"
\`\`\`

## Install from Source

\`\`\`bash
git clone https://github.com/DemonDamon/AgenticX.git
cd AgenticX

# Basic install
pip install -e .

# With all extras
pip install -e ".[all]"
\`\`\`

## Environment Setup

\`\`\`bash
# Required: at least one LLM provider key
export OPENAI_API_KEY="your-api-key"

# Optional providers
export ANTHROPIC_API_KEY="your-api-key"
export MOONSHOT_API_KEY="your-api-key"
\`\`\`

Or use a \`.env\` file in your project root:

\`\`\`bash
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
\`\`\`

## System Dependencies (Optional)

For advanced document processing features (PDF / Word / PPT parsing):

\`\`\`bash
# macOS
brew install antiword tesseract

# Ubuntu/Debian
sudo apt-get install antiword tesseract-ocr
\`\`\`

## Verify Installation

\`\`\`bash
agx --version
\`\`\`

You should see output like:

\`\`\`
agx version 0.x.x
\`\`\`

## Next Steps

- [Quick Start →](/docs/getting-started/quickstart)
- [Configuration →](/docs/getting-started/configuration)
`,
  },
  zh: {
    title: '安装',
    description: '如何安装 AgenticX 并配置运行环境。',
    content: `# 安装

## 环境要求

- Python 3.10+
- pip 或 uv

## 从 PyPI 安装（推荐）

\`\`\`bash
pip install agenticx
\`\`\`

如需全部可选能力（文档解析、向量库等）：

\`\`\`bash
pip install "agenticx[all]"
\`\`\`

## 从源码安装

\`\`\`bash
git clone https://github.com/DemonDamon/AgenticX.git
cd AgenticX

# 基础安装
pip install -e .

# 含全部 extras
pip install -e ".[all]"
\`\`\`

## 环境变量

\`\`\`bash
# 必需：至少配置一个 LLM 供应商密钥
export OPENAI_API_KEY="your-api-key"

# 可选供应商
export ANTHROPIC_API_KEY="your-api-key"
export MOONSHOT_API_KEY="your-api-key"
\`\`\`

或在项目根目录使用 \`.env\` 文件：

\`\`\`bash
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
\`\`\`

## 系统依赖（可选）

高级文档处理能力（PDF / Word / PPT 解析）可能需要：

\`\`\`bash
# macOS
brew install antiword tesseract

# Ubuntu/Debian
sudo apt-get install antiword tesseract-ocr
\`\`\`

## 验证安装

\`\`\`bash
agx --version
\`\`\`

应看到类似输出：

\`\`\`
agx version 0.x.x
\`\`\`

## 下一步

- [快速上手 →](/docs/getting-started/quickstart)
- [配置 →](/docs/getting-started/configuration)
`,
  },
};
