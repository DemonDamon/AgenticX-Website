export const extensionsContent = {
  en: {
    title: 'Extensions & Skill Ecosystem',
    description:
      'Skills, AGX Bundles, and the skill marketplace — extend AgenticX with domain knowledge, MCP servers, avatar presets, and memory templates.',
    content: `# Extensions & Skill Ecosystem

AgenticX supports a three-layer extension model that lets you bring in domain knowledge, external tools, avatar presets, and memory templates—either hand-crafted or sourced from the community.

| Layer | What it is | Install path |
|-------|-----------|-------------|
| **Skill** | \`SKILL.md\` — domain knowledge instructions injected into agent context | \`.agents/skills/\`, \`~/.agents/skills/\`, or any configured directory |
| **MCP Server** | External capability via Model Context Protocol (tools, databases, web) | \`~/.agenticx/mcp.json\` |
| **AGX Bundle** | Package combining any of the above (skills + MCP + avatars + memory templates) | \`~/.agenticx/skills/bundles/<bundle-name>/\` |

---

## Skills

### What is a Skill?

A Skill is a \`SKILL.md\` file with optional YAML front matter that tells the agent *how to think* in a specific domain. Unlike MCP servers (which give the agent new tools), Skills give the agent new *knowledge and procedures*.

\`\`\`
my-skill/
└── SKILL.md
\`\`\`

\`\`\`markdown
---
name: deep-research-sop
description: SOP for conducting exhaustive deep research
---

# Deep Research SOP

When asked to research a topic:
1. First, clarify the scope...
2. Search at least 3 independent sources...
...
\`\`\`

### Where Skills are Discovered

\`SkillBundleLoader\` scans the following paths in priority order:

| Path | Scope |
|------|-------|
| \`./.agents/skills/\` | Current project |
| \`./.agent/skills/\` | Current project (alternate) |
| \`~/.agents/skills/\` | Global user |
| \`~/.agent/skills/\` | Global user (alternate) |
| \`./.claude/skills/\` | Claude Code compatible |
| \`~/.claude/skills/\` | Claude Code global |
| \`~/.agenticx/skills/bundles/\` | AGX Bundle installs |
| Built-in package skills | AgenticX defaults |

> **Tip:** Any \`SKILL.md\` you already have in \`.cursor/skills/\` or \`.agents/skills/\` is automatically picked up — no migration needed.

### Viewing Skills in Desktop

Open **Settings → 技能** tab to see all discovered skills, search by name or description, click any skill to view the full \`SKILL.md\` content, and refresh after adding new skills.

### Using Skills in Chat

Skills are automatically injected into the agent's context. You can also explicitly activate one:

\`\`\`
skill_use("deep-research-sop")
\`\`\`

Or list available skills:

\`\`\`
skill_list()
\`\`\`

---

## AGX Bundle

### What is an AGX Bundle?

An AGX Bundle is a distributable directory package identified by an \`agx-bundle.yaml\` manifest. It can contain any combination of:

- **Skills** — SKILL.md files
- **MCP Servers** — JSON configuration files
- **Avatar Presets** — YAML files for agent persona presets
- **Memory Templates** — Markdown templates for the memory pipeline

### Bundle Directory Layout

\`\`\`
my-bundle/
├── agx-bundle.yaml            ← required manifest
├── skills/
│   └── deep-research/
│       └── SKILL.md
├── mcp/
│   └── web-crawler.json
├── avatars/
│   └── researcher.yaml
└── memory/
    └── research-workflow.md
\`\`\`

### \`agx-bundle.yaml\` Format

\`\`\`yaml
agx_bundle: "1.0"           # format version (required)
name: "deep-research-kit"   # bundle identifier (required)
version: "1.0.0"
description: "Complete deep research toolkit"
author: "Damon Li"
license: "MIT"

components:
  skills:
    - path: skills/deep-research/SKILL.md
      description: "Deep research SOP"

  mcp_servers:
    - name: web-crawler
      config_path: mcp/web-crawler.json
      description: "Web crawling MCP server"

  avatars:
    - name: researcher
      config_path: avatars/researcher.yaml
      description: "Research specialist avatar preset"

  memory_templates:
    - name: research-workflow
      path: memory/research-workflow.md
      description: "Memory template for research sessions"
\`\`\`

All four \`components\` sections are optional — a bundle with only \`skills\` is perfectly valid.

### Security

The parser enforces:

- All paths must be **relative** (no absolute paths)
- Paths cannot **escape the bundle directory** (no \`../\` traversal)
- Invalid entries are skipped with a warning; the install does not abort

### Installing a Bundle

**Desktop GUI**

1. Open **Settings → 技能** tab
2. Scroll to **已安装扩展包**
3. Paste the absolute path to your bundle directory in the input field
4. Click **安装**

The skills will appear in the skill list above, and any MCP servers will be merged into \`~/.agenticx/mcp.json\`.

**Python API**

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle, list_installed_bundles

result = install_bundle(Path("/path/to/my-bundle"))
if result.success:
    print(f"Installed {result.name} v{result.version}")
    print(f"Skills: {result.skills_installed}")
    print(f"MCP servers: {result.mcp_servers_installed}")

for bundle in list_installed_bundles():
    print(bundle.name, bundle.version)
\`\`\`

### What Happens on Install

| Component | Destination |
|-----------|------------|
| Skills | \`~/.agenticx/skills/bundles/<name>/<skill-dir>/\` |
| MCP servers | Merged into \`~/.agenticx/mcp.json\` under \`mcpServers\` |
| Avatar presets | \`~/.agenticx/avatars/presets/<name>/<avatar>.yaml\` |
| Memory templates | \`~/.agenticx/workspace/memory_templates/<name>/\` |
| Install record | \`~/.agenticx/bundles.json\` |

### Uninstalling a Bundle

**Desktop GUI**

In **Settings → 技能 → 已安装扩展包**, click **卸载** next to the bundle name.

**Python API**

\`\`\`python
from agenticx.extensions.installer import uninstall_bundle

uninstall_bundle("deep-research-kit")
\`\`\`

---

## Skill Marketplace

### Configuring Registry Sources

Edit \`~/.agenticx/config.yaml\` to add registry sources:

\`\`\`yaml
extensions:
  registries:
    - name: official
      url: https://registry.agxbuilder.com
      type: agx                          # AgenticX native registry
    - name: community
      url: https://example.com/agx-registry.json
      type: agx
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub                      # ClawHub skills market
  scan_dirs:
    - ~/.agenticx/bundles
    - ~/.agenticx/skills/registry
\`\`\`

Two registry types are supported:

| Type | Description |
|------|-------------|
| \`agx\` | AgenticX native registry — REST API compatible with \`agenticx.skills.registry\` |
| \`clawhub\` | ClawHub skills market — search and install \`SKILL.md\` files from clawhub.ai |

### Searching the Marketplace

**Desktop GUI**

1. Open **Settings → 技能** tab
2. Scroll to **浏览市场**
3. Type a keyword in the search box and press Enter or click **搜索**
4. Results show name, description, author, version, and source badge
5. Click **安装** on any result

**Python API**

\`\`\`python
from agenticx.extensions.registry_hub import RegistryHub

hub = RegistryHub.from_config()          # reads ~/.agenticx/config.yaml
results = hub.search("deep research")

for r in results:
    print(r.name, r.source_type, r.source)
    print(r.description)
    print(r.install_hint)
\`\`\`

### Installing from a Registry

\`\`\`python
result = hub.install("clawhub", "web-crawler-skill")
if result.success:
    print(f"Installed to {result.installed_path}")
\`\`\`

Skills installed from a registry are placed in \`~/.agenticx/skills/registry/<skill-name>/SKILL.md\` and are immediately available to \`SkillBundleLoader\`.

---

## Quick Reference

### Minimal Skill (no bundle needed)

Create \`~/.agents/skills/my-skill/SKILL.md\`:

\`\`\`markdown
---
name: my-skill
description: What this skill does
---

Instructions for the agent...
\`\`\`

Done. The skill is discovered automatically on next scan.

### Minimal Bundle (skills only)

\`\`\`
my-bundle/
├── agx-bundle.yaml
└── skills/
    └── my-skill/
        └── SKILL.md
\`\`\`

\`\`\`yaml
# agx-bundle.yaml
agx_bundle: "1.0"
name: "my-bundle"
version: "1.0.0"
description: "My first AGX Bundle"
author: "me"

components:
  skills:
    - path: skills/my-skill/SKILL.md
      description: "My custom skill"
\`\`\`

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle
install_bundle(Path("./my-bundle"))
\`\`\`

### Connect ClawHub Marketplace

Add to \`~/.agenticx/config.yaml\`:

\`\`\`yaml
extensions:
  registries:
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub
\`\`\`

Then search in **Settings → 技能 → 浏览市场**.
`,
  },
  zh: {
    title: '扩展与技能生态',
    description:
      '技能、AGX Bundle 与技能市场 — 用领域知识、MCP 服务器、分身预设与记忆模板扩展 AgenticX。',
    content: `# 扩展与技能生态

AgenticX 支持三层扩展模型，可引入领域知识、外部工具、分身预设与记忆模板——既可手工编写，也可从社区获取。

| 层级 | 含义 | 安装路径 |
|------|------|----------|
| **Skill** | \`SKILL.md\` — 注入智能体上下文的领域知识说明 | \`.agents/skills/\`、\`~/.agents/skills/\` 或任意配置目录 |
| **MCP Server** | 通过 Model Context Protocol 提供的外部能力（工具、数据库、Web） | \`~/.agenticx/mcp.json\` |
| **AGX Bundle** | 组合上述任意内容的包（skills + MCP + avatars + memory templates） | \`~/.agenticx/skills/bundles/<bundle-name>/\` |

---

## 技能（Skills）

### 什么是 Skill？

Skill 是带可选 YAML front matter 的 \`SKILL.md\` 文件，告诉智能体在特定领域*如何思考*。与 MCP 服务器（提供新工具）不同，Skill 提供新的*知识与流程*。

\`\`\`
my-skill/
└── SKILL.md
\`\`\`

\`\`\`markdown
---
name: deep-research-sop
description: SOP for conducting exhaustive deep research
---

# Deep Research SOP

When asked to research a topic:
1. First, clarify the scope...
2. Search at least 3 independent sources...
...
\`\`\`

### 技能发现路径

\`SkillBundleLoader\` 按优先级扫描以下路径：

| 路径 | 范围 |
|------|------|
| \`./.agents/skills/\` | 当前项目 |
| \`./.agent/skills/\` | 当前项目（备用） |
| \`~/.agents/skills/\` | 用户全局 |
| \`~/.agent/skills/\` | 用户全局（备用） |
| \`./.claude/skills/\` | 兼容 Claude Code |
| \`~/.claude/skills/\` | Claude Code 全局 |
| \`~/.agenticx/skills/bundles/\` | AGX Bundle 安装 |
| 包内置技能 | AgenticX 默认 |

> **提示：** \`.cursor/skills/\` 或 \`.agents/skills/\` 中已有的 \`SKILL.md\` 会自动被发现，无需迁移。

### 在 Desktop 中查看技能

打开 **设置 → 技能** 标签页，可查看所有已发现技能、按名称或描述搜索、点击任意技能查看完整 \`SKILL.md\` 内容，添加新技能后刷新列表即可。

### 在对话中使用技能

技能会自动注入智能体上下文。也可显式激活：

\`\`\`
skill_use("deep-research-sop")
\`\`\`

或列出可用技能：

\`\`\`
skill_list()
\`\`\`

---

## AGX Bundle

### 什么是 AGX Bundle？

AGX Bundle 是以 \`agx-bundle.yaml\` 清单标识的可分发目录包，可包含以下任意组合：

- **Skills** — SKILL.md 文件
- **MCP Servers** — JSON 配置文件
- **Avatar Presets** — 智能体人设预设 YAML
- **Memory Templates** — 记忆流水线 Markdown 模板

### Bundle 目录结构

\`\`\`
my-bundle/
├── agx-bundle.yaml            ← required manifest
├── skills/
│   └── deep-research/
│       └── SKILL.md
├── mcp/
│   └── web-crawler.json
├── avatars/
│   └── researcher.yaml
└── memory/
    └── research-workflow.md
\`\`\`

### \`agx-bundle.yaml\` 格式

\`\`\`yaml
agx_bundle: "1.0"           # format version (required)
name: "deep-research-kit"   # bundle identifier (required)
version: "1.0.0"
description: "Complete deep research toolkit"
author: "Damon Li"
license: "MIT"

components:
  skills:
    - path: skills/deep-research/SKILL.md
      description: "Deep research SOP"

  mcp_servers:
    - name: web-crawler
      config_path: mcp/web-crawler.json
      description: "Web crawling MCP server"

  avatars:
    - name: researcher
      config_path: avatars/researcher.yaml
      description: "Research specialist avatar preset"

  memory_templates:
    - name: research-workflow
      path: memory/research-workflow.md
      description: "Memory template for research sessions"
\`\`\`

四个 \`components\` 区块均为可选 — 仅含 \`skills\` 的 bundle 完全有效。

### 安全约束

解析器强制：

- 所有路径必须为**相对路径**（禁止绝对路径）
- 路径不得**逃出 bundle 目录**（禁止 \`../\` 穿越）
- 无效条目会跳过并警告；安装不会因此中止

### 安装 Bundle

**Desktop 图形界面**

1. 打开 **设置 → 技能** 标签页
2. 滚动到 **已安装扩展包**
3. 在输入框粘贴 bundle 目录的绝对路径
4. 点击 **安装**

技能会出现在上方技能列表中，MCP 服务器会合并进 \`~/.agenticx/mcp.json\`。

**Python API**

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle, list_installed_bundles

result = install_bundle(Path("/path/to/my-bundle"))
if result.success:
    print(f"Installed {result.name} v{result.version}")
    print(f"Skills: {result.skills_installed}")
    print(f"MCP servers: {result.mcp_servers_installed}")

for bundle in list_installed_bundles():
    print(bundle.name, bundle.version)
\`\`\`

### 安装后的落盘位置

| 组件 | 目标路径 |
|------|----------|
| Skills | \`~/.agenticx/skills/bundles/<name>/<skill-dir>/\` |
| MCP servers | 合并到 \`~/.agenticx/mcp.json\` 的 \`mcpServers\` |
| Avatar presets | \`~/.agenticx/avatars/presets/<name>/<avatar>.yaml\` |
| Memory templates | \`~/.agenticx/workspace/memory_templates/<name>/\` |
| 安装记录 | \`~/.agenticx/bundles.json\` |

### 卸载 Bundle

**Desktop 图形界面**

在 **设置 → 技能 → 已安装扩展包** 中，点击 bundle 名称旁的 **卸载**。

**Python API**

\`\`\`python
from agenticx.extensions.installer import uninstall_bundle

uninstall_bundle("deep-research-kit")
\`\`\`

---

## 技能市场

### 配置注册表源

编辑 \`~/.agenticx/config.yaml\` 添加注册表源：

\`\`\`yaml
extensions:
  registries:
    - name: official
      url: https://registry.agxbuilder.com
      type: agx                          # AgenticX native registry
    - name: community
      url: https://example.com/agx-registry.json
      type: agx
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub                      # ClawHub skills market
  scan_dirs:
    - ~/.agenticx/bundles
    - ~/.agenticx/skills/registry
\`\`\`

支持两种注册表类型：

| 类型 | 说明 |
|------|------|
| \`agx\` | AgenticX 原生注册表 — 与 \`agenticx.skills.registry\` 兼容的 REST API |
| \`clawhub\` | ClawHub 技能市场 — 从 clawhub.ai 搜索并安装 \`SKILL.md\` |

### 搜索市场

**Desktop 图形界面**

1. 打开 **设置 → 技能** 标签页
2. 滚动到 **浏览市场**
3. 在搜索框输入关键词，按 Enter 或点击 **搜索**
4. 结果展示名称、描述、作者、版本与来源 badge
5. 点击任意结果的 **安装**

**Python API**

\`\`\`python
from agenticx.extensions.registry_hub import RegistryHub

hub = RegistryHub.from_config()          # reads ~/.agenticx/config.yaml
results = hub.search("deep research")

for r in results:
    print(r.name, r.source_type, r.source)
    print(r.description)
    print(r.install_hint)
\`\`\`

### 从注册表安装

\`\`\`python
result = hub.install("clawhub", "web-crawler-skill")
if result.success:
    print(f"Installed to {result.installed_path}")
\`\`\`

从注册表安装的技能位于 \`~/.agenticx/skills/registry/<skill-name>/SKILL.md\`，\`SkillBundleLoader\` 可立即发现。

---

## 快速参考

### 最小 Skill（无需 bundle）

创建 \`~/.agents/skills/my-skill/SKILL.md\`：

\`\`\`markdown
---
name: my-skill
description: What this skill does
---

Instructions for the agent...
\`\`\`

完成。下次扫描时会自动发现该技能。

### 最小 Bundle（仅 skills）

\`\`\`
my-bundle/
├── agx-bundle.yaml
└── skills/
    └── my-skill/
        └── SKILL.md
\`\`\`

\`\`\`yaml
# agx-bundle.yaml
agx_bundle: "1.0"
name: "my-bundle"
version: "1.0.0"
description: "My first AGX Bundle"
author: "me"

components:
  skills:
    - path: skills/my-skill/SKILL.md
      description: "My custom skill"
\`\`\`

\`\`\`python
from pathlib import Path
from agenticx.extensions.installer import install_bundle
install_bundle(Path("./my-bundle"))
\`\`\`

### 接入 ClawHub 市场

在 \`~/.agenticx/config.yaml\` 中添加：

\`\`\`yaml
extensions:
  registries:
    - name: clawhub
      url: https://clawhub.ai/api
      type: clawhub
\`\`\`

然后在 **设置 → 技能 → 浏览市场** 中搜索。
`,
  },
};
