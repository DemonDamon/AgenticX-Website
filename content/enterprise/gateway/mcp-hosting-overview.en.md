# Enterprise Gateway MCP hosting

The gateway embeds MCP server hosting (`enterprise/apps/gateway/internal/mcphost`) and shares the chat middleware chain: **auth → policy stage `mcp_tool` → quota → audit**. It is off by default. Routes are not mounted unless `GATEWAY_MCP_HOSTING` is `on` / `1` / `true`.

![MCP hosting: Registry, Backend, Transport](/docs/svg/ent-mcp-en.svg?v=2)

*Diagram: in the same Go process, Host resolves the registry, entitlement, and backend, then serves Streamable HTTP or SSE.*

## When to use it

- A business system, IDE, or MCP client should call in-tenant tools **directly on the gateway** with a PAT or JWT
- Admins register OpenAPI (or the builtin echo) at `/admin/mcp-servers`; employees see the list after entitlement checks

Do not describe this as Desktop `mcp_connect`. Do not describe `apps/edge-agent` (still a skeleton) as an MCP host.

## Enablement

```bash
export GATEWAY_MCP_HOSTING=on
export DATABASE_URL=postgres://...
# optional; default 60
export GATEWAY_MCP_TOOL_CALLS_PER_MINUTE=60
```

`HostingEnabled()` accepts only `on` / `1` / `true` (case-insensitive). Without `DATABASE_URL`, name resolution other than builtin `demo` returns `mcp:server_not_found`.

## Request path

1. Client hits `/mcp/{server}/streamable-http` (preferred) or the legacy SSE handshake
2. `mcphost.Host.ResolveServer` accepts builtin `demo`, then PG `mcp_servers` (`tenant_id + name + status=active`)
3. `EntitlementChecker`: a governing capability pack can revoke access; ungoverned servers fall back to caller scopes
4. Backend: `echo` (demo / ping) or `openapi` (allowlisted `operationId` → MCP tool). `custom-go` is a **stub, not shipped**
5. Each `tools/call` runs policy and quota, then writes `gateway_audit_events`

OpenAPI → MCP: parameters + requestBody merge into `inputSchema`; `oneOf` / `anyOf` degrade to object + description.

## Endpoints

| Path | Purpose |
|------|---------|
| `GET /mcp/registry` | PAT/JWT; servers visible to the caller (includes endpoint hints) |
| `POST /mcp/{server}/streamable-http` | Streamable HTTP (preferred) |
| `GET /mcp/{server}/sse` | Legacy SSE handshake |
| `POST /mcp/{server}/messages?session=…` | SSE message channel |

There is also `/v1/mcp/{server_id}/*`. That proxy is unavailable when hosting is off.

Builtin smoke server: `demo` (echo / ping). No Postgres row required.

## Scopes

| Scope | Capability |
|-------|------------|
| `mcp:server:{name}:read` | `tools/list` |
| `mcp:server:{name}:invoke` | `tools/call` |
| `mcp:*` | Super scope (dev / admin PAT) |

`GET /mcp/registry` also filters with `CanListTools`: servers the caller cannot list do not appear.

## Rate limit

- Dimension: `tool_calls_per_minute` (default 60)
- Override order: per-server `rate_limit` → `GATEWAY_MCP_TOOL_CALLS_PER_MINUTE` → 60
- Exceeded: JSON-RPC error `mcp:rate_limited` (HTTP 200 + error body) via `quota.Tracker.CheckMCPToolCall`

## Audit

Each `tools/call` writes `gateway_audit_events` (`event_type=mcp_tool_call`):

`mcp_server`, `mcp_tool_name`, `mcp_input_hash`, `mcp_output_hash`, `mcp_status`, `latency_ms`

Only hashes are stored. Blake2b chain fields stay compatible with LLM audit rows (MCP columns are nullable).

## Admin console

`/admin/mcp-servers`: CRUD, OpenAPI import, ~1h health from the audit table. Tables:

- `mcp_servers` — metadata + `backend_config` (`openapi_json` / gzip `openapi_blob`)
- `mcp_tools` — enabled tools + JSON Schema

## Verify

```bash
cd enterprise/apps/gateway
GATEWAY_MCP_HOSTING=on go test ./internal/mcphost/... -count=1
bash ../../scripts/e2e-mcp-hosting.sh
```

## See also

- Architecture: [architecture/mcp-hosting.md](../architecture/mcp-hosting.md)
- Runbook: [runbooks/mcp-hosting.md](../runbooks/mcp-hosting.md)
- PAT: [api-tokens.md](./api-tokens.md) · [keypool-pat-overview.md](./keypool-pat-overview.md)

Made-with: Damon Li
