# Gateway Runtime Configuration

Enterprise stores model services, user-visible models, token quotas, and policy snapshots **in Postgres**. The Gateway loads configuration by polling the admin internal API or reading local files.

---

## Tables

| Table | Contents |
|---|---|
| `enterprise_runtime_model_providers` | Provider, base_url, encrypted Key, models[] |
| `enterprise_runtime_user_visible_models` | User → model id visibility |
| `enterprise_runtime_token_quotas` | Tenant quota JSON |
| `enterprise_runtime_policy_snapshots` | Published policies |
| `gateway_channels` | Channel relay upstreams |

Schema details: [database/schema.md](../database/schema.md)

---

## Legacy JSON migration

Historical path: `enterprise/.runtime/admin/`

| File | Target table |
|---|---|
| `providers.json` | `enterprise_runtime_model_providers` |
| `user-models.json` | `enterprise_runtime_user_visible_models` |
| `quotas.json` | `enterprise_runtime_token_quotas` |

```bash
pnpm -C enterprise migrate:legacy-runtime
```

`bootstrap.sh` and local `start-dev.sh` (when `DATABASE_URL` points at localhost) run this automatically.

**After import**: admin / portal / gateway **read PG only**; JSON is a one-time import source.

---

## Admin GUI workflow

### Model services (/admin/models)

1. Add a Provider (template or manual)
2. Enter the API Key → Probe for liveness
3. Check enabled on the model list
4. IAM user detail → Assign visible models

Gateway hot-reloads within ~5s; **no restart required**.

### Quotas (/metering/quota)

Writes `enterprise_runtime_token_quotas.config` JSON.

Read by Gateway `quota.Tracker`; ~10s cache when using the remote URL.

**Current state**: tenant-level quotas only; department/user-level TPM needs a separate plan.

### Policies (/policy)

Publish → `enterprise_runtime_policy_snapshots`

---

## Gateway environment variables

### Remote (Vercel admin + self-hosted gateway)

| Variable | Matching internal route |
|---|---|
| `GATEWAY_REMOTE_PROVIDERS_URL` | `/api/internal/providers` |
| `GATEWAY_REMOTE_QUOTA_CONFIG_URL` | `/api/internal/quotas` |
| `GATEWAY_REMOTE_POLICY_SNAPSHOT_URL` | `/api/internal/policy-snapshot` |
| `GATEWAY_REMOTE_CHANNELS_URL` | `/api/internal/channels` |
| `GATEWAY_INTERNAL_TOKEN` | Bearer auth |

### Local file fallback

| Variable | Typical default path |
|---|---|
| `GATEWAY_ADMIN_PROVIDERS_FILE` | `.runtime/admin/providers.json` |
| `GATEWAY_QUOTA_CONFIG_FILE` | `.runtime/admin/quotas.json` |
| `GATEWAY_POLICY_SNAPSHOT_FILE` | `.runtime/admin/policy-snapshot.json` |
| `GATEWAY_POLICY_OVERRIDE_FILE` | `.runtime/admin/policy-overrides.json` |

**Deployment pitfall**: the `policy-snapshot.json` path must match the path admin actually publishes to; pointing at the repo-root `.runtime` causes “rule published but not blocking”.

---

## API Key encryption

- Algorithm: AES-256-GCM
- Key env: `AGX_PROVIDER_SECRET_KEY` (admin encrypts; gateway decrypts and needs the same or a paired key distribution)
- Stored field: `api_key_cipher` (no plaintext)

Rotating the key requires re-encrypting all providers or a bulk update.

---

## Environment-variable Key fallback

For providers with no Key in PG:

```
<PROVIDER>_API_KEY  →  LLM_API_KEY  →  mock
```

Naming: uppercase the provider id, `-` → `_`.

---

## User-visible models vs Gateway

| Layer | Controls |
|---|---|
| Portal | Which model ids the user can see (dropdown) |
| Gateway | Which upstreams can be called, and whether the Key is valid |

Visible to the user but no upstream configured → the call fails; configured but not assigned → Portal does not show it.

---

## Related docs

- [internal-api.md](../api/internal-api.md)
- [deployment/vercel-env-checklist.md](../deployment/vercel-env-checklist.md)
- [../../scripts/README.md](../../scripts/README.md) — migrate-runtime-legacy

Made-with: Damon Li
