# Gateway Plugin Runtime

## Architecture

```
request → auth → policy → wasm hooks → channel relay → wasm stream/response hooks → audit
```

`internal/wasmhost/` is responsible for:

- Manifest discovery and loading (`loader.go`)
- Built-in plugins (`builtin.go`, `wasm.binary: builtin:*`)
- wazero external wasm placeholder (`runtime.go` + `WazeroPlugin`)
- fsnotify hot reload (`manager.go`)

## ABI subset

| Hook | Description |
|---|---|
| `OnRequestHeaders` | Request-header stage |
| `OnRequestBody` | Request body (including WAF) |
| `OnResponseBody` | Non-streaming response rewrite |
| `OnStreamChunk` | SSE chunk rewrite |

Returns `ActionContinue` / `ActionStop`; on Stop the gateway writes back `StopBody` directly.

## Manifest

```yaml
runtime: wasm
enabled: true
priority: 100
scope:
  tenant_ids: ["*"]
  routes: ["/v1/*"]
wasm:
  binary: builtin:keyword-rewrite
  host_capabilities: [audit_log, metrics_inc]
config:
  replacements:
    secret-keyword: "[REDACTED]"
```

## Ops APIs (internal)

- `GET /internal/plugins`
- `POST /internal/plugins/reload`
- `POST /internal/plugins/upload`
- `GET /internal/errors` — 24h error fingerprint clustering
- `POST /internal/channels/{id}/probe` — Channel self-check
- `GET /internal/perf` — Pyroscope configuration

Made-with: Damon Li
