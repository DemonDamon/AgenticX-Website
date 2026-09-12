# Environment Variable Reference

> Last updated: 2026-05-21  
> Template: `enterprise/.env.local.example`

Grouped by consuming component. ✅ = required, 🟡 = strongly recommended for production/deployment, ⚪ = optional.

---

## 1. Shared

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string; shared by portal / admin / gateway |
| `REDIS_URL` | ⚪ | portal/admin currently persist mainly to PG; Redis is started only by local compose |
| `AUTH_JWT_PRIVATE_KEY` | ✅ | RS256 private-key PEM (signed by portal/admin) |
| `AUTH_JWT_PUBLIC_KEY` | ✅ | RS256 public key (verified by gateway) |
| `AUTH_JWT_PRIVATE_KEY_FILE` | ⚪ | `.env.local` typically uses `*_FILE`; `start-dev.sh` expands it to the file contents |
| `AUTH_JWT_PUBLIC_KEY_FILE` | ⚪ | Same as above |
| `DEFAULT_TENANT_ID` | 🟡 | Default tenant ULID (after seed) |
| `DEFAULT_DEPT_ID` | ⚪ | Default department ULID |
| `AGX_AUTO_DB_MIGRATE` | ⚪ | `start-dev.sh` auto-migrates only against a localhost DB; `=0` disables |

---

## 2. web-portal (`:3000`)

| Variable | Required | Description |
|---|---|---|
| `AUTH_DEV_OWNER_PASSWORD` | 🟡 dev | Dev-mode password for owner@agenticx.local |
| `ENABLE_DEV_BOOTSTRAP` | ⚪ | Auto-bootstrap seed outside production |
| `GATEWAY_COMPLETIONS_URL` | 🟡 | Default `http://127.0.0.1:8088/v1/chat/completions` |
| `NEXT_PUBLIC_SSO_PROVIDERS` | ⚪ | `id:displayName` comma-separated; controls SSO buttons |
| `SSO_<id>_ISSUER` | OIDC | IdP issuer URL |
| `SSO_<id>_CLIENT_ID` | OIDC | OIDC client_id |
| `SSO_<id>_CLIENT_SECRET` | OIDC | OIDC client_secret |
| `SSO_<id>_REDIRECT_URI` | OIDC | Callback URI |
| `SSO_<id>_SCOPES` | ⚪ | Default `openid profile email` |
| `SSO_<id>_SAML_ENTRY_POINT` | SAML | SAML IdP SSO URL |
| `SSO_<id>_SAML_ISSUER` | SAML | SP entityID |
| `SSO_<id>_SAML_CERT` | SAML | IdP public certificate |

Full SSO variables: [runbooks/sso-oidc-setup.md](../runbooks/sso-oidc-setup.md) and [runbooks/sso-saml-setup.md](../runbooks/sso-saml-setup.md).

---

## 3. admin-console (`:3001`)

| Variable | Required | Description |
|---|---|---|
| `ADMIN_CONSOLE_LOGIN_EMAIL` | 🟡 | Admin-console account; default `admin@agenticx.local` |
| `ADMIN_CONSOLE_LOGIN_PASSWORD` | ✅ | Admin-console password login |
| `ADMIN_CONSOLE_SESSION_SECRET` | ✅ | Admin-console session signing |
| `GATEWAY_BASE_URL` | 🟡 | Admin-console health-check target (default `http://127.0.0.1:8088`) |
| `GATEWAY_INTERNAL_TOKEN` | ✅ Vercel split | Bearer token Gateway uses to pull the internal API |
| `GATEWAY_INTERNAL_BASE_URL` | ⚪ | Channel health aggregation; distinguish gateway 8088 vs the internal mgmt port |
| `AGX_PROVIDER_SECRET_KEY` | ✅ | AES-256-GCM key for Provider API Keys (32-byte base64) |
| `SSO_PROVIDER_SECRET_KEY` | ✅ | AES-256-GCM key for SSO client_secret |
| `NEXT_PUBLIC_SSO_PROVIDERS` | ⚪ | Same as portal; controls the admin SSO entry |

---

## 4. apps/gateway (`:8088`)

### 4.1 Basics

