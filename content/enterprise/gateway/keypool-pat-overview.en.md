# Enterprise Gateway: key pool, quotas, and API tokens (PAT)

Upstream key rotation, quota checks, and PAT access are three complementary paths. Upstream keys are not stored as plaintext. PATs store only a SHA-256 hash. Quotas are enforced by `quota.Tracker`.

![Key pool rotation and cooldown](/docs/svg/ent-keypool-en.svg?v=2)

*Diagram: a Channel lists env var names; Resolve skips empty or cooling refs; three retryable failures start a 60s cooldown.*

## What the code actually does

| Capability | Code | Shipped | Do not promise |
|------------|------|---------|----------------|
| Key failover | `internal/keypool/pool.go` + `relay.Executor` | Multiple `metadata.keyRefs` on one Channel; rotate on 401/403/429/5xx/network errors | “Every 4xx rotates” — 403 does; cancel / deadline / `idle_timeout` does not |
| Multi-scope quota | `internal/quota/check_request.go` `selectRuleExtended` | PAT → user → dept → model → role; monthly / daily / weekly / TPM / RPM / `MaxConcurrency` | A finished dept/user quota **console** — `/metering` is still mostly query/export |
| PAT | `internal/auth/pat.go` | `Bearer agx-pat-…` against `api_tokens` | Showing the plaintext twice; instant cluster-wide revoke (in-process LRU ~60s) |

## Key pool

In **Channel** edit, set `metadata.keyRefs` (environment variable **names**, not the secrets):

```json
{
  "keyRefs": ["DEEPSEEK_API_KEY_1", "DEEPSEEK_API_KEY_2"]
}
```

`ResolveWithRef` order:

1. If the Channel already has a **direct API key**, use it and skip rotation
2. Otherwise walk `keyRefs`: skip cooldown, skip empty `os.Getenv(ref)`
3. The gateway process must be able to read those env vars

Failure handling (`IsKeyRetryable` + `MarkFailure`):

- Retryable: upstream **401 / 403 / 429 / ≥500**, or connection-refused / timeout network errors
- Not retryable: `context.Canceled`, `DeadlineExceeded`, `stream:idle_timeout`, `stream:buffer_exceeded`
- **3** consecutive failures on the same ref start a **60s** cooldown; success clears the counter
- Internal admin: `GET /internal/keypool-stats`, `POST /internal/keypool/reset`

A single-key Channel still uses the API key field (`api_key_cipher`, AES-256-GCM).

## PAT

Business systems / IDEs / MCP clients call `:8088` directly — no portal cookie.

1. Create from web-portal “API Tokens” or admin-console `/admin/api-tokens`
2. Plaintext is shown once: `agx-pat-<base62>`
3. `api_tokens` stores `token_hash` (SHA-256), tenant / user / dept / scopes / `expire_at` / `status`
4. `last_used_at` flushes about every 60s

```bash
curl -s -H "Authorization: Bearer agx-pat-..." \
  -H "Content-Type: application/json" \
  http://127.0.0.1:8088/v1/chat/completions \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}'
```

After revoke, the in-process cache may accept the old token for up to ~60s. See [api-tokens.md](./api-tokens.md).

## Quotas

`CheckRequest` on the chat path checks RPM / TPM / monthly tokens / concurrency. Rule selection:

1. `apiTokens[apiTokenID]` (PAT calls)
2. `users[userID]`
3. `departments[deptID]`
4. `defaults.model[model]`
5. `defaults.role[role]`, then `staff`

Block returns `policy:quota:monthly_exceeded` / `tpm` / `rpm`. Warn may set `X-AgenticX-Quota-Warn`. Without Redis, rate limits are **single-instance memory**.

Config table: `enterprise_runtime_token_quotas.config` (jsonb). Admin **Metering → Quotas** edits that JSON. Demos should lead with **tenant-level** limits.

## Self-host notes

- Do not commit upstream keys or PAT plaintext
- Multi-replica TPM/RPM needs shared Redis
- This is not the Python / LiteLLM router — keep the two lines separate in customer write-ups

## See also

- [api-tokens.md](./api-tokens.md)
- [overview.md](./overview.md)
- [runtime-config.md](./runtime-config.md)
- [mcp-hosting-overview.md](./mcp-hosting-overview.md)

Made-with: Damon Li
