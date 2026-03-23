export const llmProvidersContent = {
  title: 'LLM Providers',
  description: 'LLM providers supported by AgenticX.',
  content: `# LLM providers

AgenticX routes chat and tools through \`BaseLLMProvider\` implementations. First-party adapters cover major Chinese cloud APIs; everything else can go through \`LiteLLMProvider\`.

---

## Supported providers

| Provider | Primary Python class | Vision | Notes |
|----------|----------------------|--------|-------|
| OpenAI | \`OpenAIProvider\` | Yes | Default stack; vision on GPT-4o-class |
| Anthropic | \`AnthropicProvider\` | Yes | Use \`anthropic/\` model prefix |
| Ollama | \`OllamaProvider\` | Model-dependent | Local; typically \`ollama/<model>\` |
| Google Gemini | \`GeminiProvider\` | Yes | LiteLLM \`gemini/\` IDs |
| Kimi / Moonshot | \`KimiProvider\` | No | Dedicated HTTP adapter; long context |
| MiniMax | \`MiniMaxProvider\` | No for M2* | M2 family has no image/audio input |
| VolcEngine Ark | \`ArkLLMProvider\` | Model-dependent | ByteDance Doubao / Ark endpoints |
| Zhipu GLM | \`ZhipuProvider\` | Yes on GLM-4V | Dedicated adapter |
| Baidu Qianfan | \`QianfanProvider\` | Model-dependent | May require \`secret_key\` |
| Alibaba Bailian | \`BailianProvider\` | Model-dependent | Qwen-VL when configured |
| SiliconFlow | \`LiteLLMProvider\` | Model-dependent | OpenAI-compatible API |
| LiteLLM (generic) | \`LiteLLMProvider\` | Model-dependent | Any LiteLLM-supported backend |
| Azure OpenAI | \`LiteLLMProvider\` | Model-dependent | \`azure/\` models |
| DeepSeek | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM routing |
| Groq | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM \`groq/\` |
| Mistral | \`LiteLLMProvider\` | Model-dependent | Via LiteLLM \`mistral/\` |

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
)
resp = llm.invoke("Reply with OK.")
\`\`\`

---

## Auth profile rotation

\`AuthProfileManager\` rotates multiple API keys for the same provider:

- **\`get_current()\`** — picks the next usable profile
- **\`mark_success(profile_name)\`** — clears error state
- **\`mark_failure(profile_name, failure_type)\`** — applies exponential backoff

---

## Failover routing

\`FailoverProvider\` wraps **two** providers: a primary and a fallback:

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

\`ResponseCache\` is an **in-memory** store keyed by SHA-256 of the prompt:

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

---

## Environment Variables

| Variable | Used for |
|----------|-----------|
| \`OPENAI_API_KEY\` | OpenAI |
| \`ANTHROPIC_API_KEY\` | Anthropic |
| \`ZHIPU_API_KEY\` | Zhipu |
| \`ARK_API_KEY\` | VolcEngine Ark |
| \`DASHSCOPE_API_KEY\` | Alibaba Bailian |
| \`QIANFAN_ACCESS_KEY\` | Baidu Qianfan |
| \`MOONSHOT_API_KEY\` | Kimi / Moonshot |
| \`MINIMAX_API_KEY\` | MiniMax |
`,
};
