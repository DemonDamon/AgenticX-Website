# Wasm Plugin Ops Runbook

## Feature flags

- `GATEWAY_WASM_PLUGINS=off`: disables the entire Wasm runtime (declarative rule-packs are unaffected)
- `GATEWAY_PLUGINS_DIR`: plugin root directory, default `enterprise/plugins`

## Hot reload

1. Edit `plugins/<name>/manifest.yaml` or upload a new wasm
2. The filesystem watcher reloads automatically; you can also call:
   - Gateway: `POST /internal/plugins/reload` (requires `GATEWAY_INTERNAL_TOKEN`)
   - Admin: `PUT /api/admin/plugins`

## Sample plugins

| Plugin | Role | Default |
|---|---|---|
| wasm-keyword-rewrite | Response keyword replacement | Enabled |
| wasm-waf-basic | Prompt injection / basic WAF | Disabled |
| wasm-audit-tagger | Audit tag injection | Disabled |
| wasm-bearer-extractor | Custom header → property | Disabled |

## Fault isolation

- Plugin panics are caught at the hook layer; the main gateway keeps serving
- Plugins that fail to start are skipped (manifest validation / Start failure)
- Prometheus: `agx_plugin_invocations_total` / `agx_plugin_errors_total` / `agx_plugin_latency_seconds`

## Pyroscope (optional)

```bash
export PYROSCOPE_URL=https://pyroscope.example.com
export GATEWAY_PYROSCOPE=on
```

Admin `/admin/perf` shows a jump link.

Made-with: Damon Li
