# Gateway Channel + Relay Runbook

## Enablement

1. In admin-console **Channel management**, create at least one `active` Channel.
2. Gateway process settings:
   - `GATEWAY_CHANNEL_REGISTRY=on`
   - `GATEWAY_REMOTE_CHANNELS_URL=https://<admin>/api/internal/channels` (or local `GATEWAY_ADMIN_CHANNELS_FILE`)
   - `GATEWAY_INTERNAL_TOKEN` must match admin-console

## Fallback

Turn off `GATEWAY_CHANNEL_REGISTRY` (or set it to off). The Gateway returns to the original `Decider` + single-provider path, matching pre-upgrade behavior.

## Streaming hardening

| Variable | Default | Description |
|------|------|------|
| `GATEWAY_STREAM_IDLE_TIMEOUT` | 60 | Upstream SSE idle seconds; timeout returns `stream:idle_timeout` |
| `GATEWAY_STREAM_SCANNER_MAX_BUFFER_MB` | 16 | Per-stream cumulative buffer cap; overflow returns `stream:buffer_exceeded` |

## Audit fields

In Channel mode, audit JSONL / PG events append (nullable):

- `channel_id`
- `attempt_index`
- `retry_reason`
- `estimated_tokens` / `actual_tokens` / `settle_delta`
- `attempts[]` (channel and reason for each retry)

## Health panel

The admin-console **Channel management** page aggregates Gateway `GET /internal/channel-stats` via `GET /api/admin/channels/health` (requires `GATEWAY_INTERNAL_BASE_URL`).

Made-with: Damon Li
