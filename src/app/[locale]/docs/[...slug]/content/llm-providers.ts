export const llmProvidersContent = {
  en: {
    title: 'LLM Providers',
    description: 'LLM providers supported by AgenticX.',
    content: `# LLM providers

AgenticX routes chat and tools through \`BaseLLMProvider\` implementations. First-party adapters cover major Chinese cloud APIs; everything else can go through \`LiteLLMProvider\` (OpenAI-compatible or LiteLLM model IDs).

---

## Supported providers

| Provider | Primary Python class | Vision | Notes |
|----------|----------------------|--------|-------|
| OpenAI | \`OpenAIProvider\` (\`LiteLLMProvider\`) | Yes (model-dependent) | Default stack; vision on GPT-4o-class and similar |
| Anthropic | \`AnthropicProvider\` (\`LiteLLMProvider\`) | Yes (model-dependent) | Use \`anthropic/\` model prefix when required |
| Ollama | \`OllamaProvider\` (\`LiteLLMProvider\`) | Model-dependent | Local; typically \`ollama/<model>\` |
| Google Gemini | \`GeminiProvider\` (\`LiteLLMProvider\`) | Yes (model-dependent) | LiteLLM \`gemini/\` IDs |
| Kimi / Moonshot | \`KimiProvider\`, \`MoonshotProvider\` | No (typical chat SKUs) | Dedicated HTTP adapter; long context |
| MiniMax | \`MiniMaxProvider\`, \`MinimaxProvider\` | No for \`M2*\` chat line | \`openai/\` prefix applied internally; M2 family has no image/audio input |
| VolcEngine Ark | \`ArkLLMProvider\`, \`ArkProvider\`, \`VolcEngineProvider\` | Model-dependent | ByteDance Doubao / Ark endpoints |
| Zhipu GLM | \`ZhipuProvider\`, \`ZhiPuProvider\` | Yes on GLM-4V-class | Dedicated adapter |
| Baidu Qianfan | \`QianfanProvider\`, \`QianFanProvider\` | Model-dependent | May require \`secret_key\` in config |
| Alibaba Bailian / Dashscope | \`BailianProvider\`, \`DashscopeProvider\` | Model-dependent | Qwen-VL and cousins when configured |
| SiliconFlow | \`LiteLLMProvider\` | Model-dependent | Point \`base_url\` at SiliconFlow OpenAI-compatible API |
| LiteLLM (generic) | \`LiteLLMProvider\` | Model-dependent | Any LiteLLM-supported backend |
| Azure OpenAI | \`LiteLLMProvider\` | Model-dependent | \`azure/\` models; \`api_version\` + Azure key |
| DeepSeek | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM routing |
| Groq | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM \`groq/\` models |
| Mistral | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM \`mistral/\` models |
| Together AI | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM |
| xAI | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM |

\`ProviderResolver.PROVIDER_MAP\` wires config keys \`openai\`, \`anthropic\`, \`ollama\`, \`zhipu\`, \`volcengine\` / \`ark\`, \`bailian\`, \`qianfan\`, \`kimi\`, \`minimax\` to the classes above.

---

## Usage

### OpenAI

\`\`\`python
from agenticx.llms import OpenAIProvider

llm = OpenAIProvider(
    model="gpt-4o",
    api_key="sk-...",  # or rely on env / config
)
resp = llm.invoke("Summarize this in one line.")
\`\`\`

### Anthropic

\`\`\`python
from agenticx.llms import AnthropicProvider

llm = AnthropicProvider(
    model="anthropic/claude-sonnet-4-20250514",
    api_key="sk-ant-...",
)
resp = llm.invoke([{"role": "user", "content": "Hello"}])
\`\`\`

### Ollama (local)

\`\`\`python
from agenticx.llms import OllamaProvider

llm = OllamaProvider(
    model="ollama/qwen2.5:7b",
    base_url="http://127.0.0.1:11434",
)
resp = llm.invoke("Ping")
\`\`\`

### MiniMax

\`\`\`python
from agenticx.llms import MinimaxProvider

llm = MinimaxProvider(
    model="MiniMax-M2.5",
    api_key="...",
    # base_url defaults to https://api.minimax.chat/v1
)
resp = llm.invoke("Reply with OK.")
\`\`\`

### LiteLLM

\`\`\`python
from agenticx.llms import LiteLLMProvider

# Example: third-party OpenAI-compatible endpoint (e.g. SiliconFlow)
llm = LiteLLMProvider(
    model="openai/Qwen/Qwen2.5-7B-Instruct",
    api_key="...",
    base_url="https://api.siliconflow.cn/v1",
)
resp = llm.invoke("Hello")
\`\`\`

---

## Auth profile rotation

\`AuthProfileManager\` (\`agenticx.llms.auth_profile\`) rotates multiple API keys (or logical profiles) for the same provider. It persists cooldown metadata to a JSON file (atomic write via \`.tmp\` then replace).

- **\`get_current()\`** — picks the next usable profile (available first, ordered by \`last_used\`; cooling profiles queued by \`cooldown_until\`).
- **\`mark_success(profile_name)\`** — clears error state and cooldown timestamps for that profile.
- **\`mark_failure(profile_name, failure_type)\`** — increments \`error_count\`, sets \`failure_type\`, and applies exponential backoff to \`cooldown_until\`.
- **\`classify_failure(exc)\`** — maps exceptions to \`billing\`, \`auth\`, \`rate_limit\`, or \`other\` using message heuristics.

Backoff (implemented in \`_compute_cooldown_ms\`):

| Failure bucket | Base | Cap | Multiplier per step |
|----------------|------|-----|---------------------|
| \`billing\` | 5 hours | 24 hours | \`2 ** min(error_count - 1, 10)\` |
| \`rate_limit\`, \`auth\`, \`other\`, … | 60 seconds | 1 hour | \`5 ** min(error_count - 1, 3)\` |

\`BaseLLMProvider.invoke_with_profile(messages, api_key=...)\` forwards to \`invoke(..., api_key=api_key)\` so callers can inject the rotated secret without replacing the provider instance.

!!! tip
    Pass \`persistence_path=Path("~/.agenticx/auth_profiles.json").expanduser()\` if cooldowns must survive process restarts.

---

## Failover routing

\`FailoverProvider\` wraps **two** providers: a primary and a fallback. For each of \`invoke\`, \`ainvoke\`, \`stream\`, \`astream\`, and \`stream_with_tools\`, it tries the primary unless the primary is in cooldown.

- **\`failure_threshold\`** (default \`3\`) — consecutive primary failures before entering cooldown.
- **\`cooldown_duration\`** (default \`60\` seconds) — primary bypass window after the threshold is hit.
- A successful primary call resets the failure counter and clears cooldown.

\`\`\`python
from agenticx.llms import FailoverProvider, OpenAIProvider, AnthropicProvider

llm = FailoverProvider(
    primary=OpenAIProvider(model="gpt-4o", api_key="..."),
    fallback=AnthropicProvider(model="anthropic/claude-sonnet-4-20250514", api_key="..."),
    failure_threshold=3,
    cooldown_duration=120.0,
)
\`\`\`

---

## Response cache

\`ResponseCache\` is an **in-memory** store keyed by SHA-256 (truncated) of the **string** prompt. Entries carry a TTL (\`ttl_seconds\`, default \`300\`) and LRU eviction (\`max_entries\`, default \`100\`). It is **not** wired automatically into \`LiteLLMProvider\`; wrap calls when you want cheaper dev loops.

\`\`\`python
from agenticx.llms import OpenAIProvider, ResponseCache

llm = OpenAIProvider(model="gpt-4o-mini", api_key="...")
cache = ResponseCache(ttl_seconds=300, max_entries=100)

def cached_invoke(text: str):
    hit = cache.get(text)
    if hit is not None:
        return hit
    out = llm.invoke(text)
    cache.put(text, out)
    return out
\`\`\`

\`stats()\` exposes hits, misses, size, and hit rate.

---

## Transcript sanitizer

Before model calls, \`agent_runtime\` runs \`_sanitize_context_messages\` on chat history. The pipeline is provider-aware in the broader sense that it enforces **valid assistant / tool message chains** so upstream APIs do not see orphaned \`tool\` rows or dangling \`tool_calls\`.

Behavior (simplified):

- **\`tool\` messages** are kept only when their \`tool_call_id\` appears on a preceding assistant \`tool_calls\` list that is fully satisfied by contiguous tool responses.
- **Assistant messages with \`tool_calls\`** are kept only when every call id has a matching tool response in history; otherwise \`tool_calls\` are stripped and text content is preserved.

This reduces provider \`400\` errors from broken tool loops after edits, retries, or partial persistence.

---

## Vision and image input

Multimodal content is honored when the backend and model support it. MiniMax's **M2 chat family** (including M2, M2.1, M2.5, M2.7 and \`*-highspeed\` SKUs; excluding ids containing \`vl\` / \`vision\`) **does not** accept image or audio input per vendor constraints.

Studio strips \`image_inputs\` for those models before the completion request. Prefer a vision-capable model if attachments must reach the LLM.

!!! warning "MiniMax M2 and attachments"
    Do not assume the model sees images when using \`minimax-m2*\` IDs. The framework removes image payloads for that family and you should treat the turn as text-only unless you switch model.

---

## Provider configuration (environment variables)

Values below are the ones AgenticX's config loader commonly pairs with \`providers.<name>\` in \`~/.agenticx/config.yaml\`. LiteLLM may read additional variables depending on the model id.

| Variable | Used for |
|----------|-----------|
| \`OPENAI_API_KEY\` | OpenAI |
| \`OPENAI_API_BASE\` | OpenAI-compatible override (optional) |
| \`ANTHROPIC_API_KEY\` | Anthropic |
| \`ANTHROPIC_API_BASE\` | Anthropic base URL override (optional) |
| \`ZHIPU_API_KEY\` | Zhipu |
| \`ARK_API_KEY\` | VolcEngine Ark (\`volcengine\` / \`ark\` provider) |
| \`VOLCENGINE_ACCESS_KEY\`, \`VOLCENGINE_SECRET_KEY\` | Alternate Ark / Volcengine auth paths |
| \`DASHSCOPE_API_KEY\` | Alibaba Bailian / Dashscope |
| \`QIANFAN_ACCESS_KEY\` | Baidu Qianfan (\`secret_key\` often set in YAML) |
| \`MOONSHOT_API_KEY\` | Kimi / Moonshot |
| \`MINIMAX_API_KEY\` | MiniMax |
| \`AGX_MAX_TOOL_ROUNDS\` | Runtime cap on tool rounds (global) |
| \`AGX_CHROMIUM_QUIET\` | Desktop Chromium log noise (optional) |

Ollama is usually configured with \`base_url\` in YAML (for example \`http://localhost:11434\`); keys are not required for local inference.

!!! tip
    Resolve providers in one line with \`ProviderResolver.resolve()\` when you want the merged file config instead of manual constructors.
`,
  },
  zh: {
    title: 'LLM 供应商',
    description: 'AgenticX 支持的 LLM 供应商与配置方式。',
    content: `# LLM 供应商

AgenticX 通过 \`BaseLLMProvider\` 实现路由对话与工具调用。国内主流云 API 有一方适配器；其余后端可经 \`LiteLLMProvider\` 接入（OpenAI 兼容端点或 LiteLLM 模型 ID）。

---

## 支持的供应商

| 供应商 | 主要 Python 类 | 视觉 | 说明 |
|--------|----------------|------|------|
| OpenAI | \`OpenAIProvider\` (\`LiteLLMProvider\`) | 是（视模型而定） | 默认栈；GPT-4o 等支持视觉 |
| Anthropic | \`AnthropicProvider\` (\`LiteLLMProvider\`) | 是（视模型而定） | 需要时使用 \`anthropic/\` 模型前缀 |
| Ollama | \`OllamaProvider\` (\`LiteLLMProvider\`) | 视模型而定 | 本地部署；通常为 \`ollama/<model>\` |
| Google Gemini | \`GeminiProvider\` (\`LiteLLMProvider\`) | 是（视模型而定） | LiteLLM \`gemini/\` ID |
| Kimi / Moonshot | \`KimiProvider\`, \`MoonshotProvider\` | 否（常见对话 SKU） | 专用 HTTP 适配器；长上下文 |
| MiniMax | \`MiniMaxProvider\`, \`MinimaxProvider\` | \`M2*\` 对话系列不支持 | 内部自动补 \`openai/\` 前缀；M2 系列不接受图片/音频输入 |
| VolcEngine Ark | \`ArkLLMProvider\`, \`ArkProvider\`, \`VolcEngineProvider\` | 视模型而定 | 字节豆包 / Ark 端点 |
| 智谱 GLM | \`ZhipuProvider\`, \`ZhiPuProvider\` | GLM-4V 等支持 | 专用适配器 |
| 百度千帆 | \`QianfanProvider\`, \`QianFanProvider\` | 视模型而定 | 配置中可能需要 \`secret_key\` |
| 阿里百炼 / Dashscope | \`BailianProvider\`, \`DashscopeProvider\` | 视模型而定 | 配置 Qwen-VL 等视觉模型时可用 |
| SiliconFlow | \`LiteLLMProvider\` | 视模型而定 | 将 \`base_url\` 指向 SiliconFlow OpenAI 兼容 API |
| LiteLLM（通用） | \`LiteLLMProvider\` | 视模型而定 | 任意 LiteLLM 支持的后端 |
| Azure OpenAI | \`LiteLLMProvider\` | 视模型而定 | \`azure/\` 模型；需 \`api_version\` 与 Azure 密钥 |
| DeepSeek | \`LiteLLMProvider\` | 视模型而定 | 经 LiteLLM 路由 |
| Groq | \`LiteLLMProvider\` | 视模型而定 | 经 LiteLLM \`groq/\` 模型 |
| Mistral | \`LiteLLMProvider\` | 视模型而定 | 经 LiteLLM \`mistral/\` 模型 |
| Together AI | \`LiteLLMProvider\` | 视模型而定 | 经 LiteLLM |
| xAI | \`LiteLLMProvider\` | 视模型而定 | 经 LiteLLM |

\`ProviderResolver.PROVIDER_MAP\` 将配置键 \`openai\`、\`anthropic\`、\`ollama\`、\`zhipu\`、\`volcengine\` / \`ark\`、\`bailian\`、\`qianfan\`、\`kimi\`、\`minimax\` 映射到上表中的类。

---

## 用法示例

### OpenAI

\`\`\`python
from agenticx.llms import OpenAIProvider

llm = OpenAIProvider(
    model="gpt-4o",
    api_key="sk-...",  # or rely on env / config
)
resp = llm.invoke("Summarize this in one line.")
\`\`\`

### Anthropic

\`\`\`python
from agenticx.llms import AnthropicProvider

llm = AnthropicProvider(
    model="anthropic/claude-sonnet-4-20250514",
    api_key="sk-ant-...",
)
resp = llm.invoke([{"role": "user", "content": "Hello"}])
\`\`\`

### Ollama（本地）

\`\`\`python
from agenticx.llms import OllamaProvider

llm = OllamaProvider(
    model="ollama/qwen2.5:7b",
    base_url="http://127.0.0.1:11434",
)
resp = llm.invoke("Ping")
\`\`\`

### MiniMax

\`\`\`python
from agenticx.llms import MinimaxProvider

llm = MinimaxProvider(
    model="MiniMax-M2.5",
    api_key="...",
    # base_url defaults to https://api.minimax.chat/v1
)
resp = llm.invoke("Reply with OK.")
\`\`\`

### LiteLLM

\`\`\`python
from agenticx.llms import LiteLLMProvider

# Example: third-party OpenAI-compatible endpoint (e.g. SiliconFlow)
llm = LiteLLMProvider(
    model="openai/Qwen/Qwen2.5-7B-Instruct",
    api_key="...",
    base_url="https://api.siliconflow.cn/v1",
)
resp = llm.invoke("Hello")
\`\`\`

---

## 鉴权配置轮换

\`AuthProfileManager\`（\`agenticx.llms.auth_profile\`）为同一供应商轮换多个 API 密钥（或逻辑 profile），并将冷却元数据持久化到 JSON 文件（先写 \`.tmp\` 再原子替换）。

- **\`get_current()\`** — 选取下一个可用 profile（优先可用项，按 \`last_used\` 排序；冷却中的 profile 按 \`cooldown_until\` 排队）。
- **\`mark_success(profile_name)\`** — 清除该 profile 的错误状态与冷却时间戳。
- **\`mark_failure(profile_name, failure_type)\`** — 递增 \`error_count\`、设置 \`failure_type\`，并对 \`cooldown_until\` 应用指数退避。
- **\`classify_failure(exc)\`** — 根据异常消息启发式映射为 \`billing\`、\`auth\`、\`rate_limit\` 或 \`other\`。

退避策略（在 \`_compute_cooldown_ms\` 中实现）：

| 失败类型 | 基准 | 上限 | 每步倍率 |
|----------|------|------|----------|
| \`billing\` | 5 小时 | 24 小时 | \`2 ** min(error_count - 1, 10)\` |
| \`rate_limit\`、\`auth\`、\`other\` 等 | 60 秒 | 1 小时 | \`5 ** min(error_count - 1, 3)\` |

\`BaseLLMProvider.invoke_with_profile(messages, api_key=...)\` 会转发到 \`invoke(..., api_key=api_key)\`，调用方可在不替换 provider 实例的情况下注入轮换后的密钥。

!!! tip
    若需进程重启后仍保留冷却状态，请传入 \`persistence_path=Path("~/.agenticx/auth_profiles.json").expanduser()\`。

---

## 故障转移路由

\`FailoverProvider\` 包装**两个** provider：主路与备路。对 \`invoke\`、\`ainvoke\`、\`stream\`、\`astream\` 和 \`stream_with_tools\`，除非主路处于冷却期，否则优先尝试主路。

- **\`failure_threshold\`**（默认 \`3\`）— 主路连续失败多少次后进入冷却。
- **\`cooldown_duration\`**（默认 \`60\` 秒）— 达到阈值后主路被旁路的时间窗口。
- 主路调用成功会重置失败计数并清除冷却。

\`\`\`python
from agenticx.llms import FailoverProvider, OpenAIProvider, AnthropicProvider

llm = FailoverProvider(
    primary=OpenAIProvider(model="gpt-4o", api_key="..."),
    fallback=AnthropicProvider(model="anthropic/claude-sonnet-4-20250514", api_key="..."),
    failure_threshold=3,
    cooldown_duration=120.0,
)
\`\`\`

---

## 响应缓存

\`ResponseCache\` 是**内存**存储，以 prompt **字符串**的 SHA-256（截断）为键。条目带 TTL（\`ttl_seconds\`，默认 \`300\`）并采用 LRU 淘汰（\`max_entries\`，默认 \`100\`）。它**不会**自动接入 \`LiteLLMProvider\`；开发循环中需要降本时可自行包装调用。

\`\`\`python
from agenticx.llms import OpenAIProvider, ResponseCache

llm = OpenAIProvider(model="gpt-4o-mini", api_key="...")
cache = ResponseCache(ttl_seconds=300, max_entries=100)

def cached_invoke(text: str):
    hit = cache.get(text)
    if hit is not None:
        return hit
    out = llm.invoke(text)
    cache.put(text, out)
    return out
\`\`\`

\`stats()\` 返回命中、未命中、条目数与命中率。

---

## 对话清洗器

模型调用前，\`agent_runtime\` 会对聊天历史执行 \`_sanitize_context_messages\`。该流水线在更广意义上是 provider 感知的：它强制**合法的 assistant / tool 消息链**，避免上游 API 看到孤立的 \`tool\` 行或未闭合的 \`tool_calls\`。

行为（简化）：

- **\`tool\` 消息** 仅在前序 assistant \`tool_calls\` 列表中存在对应 \`tool_call_id\`，且连续 tool 响应已全部满足时保留。
- **带 \`tool_calls\` 的 assistant 消息** 仅当历史中每个 call id 都有匹配的 tool 响应时保留；否则剥离 \`tool_calls\` 并保留文本内容。

这可减少编辑、重试或部分持久化后工具环断裂导致的 provider \`400\` 错误。

---

## 视觉与图片输入

当后端与模型支持多模态时，框架会传递相应内容。按厂商约束，MiniMax **M2 对话系列**（含 M2、M2.1、M2.5、M2.7 及 \`*-highspeed\` SKU；不含 id 中带 \`vl\` / \`vision\` 的型号）**不接受**图片或音频输入。

Studio 会在 completion 请求前为这些模型剥离 \`image_inputs\`。若附件必须送达 LLM，请选用支持视觉的模型。

!!! warning "MiniMax M2 与附件"
    使用 \`minimax-m2*\` ID 时不要假设模型能看到图片。框架会为该系列移除图片载荷，除非切换模型，否则应将该轮视为纯文本。

---

## 供应商配置（环境变量）

下表为 AgenticX 配置加载器通常与 \`~/.agenticx/config.yaml\` 中 \`providers.<name>\` 配对使用的变量。LiteLLM 还可能根据模型 id 读取额外变量。

| 变量 | 用途 |
|------|------|
| \`OPENAI_API_KEY\` | OpenAI |
| \`OPENAI_API_BASE\` | OpenAI 兼容端点覆盖（可选） |
| \`ANTHROPIC_API_KEY\` | Anthropic |
| \`ANTHROPIC_API_BASE\` | Anthropic Base URL 覆盖（可选） |
| \`ZHIPU_API_KEY\` | 智谱 |
| \`ARK_API_KEY\` | 火山引擎 Ark（\`volcengine\` / \`ark\` provider） |
| \`VOLCENGINE_ACCESS_KEY\`, \`VOLCENGINE_SECRET_KEY\` | Ark / Volcengine 备用鉴权路径 |
| \`DASHSCOPE_API_KEY\` | 阿里百炼 / Dashscope |
| \`QIANFAN_ACCESS_KEY\` | 百度千帆（\`secret_key\` 常在 YAML 中配置） |
| \`MOONSHOT_API_KEY\` | Kimi / Moonshot |
| \`MINIMAX_API_KEY\` | MiniMax |
| \`AGX_MAX_TOOL_ROUNDS\` | 工具轮次上限（全局运行时） |
| \`AGX_CHROMIUM_QUIET\` | Desktop Chromium 日志降噪（可选） |

Ollama 通常在 YAML 中配置 \`base_url\`（例如 \`http://localhost:11434\`）；本地推理无需密钥。

!!! tip
    若希望使用合并后的文件配置而非手动构造，可一行调用 \`ProviderResolver.resolve()\` 解析 provider。
`,
  },
};
