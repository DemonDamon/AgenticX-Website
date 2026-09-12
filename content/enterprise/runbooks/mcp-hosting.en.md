# MCP server hosting runbook

Product semantics (endpoints, scopes, what is not shipped): [gateway/mcp-hosting-overview.md](../gateway/mcp-hosting-overview.md). This page is enablement, verification, and the admin entry.

![MCP hosting components](/docs/svg/ent-mcp-en.svg?v=2)

*Diagram: when the flag is on, Registry / Backend / Transport share the gateway process.*

## Enable

The gateway process needs:

```bash
export GATEWAY_MCP_HOSTING=on
export DATABASE_URL=postgres://...
```

If `GATEWAY_MCP_HOSTING` is unset, behavior matches the pre-MCP gateway.

## Endpoints

| Path | Purpose |
|------|---------|
| `GET /mcp/registry` | PAT/JWT; servers visible to the caller |
| `POST /mcp/{server}/streamable-http` | Streamable HTTP (preferred) |
| `GET /mcp/{server}/sse` | Legacy SSE handshake |
| `POST /mcp/{server}/messages?session=…` | SSE message channel |

Builtin smoke server: `demo` (echo / ping). No PG row required.

## Scopes

- `mcp:server:{name}:read` — `tools/list`
- `mcp:server:{name}:invoke` — `tools/call`
- `mcp:*` — super scope (dev / admin PAT)

## Rate limit

- Dimension: `tool_calls_per_minute` (default 60; override with server `rate_limit` or `GATEWAY_MCP_TOOL_CALLS_PER_MINUTE`)
- Exceeded: JSON-RPC error `mcp:rate_limited` (HTTP 200 + error body)

## Audit

Each `tools/call` writes `gateway_audit_events` (`event_type=mcp_tool_call`):

`mcp_server`, `mcp_tool_name`, `mcp_input_hash`, `mcp_output_hash`, `mcp_status`, `latency_ms`

## Admin console

`/admin/mcp-servers`: CRUD, OpenAPI import, 1h health from the audit table.

## Verify

```bash
cd enterprise/apps/gateway
GATEWAY_MCP_HOSTING=on go test ./internal/mcphost/... -count=1
bash ../../scripts/e2e-mcp-hosting.sh
```

Made-with: Damon Li
