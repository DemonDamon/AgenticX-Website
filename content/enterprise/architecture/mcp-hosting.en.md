# MCP server hosting architecture

Location: `enterprise/apps/gateway/internal/mcphost/` — protocol, registry, backend, transport.

It shares the LLM process and middleware chain (auth → policy stage `mcp_tool` → quota → audit) with a separate handler branch. Off by default. See [gateway/mcp-hosting-overview.md](../gateway/mcp-hosting-overview.md).

![MCP Host components](/docs/svg/ent-mcp-en.svg?v=2)

*Diagram: `/mcp/{server}/*` enters Host, then splits into Registry, Backend, and Transport.*

## Components

| Part | Job | Code |
|------|-----|------|
| Router | Mounts `GET /mcp/registry` and three transports | `internal/server/mcp_handlers.go` |
| Host | Resolve server, EffectiveScopes, call backend | `mcphost/host.go` |
| Registry | Read `mcp_servers` + `mcp_tools`; builtin `demo` | `mcphost/registry.go` |
| Entitlement | A capability pack can revoke access | `mcphost/entitlement.go` |
| Backend | `echo` / `openapi`; `custom-go` is a stub | `mcphost` backends |
| Transport | Streamable HTTP or SSE + messages | Endpoint map from Host |

## Data model

- `mcp_servers` — metadata + `backend_config` (`openapi_json` / gzip `openapi_blob`)
- `mcp_tools` — enabled tools + JSON Schema
- `gateway_audit_events.mcp_*` — tool-call audit (nullable, Blake2b-compatible)

## OpenAPI → MCP

Each allowlisted `operationId` becomes one MCP tool. Parameters + requestBody merge into `inputSchema`. `oneOf` / `anyOf` degrade to object + description.

## Not shipped

- `custom-go` backend
- `apps/edge-agent` as an MCP host (that binary is still a skeleton)

Operations: [runbooks/mcp-hosting.md](../runbooks/mcp-hosting.md).

Made-with: Damon Li
