# AI Gateway API

> Source: `apps/gateway/internal/server/server.go` (route registration: `Router()`)

Base URL: `http://localhost:8088` (`GATEWAY_HTTP_ADDR`)

OpenAI-compatible, plus enterprise control-plane extensions.

---

## Public routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/healthz` | None | Health check |
| POST | `/v1/chat/completions` | JWT Bearer | Chat (supports `stream: true` SSE) |
| POST | `/v1/embeddings` | JWT Bearer | Embeddings |

### Chat Completions

**Headers**

```
Authorization: Bearer <portal_jwt>
Content-Type: application/json
```

Optional routing headers (see `routing.Decider`):

- Explicit provider header (config key `provider_header`)
- `local_route_header` — force local / private-cloud / third-party

**Body**: standard OpenAI chat completions JSON.

**Response**

- Non-streaming: OpenAI JSON + usage
- Streaming: `text/event-stream`, SSE data lines
- Policy block: business-error JSON (not upstream model refusal text), including the matched rule

**Streaming hardening env vars**

- `GATEWAY_STREAM_IDLE_TIMEOUT`
- `GATEWAY_STREAM_SCANNER_MAX_BUFFER_MB`

---

## Internal routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/internal/channel-stats` | `GATEWAY_INTERNAL_TOKEN` | Channel runtime stats |

---

## Upstream key resolution

`OpenAICompatibleProvider` order:

1. `<PROVIDER>_API_KEY` (provider name uppercased, `-` → `_`)
2. `LLM_API_KEY` as a generic fallback
3. Unset → mock fallback (policy / audit / metering still run)

Keys configured in the Admin GUI are stored as a PG cipher. Gateway runtimeconfig polls about every ~5s; that source outranks env.

---

## Config sources

| Config | Env (remote) | Env (local) |
|---|---|---|
| Providers | `GATEWAY_REMOTE_PROVIDERS_URL` | `GATEWAY_ADMIN_PROVIDERS_FILE` |
| Quota | `GATEWAY_REMOTE_QUOTA_CONFIG_URL` | `GATEWAY_QUOTA_CONFIG_FILE` |
| Policy snapshot | `GATEWAY_REMOTE_POLICY_SNAPSHOT_URL` | `GATEWAY_POLICY_SNAPSHOT_FILE` |
| Channel | `GATEWAY_REMOTE_CHANNELS_URL` | PG `gateway_channels` |
| Policy override | — | `GATEWAY_POLICY_OVERRIDE_FILE` |

Remote fetch requires `GATEWAY_INTERNAL_TOKEN` to match admin.

---

## Audit and metering outputs

| Output | Path / table |
|---|---|
| Audit JSONL | `apps/gateway/.runtime/audit/audit-*.jsonl` |
| Audit PG | `gateway_audit_events` |
| Pending backfill | `.runtime/audit/.pg-pending` |
| Metering PG | `usage_records` |
| Metering JSONL | `GATEWAY_USAGE_LOG` (when PG is absent) |

---

## Build and run

```bash
cd enterprise/apps/gateway
go build -o bin/gateway ./cmd/gateway
go run ./cmd/gateway
```

Docker:

```bash
cd enterprise
docker build -f apps/gateway/Dockerfile -t agenticx-gateway:latest .
```

See [../gateway/overview.md](../gateway/overview.md) and [../../apps/gateway/README.md](../../apps/gateway/README.md).

---

## Difference from Machi Desktop

Enterprise Gateway is a standalone Go process. Machi Desktop uses the embedded Python `agx serve` + LiteLLM. **These are not the same implementation.**

Made-with: Damon Li
