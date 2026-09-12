# Internal API (Gateway ↔ Admin)

> Admin source: `apps/admin-console/src/app/api/internal/`  
> Gateway client: `apps/gateway/internal/gatewayinternal/`

Admin Console exposes a set of internal routes **called only by Gateway**, used for split Vercel deployments or local config polling.

---

## Authentication

```
Authorization: Bearer <GATEWAY_INTERNAL_TOKEN>
```

- Admin side: `apps/admin-console/src/lib/gateway-internal-auth.ts` → `isGatewayInternalAuthorized()`
- Gateway side: `internal/gatewayinternal/` HTTP GET with the same Bearer
- Both sides' env vars **must match**, otherwise 401

---

## Route list

| Method | Path | Response | Gateway env var |
|---|---|---|---|
| GET | `/api/internal/providers` | `{ providers: [...] }` | `GATEWAY_REMOTE_PROVIDERS_URL` |
| GET | `/api/internal/quotas` | Tenant quota JSON | `GATEWAY_REMOTE_QUOTA_CONFIG_URL` |
| GET | `/api/internal/policy-snapshot` | Published policy snapshot | `GATEWAY_REMOTE_POLICY_SNAPSHOT_URL` |
| GET | `/api/internal/channels` | `{ channels: [...] }` | `GATEWAY_REMOTE_CHANNELS_URL` |

All routes use `dynamic = "force-dynamic"` and `Cache-Control: no-store`.

---

## Polling behavior

| Config | Interval | Description |
|---|---|---|
| Providers | ~5s | Includes decrypted upstream routing info |
| Quota | ~10s local cache | Tenant TPM/QPM and similar |
| Policy snapshot | Hot-reload when content hash changes | **Published** rules only |
| Channels | ~5s | Requires `GATEWAY_CHANNEL_REGISTRY=on` |

When `GATEWAY_REMOTE_*_URL` is unset, Gateway falls back to local files or direct PG reads.

---

## Providers response shape (summary)

Each provider includes:

- `provider_id`, `display_name`, `base_url`
- `enabled`, `route` (`local` / `private-cloud` / `third-party`)
- `models[]` — model id, displayName, enabled
- `api_key` — decrypted and injected at runtime (**internal response only**; do not expose to the browser)

Encrypted storage: `enterprise_runtime_model_providers.api_key_cipher`  
Encryption key: `AGX_PROVIDER_SECRET_KEY` (32-byte AES-256-GCM)

---

## Policy snapshot response

Equivalent to `.runtime/admin/policy-snapshot.json`:

- Merges plugin manifests + PG published rules
- `extends` chain is resolved in the Go loader (**`extends` is a single string**, not an array)
- Gateway Go engine recognizes `keyword` / `regex` / `pii` (not `keyword-list`)

---

## Channels response

Maps to table `gateway_channels`:

- `id`, `name`, `provider_id`, `base_url`, `weight`, `priority`
- `route`, `enabled`, `metadata`
- API Key field (cipher or env reference)

Health aggregation: admin `GET /api/admin/channels/health` calls Gateway `GATEWAY_INTERNAL_BASE_URL` (default may be `:8080`; align with `:8088` in deployments).

---

## Vercel deployment example

Admin deployed at `https://admin.example.com`:

```bash
GATEWAY_REMOTE_PROVIDERS_URL=https://admin.example.com/api/internal/providers
GATEWAY_REMOTE_QUOTA_CONFIG_URL=https://admin.example.com/api/internal/quotas
GATEWAY_REMOTE_POLICY_SNAPSHOT_URL=https://admin.example.com/api/internal/policy-snapshot
GATEWAY_REMOTE_CHANNELS_URL=https://admin.example.com/api/internal/channels
GATEWAY_INTERNAL_TOKEN=<shared-secret>
```

The Gateway process also needs: `AUTH_JWT_PUBLIC_KEY`, `DATABASE_URL` (audit / metering PG dual-write).

Full env list: [deployment/vercel-env-checklist.md](../deployment/vercel-env-checklist.md).

---

## Security notes

- Internal routes **must not** be exposed to the public internet without protection; use network ACL or mTLS
- Responses contain plaintext API keys; do not cache them on a CDN
- Rotating `GATEWAY_INTERNAL_TOKEN` requires updating admin and every gateway instance at the same time

Made-with: Damon Li
