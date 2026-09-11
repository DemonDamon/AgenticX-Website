export const installationContent = {
  en: {
    title: 'Installation',
    description: 'Install the Python package, verify the CLI, and prepare Near or SDK use.',
    content: `# Installation

Install the **Python package** first. Near Desktop embeds the same backend; the public package is still what you use for SDK work and \`agx\` on a machine with Python.

## What you are installing

\`\`\`mermaid
flowchart TB
  pip["pip install agenticx"] --> cli["agx CLI"]
  pip --> sdk["Python SDK"]
  cli --> serve["agx serve"]
  serve --> near["Near Desktop"]
  sdk --> app["Your Python app"]
\`\`\`

## Requirements

- Python **3.10+**
- \`pip\` or \`uv\`
- At least one model provider key **or** a reachable local OpenAI-compatible endpoint (for example Ollama)

## Install from PyPI

\`\`\`bash
pip install agenticx
\`\`\`

Optional extras exist in \`pyproject.toml\` (desktop runtime, extra LLM adapters, data sources). Only install extras you need. \`pip install "agenticx[all]"\` pulls a large optional set and is not required for \`agx serve\` plus a single provider.

## Install from source

\`\`\`bash
git clone https://github.com/DemonDamon/AgenticX.git
cd AgenticX
pip install -e .
\`\`\`

## Verify

\`\`\`bash
agx --version
agx --help
\`\`\`

You should see the \`agx\` command group (\`serve\`, \`studio\`, \`loop\`, \`run\`, and others). If the command is missing, the console script is not on \`PATH\` — reinstall into the same environment you are using.

## Provider keys

Put keys in the environment or in \`~/.agenticx/config.yaml\`. One working provider is enough to start.

\`\`\`bash
export OPENAI_API_KEY="your-key"
# or ANTHROPIC_API_KEY, MINIMAX_API_KEY, and so on
\`\`\`

See [Configuration](/docs/getting-started/configuration) for the YAML shape.

## Document parsing (optional)

Studio / Near knowledge ingest uses **LiteParse** for PDF, Office text, and images. It is not the same as the model calling \`pdftotext\` in a shell.

\`\`\`bash
npm i -g @llamaindex/liteparse
\`\`\`

\`.xlsx\` / \`.xls\` need a local LibreOffice. On macOS: \`brew install --cask libreoffice\`. If it is missing, the UI should say so and drop those types from the supported list.

!!! warning "Do not treat shell PDF tools as the built-in parser"
    \`mdfind\` / \`pdftotext\` on the machine are CLI utilities. The built-in \`liteparse\` tool must go through \`LiteParseAdapter\`. Reading a PDF as raw bytes will blow the context window.

## Next

- [Quick Start →](/docs/getting-started/quickstart)
- [Configuration →](/docs/getting-started/configuration)
`,
  },
  zh: {
    title: '安装',
    description: '安装 Python 包、验证 CLI，并准备 Near 或 SDK 用法。',
    content: `# 安装

先装 **Python 包**。Near 桌面内嵌同一套后端；SDK 开发和本机 \`agx\` 仍然用这个包。

## 你在装什么

\`\`\`mermaid
flowchart TB
  pip["pip install agenticx"] --> cli["agx CLI"]
  pip --> sdk["Python SDK"]
  cli --> serve["agx serve"]
  serve --> near["Near 桌面"]
  sdk --> app["你的 Python 应用"]
\`\`\`

## 环境要求

- Python **3.10+**
- \`pip\` 或 \`uv\`
- 至少一个模型供应商密钥，**或**可访问的本机 OpenAI 兼容端点（例如 Ollama）

## 从 PyPI 安装

\`\`\`bash
pip install agenticx
\`\`\`

\`pyproject.toml\` 里还有可选 extras（桌面运行时、额外 LLM 适配、数据源）。按需安装即可。\`pip install "agenticx[all]"\` 会拉进很大一组可选依赖，只跑 \`agx serve\` + 单一供应商时不必装。

## 从源码安装

\`\`\`bash
git clone https://github.com/DemonDamon/AgenticX.git
cd AgenticX
pip install -e .
\`\`\`

## 验证

\`\`\`bash
agx --version
agx --help
\`\`\`

应能看到 \`agx\` 命令组（\`serve\`、\`studio\`、\`loop\`、\`run\` 等）。若找不到命令，说明 console script 不在当前 \`PATH\` —— 装进你正在用的那个环境。

## 供应商密钥

写到环境变量或 \`~/.agenticx/config.yaml\`。能跑通一家即可开工。

\`\`\`bash
export OPENAI_API_KEY="your-key"
# 或 ANTHROPIC_API_KEY、MINIMAX_API_KEY 等
\`\`\`

YAML 结构见 [配置](/docs/getting-started/configuration)。

## 文档解析（可选）

Studio / Near 知识入库用 **LiteParse** 处理 PDF、Office 文本和图片。这和模型在 shell 里自己调 \`pdftotext\` 不是一回事。

\`\`\`bash
npm i -g @llamaindex/liteparse
\`\`\`

\`.xlsx\` / \`.xls\` 需要本机 LibreOffice。macOS：\`brew install --cask libreoffice\`。没装时 UI 应提示，并从支持列表里去掉这些类型。

!!! warning "不要把本机 PDF CLI 当成内置解析器"
    机器上的 \`mdfind\` / \`pdftotext\` 只是系统命令。内置 \`liteparse\` 必须走 \`LiteParseAdapter\`。把 PDF 当原始字节塞进模型会撑爆上下文。

## 下一步

- [快速上手 →](/docs/getting-started/quickstart)
- [配置 →](/docs/getting-started/configuration)
`,
  },
};
