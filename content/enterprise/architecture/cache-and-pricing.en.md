# Cache and pricing architecture

The gateway can run an L1 exact cache and an optional L2 semantic cache. Billing normalizes upstream cache-token fields, then prices them from `internal/metering/pricing.yaml`. Operations: [runbooks/ai-cache.md](../runbooks/ai-cache.md).

## Canonical key

`sha256(JSON({ tenant_id, user_id, model, messages, tools, temperature, ... }))`, excluding `stream` and side-effect tool calls (`tools` + `tool_choice != none`).

A hit requires the same conversation, model, and no tool side effects. Streaming still replays from the same key (`GATEWAY_CACHE_REPLAY_MODE`, default `burst`).

## Switches

| Env | Default | Meaning |
|-----|---------|---------|
| `GATEWAY_CACHE_L1` | `on` | L1 exact cache |
| `GATEWAY_CACHE_L2` | `off` | L2 semantic cache |
| `GATEWAY_CACHE_L1_TTL` | `5m` | L1 TTL |
| `GATEWAY_CACHE_SEMANTIC_THRESHOLD` | `0.92` | L2 similarity |
| `REDIS_URL` | empty | L1 uses Redis when set; otherwise in-process |

Admin `/admin/cache` writes `enterprise/.runtime/admin/cache-config.json`, then calls `/internal/cache/reload`. Evict: `POST /internal/cache/evict` (`GATEWAY_INTERNAL_TOKEN`).

Turning both layers `off` and restarting matches the pre-cache behavior.

## Usage normalization

| Upstream | Fields |
|----------|--------|
| OpenAI | `prompt_tokens_details.cached_tokens` |
| Claude | `cache_creation_input_tokens` / `cache_read_input_tokens` |
| DeepSeek | `prompt_cache_hit_tokens` |
| Gemini | `cachedContentTokenCount` |

## Pricing

`internal/metering/pricing.yaml` sets `cached_input` / `cache_creation` / `cache_read`. Gateway L1/L2 hits record `usage.source=gateway_cache` and apply the discount ratio. Prometheus counters: `agx_gateway_cache_*` in [observability/README.md](../observability/README.md).

Made-with: Damon Li
