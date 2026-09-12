# Vercel environment variable checklist (copy into `.local-secrets` before filling)

> **Do not** commit a copy that contains real values. Create this file locally:  
> `enterprise/.local-secrets/vercel-env-values.local.md`, copy the block below into it, then replace `<…>`.

## Vercel project settings summary

| Project | Root Directory |
| --- | --- |
| web-portal | `enterprise/apps/web-portal` |
| admin-console | `enterprise/apps/admin-console` |

| Field | Install Command |
| --- | --- |
| Same on both apps (install) | `cd ../.. && npx --yes pnpm@9.12.0 install --no-frozen-lockfile` |
| admin-console (build) | `cd ../.. && npx --yes pnpm@9.12.0 exec turbo run build --filter=@agenticx/app-admin-console` |
| web-portal (build) | `cd ../.. && npx --yes pnpm@9.12.0 exec turbo run build --filter=@agenticx/app-web-portal` |

> The `pnpm` on Vercel machines is often **6.35.1**, which triggers `ERR_PNPM_UNSUPPORTED_ENGINE`. You must use `npx pnpm@9.12.0`. `pnpm-lock.yaml` is not in git (see `enterprise/.gitignore`), so do not use `--frozen-lockfile`.

| Field | Build Command |
| --- | --- |
| web-portal | `cd ../.. && pnpm exec turbo run build --filter=@agenticx/app-web-portal` |
| admin-console | `cd ../.. && pnpm exec turbo run build --filter=@agenticx/app-admin-console` |

Framework: **Next.js** · Node: **20**.

---

## Shared by both projects (recommended for Production and Preview)

Add the same variable names in **both** the web-portal and admin-console Vercel projects:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres direct connection string, usually with `?sslmode=require` |
| `AUTH_JWT_PRIVATE_KEY` | Full PEM (including `BEGIN/END`, multiline) |
| `AUTH_JWT_PUBLIC_KEY` | Full PEM |
| `DEFAULT_TENANT_ID` | Default tenant |
| `DEFAULT_DEPT_ID` | Default department |
| `NEXT_PUBLIC_SSO_PROVIDERS` | Example: `id:Display Name`, comma-separated if multiple |
| `SSO_STATE_SIGNING_SECRET` | OIDC state signing |
| `SSO_PROVIDER_SECRET_KEY` | Secret related to SSO session/encryption (follow the repo convention) |
| `AGX_PROVIDER_SECRET_KEY` | Symmetric key (AES-GCM) used when Admin writes provider keys; must match the docs/implementation |

Also configure each IdP's `SSO_OIDC_*` as required by the console (set them on both apps if both need SSO).

---

## web-portal only

| Variable | Example |
| --- | --- |
| `GATEWAY_COMPLETIONS_URL` | `https://gateway.<your-domain>/v1/chat/completions` |

Optional (not recommended for long-term production use):

| Variable | Description |
| --- | --- |
| `AUTH_DEV_OWNER_PASSWORD` | For development / bootstrap |
| `ENABLE_DEV_BOOTSTRAP` | Recommend disabling in production |

---

## admin-console only

| Variable | Description |
| --- | --- |
| `ADMIN_CONSOLE_SESSION_SECRET` | Admin-console session; required in production |
| `ADMIN_CONSOLE_LOGIN_PASSWORD` | Admin-console password login (production should migrate toward real account RBAC) |
| `GATEWAY_INTERNAL_TOKEN` | Shared with **gateway** `GATEWAY_INTERNAL_TOKEN` to pull internal snapshots / quotas / providers |
| `GATEWAY_BASE_URL` | Example: `https://gateway.<your-domain>` (no trailing `/v1`) |

If internal routes are absolute URLs, add an admin-side base URL env as needed (follow the implementation).

---

## Gateway (Fly / Railway / VM) alignment (not Vercel)

When the gateway is deployed elsewhere, at minimum it must match what admin agreed on:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Same Supabase database (audit / usage, etc.) |
| `AUTH_JWT_PUBLIC_KEY` | Must match the access JWT issued by the portal |
| `GATEWAY_INTERNAL_TOKEN` | Must match admin `GATEWAY_INTERNAL_TOKEN` |
| `GATEWAY_REMOTE_POLICY_SNAPSHOT_URL` | GET, Bearer as above |
| `GATEWAY_REMOTE_PROVIDERS_URL` | GET, Bearer as above |
| `GATEWAY_REMOTE_QUOTA_CONFIG_URL` | GET, Bearer as above |

Exact paths follow the admin `internal/*` APIs in the implementation repo.

---

## `.local-secrets` copy-paste skeleton (local only after filling)

The skeleton below can be copied to `enterprise/.local-secrets/vercel-env-values.local.md`:

```markdown
# Vercel value draft (do not commit)

## web-portal
DATABASE_URL=<…>
AUTH_JWT_PRIVATE_KEY=
(multiline PEM)
AUTH_JWT_PUBLIC_KEY=
DEFAULT_TENANT_ID=<…>
DEFAULT_DEPT_ID=<…>
NEXT_PUBLIC_SSO_PROVIDERS=<…>
SSO_STATE_SIGNING_SECRET=<…>
SSO_PROVIDER_SECRET_KEY=<…>
AGX_PROVIDER_SECRET_KEY=<…>
GATEWAY_COMPLETIONS_URL=https://gateway.<…>/v1/chat/completions

## admin-console
(fill the shared items again)

ADMIN_CONSOLE_SESSION_SECRET=<…>
ADMIN_CONSOLE_LOGIN_PASSWORD=<…>
GATEWAY_INTERNAL_TOKEN=<…>
GATEWAY_BASE_URL=https://gateway.<…>
```

Made-with: Damon Li
