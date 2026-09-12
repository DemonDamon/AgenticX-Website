# AI Gateway Cache Ops

## Feature flags

| Env var | Default | Description |
|---|---|---|
| `GATEWAY_CACHE_L1` | `on` | L1 exact cache |
| `GATEWAY_CACHE_L2` | `off` | L2 semantic cache |
| `GATEWAY_CACHE_L1_TTL` | `5m` | L1 TTL |
| `GATEWAY_CACHE_SEMANTIC_THRESHOLD` | `0.92` | L2 similarity threshold |
| `GATEWAY_CACHE_REPLAY_MODE` | `burst` | Streaming replay mode |
| `REDIS_URL` | empty | When set, L1 uses Redis |

Admin Console `/admin/cache` writes `enterprise/.runtime/admin/cache-config.json`, then calls the gateway `/internal/cache/reload` after save.

## Eviction

```bash
curl -X POST "$GATEWAY/internal/cache/evict" \
  -H "Authorization: Bearer $GATEWAY_INTERNAL_TOKEN" \
  -H 'content-type: application/json' \
  -d '{"prefix":"<key-hash-prefix>"}'
```

## Fallback

Set `GATEWAY_CACHE_L1=off` and `GATEWAY_CACHE_L2=off`, then restart the gateway. Behavior matches cache disabled.

Made-with: Damon Li
