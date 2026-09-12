# Gateway observability

The gateway exposes Prometheus text metrics for latency, cache, and upstream errors. Off by default: `GET /metrics` returns 404 unless `GATEWAY_METRICS` is on, so counters are not left on an unauthenticated port.

## Metrics

Prometheus endpoint: `GET /metrics` (404 when `GATEWAY_METRICS=off`).

| Metric | Meaning |
|--------|---------|
| `agx_gateway_ttft_seconds` | Time to first token |
| `agx_gateway_tokens_per_second` | Generation throughput |
| `agx_gateway_cache_hits_total` | L1/L2 hits |
| `agx_gateway_cache_lookups_total` | Cache lookups |
| `agx_gateway_channel_health` | Channel health |
| `agx_gateway_active_streams` | In-flight streams |
| `agx_gateway_upstream_error_total` | Upstream errors |

Cache switches and pricing: [architecture/cache-and-pricing.md](../architecture/cache-and-pricing.md).

## Grafana

Import `enterprise/docs/observability/grafana-ai-gateway.json` from the main repo and point the datasource at Prometheus. This is a dashboard template, not a hosted Grafana.

## Audit is not metrics

Compliance records for LLM / MCP calls live in `gateway_audit_events` + JSONL, not `/metrics`. Query them from admin `/audit`. See [architecture/data-flow.md](../architecture/data-flow.md) and [runbooks/audit-pg-backfill.md](../runbooks/audit-pg-backfill.md).

Made-with: Damon Li