| Variable | Default | Description |
|---|---|---|
| `GATEWAY_HTTP_ADDR` | `:8088` | Listen address |
| `GATEWAY_CONFIG_PATH` | — | YAML config path (model routing) |
| `AUTH_JWT_PUBLIC_KEY` | — | JWT verification (required) |
| `DATABASE_URL` | — | Audit / metering PG dual-write |

### 4.2 Upstream key resolution (in order)

| Variable | Description |
|---|---|
| `<PROVIDER>_API_KEY` | Provider name uppercased, `-` → `_`, e.g. `DEEPSEEK_API_KEY` |
| `LLM_API_KEY` | Generic fallback |
| Unconfigured | mock fallback (policy / audit / metering still run) |

> Priority: **PG `api_key_cipher`** > `<PROVIDER>_API_KEY` > `LLM_API_KEY` > mock

### 4.3 Remote config (recommended for Vercel split)

| Variable | Matching admin internal route |
|---|---|
| `GATEWAY_INTERNAL_TOKEN` | Bearer (must match admin) |
| `GATEWAY_REMOTE_PROVIDERS_URL` | `/api/internal/providers` |
| `GATEWAY_REMOTE_QUOTA_CONFIG_URL` | `/api/internal/quotas` |
| `GATEWAY_REMOTE_POLICY_SNAPSHOT_URL` | `/api/internal/policy-snapshot` |
| `GATEWAY_REMOTE_CHANNELS_URL` | `/api/internal/channels` |

### 4.4 Local file fallback

| Variable | Purpose |
|---|---|
| `GATEWAY_ADMIN_PROVIDERS_FILE` | providers.json |
| `GATEWAY_QUOTA_CONFIG_FILE` | quotas.json |
| `GATEWAY_QUOTA_USAGE_FILE` | Local quota-usage persistence |
| `GATEWAY_POLICY_SNAPSHOT_FILE` | Published policy snapshot |
| `GATEWAY_POLICY_OVERRIDE_FILE` | Local policy override (debugging) |
| `GATEWAY_USAGE_LOG` | Metering jsonl path when PG is unavailable |

### 4.5 Audit

| Variable | Default | Description |
|---|---|---|
| `GATEWAY_AUDIT_BACKFILL_DAYS` | `7` | Startup backfill window for `.pg-pending` |

### 4.6 Stream hardening

| Variable | Description |
|---|---|
| `GATEWAY_STREAM_IDLE_TIMEOUT` | SSE idle cutoff |
| `GATEWAY_STREAM_SCANNER_MAX_BUFFER_MB` | Max buffer per chunk |

### 4.7 Channel relay

| Variable | Description |
|---|---|
| `GATEWAY_CHANNEL_REGISTRY` | `on` to enable |

---

## 5. Key generation and rotation

```bash
# RSA-2048（JWT）
openssl genrsa -out auth_private.pem 2048
openssl rsa -in auth_private.pem -pubout -out auth_public.pem

# AES-256-GCM 密钥（32 字节 base64）
openssl rand -base64 32
```

Rotating `AGX_PROVIDER_SECRET_KEY` / `SSO_PROVIDER_SECRET_KEY` requires re-encrypting all existing cipher rows; use an ops batch script.

---

## 6. Deployment checklist cross-references

- [deployment/vercel-env-checklist.md](../deployment/vercel-env-checklist.md) — Required Vercel Project items
- [deployment/README.md](../deployment/README.md) — `.local-secrets/` convention
- [../../scripts/README.md](../../scripts/README.md) — bootstrap / start-dev env handling

---

## 7. Common pitfalls

| Symptom | Cause |
|---|---|
| Changing SSO env has no effect | Next.js does not hot-reload SSO env; a **full restart** of portal / admin is required |
| Gateway cannot see admin Providers | `GATEWAY_INTERNAL_TOKEN` mismatch between the two sides |
| Token chip always shows 0 | gateway and portal `DATABASE_URL` point at different databases |
| Policy published but not blocking | Wrong `GATEWAY_POLICY_SNAPSHOT_FILE` path (pointing at the wrong `.runtime` root) |
| `chat history operation failed` | Postgres not running, or `DATABASE_URL` is wrong |

See [development/troubleshooting.md](../development/troubleshooting.md).

Made-with: Damon Li
