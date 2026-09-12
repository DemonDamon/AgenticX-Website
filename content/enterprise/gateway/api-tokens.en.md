# API tokens (PAT)

Users or admins can create a **personal access token** so a business system, IDE, or MCP client can call the Enterprise Gateway directly. Code: `enterprise/apps/gateway/internal/auth/pat.go`.

## Format and storage

- Prefix: `agx-pat-`
- Example: `agx-pat-8e79F28d9s78K908z76B89v87n89m78P`
- Table `api_tokens` stores only a SHA-256 `token_hash`. Plaintext appears once in the create response
- Row fields: `tenant_id`, `user_id`, `dept_id`, `status`, `scopes`, `expire_at`
- `last_used_at` flushes from the gateway about every 60s

The gateway treats `Authorization: Bearer` values that start with `agx-pat-` as PATs (`PATVerifier`). Portal cookies are not used.

## Call example

```bash
export PAT="agx-pat-..."
curl -s -H "Authorization: Bearer $PAT" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:8088/v1/chat/completions \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}'
```

When MCP hosting is on, the same PAT can call `GET /mcp/registry` if it has the matching `mcp:` scopes. See [mcp-hosting-overview.md](./mcp-hosting-overview.md).

## Management

| Surface | Path |
|---------|------|
| admin-console | `/admin/api-tokens` |
| web-portal | Settings → API Tokens (`/api/me/api-tokens`) |

## Revoke and cache

- Non-active `status`, expiry, or a hit in the revocation store → `auth:pat_revoked` / invalid
- Successful identities enter an in-process LRU (~60s TTL, overridable via `patCacheTTLFromEnv`)
- After a production revoke, wait for the TTL or restart gateway instances. Do not assume instant cluster-wide expiry

If `apiTokens` has a rule for that PAT, quota selection prefers it over user / dept. See [keypool-pat-overview.md](./keypool-pat-overview.md).

Made-with: Damon Li
