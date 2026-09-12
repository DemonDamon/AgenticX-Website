# Admin Console API

> Source root: `apps/admin-console/src/app/api/`  
> Page root: `apps/admin-console/src/app/`

Base URL: `http://localhost:3001`

All `/api/admin/*`, `/api/policy/*`, `/api/audit/*`, and `/api/metering/*` routes require an admin session and RBAC scope checks.

---

## Page routes

| Path | Module |
|---|---|
| `/login` | Login |
| `/dashboard` | Overview |
| `/iam`, `/iam/users`, `/iam/departments`, `/iam/roles`, `/iam/bulk-import` | Identity and access |
| `/audit` | Gateway audit |
| `/metering`, `/metering/quota` | Token usage / quota |
| `/policy` | Policy rule center |
| `/admin/models` | Model service |
| `/admin/channels` | Gateway Channel |
| `/settings/sso` | SSO Provider |

---

## Auth

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin-console password login |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/session` | Current session |
| GET/POST | `/api/auth/sso/oidc/*`, `/api/auth/sso/saml/*` | SSO (same as portal) |

---

## IAM

| Method | Path | Scope example |
|---|---|---|
| GET | `/api/admin/users` | `user:read` |
| POST | `/api/admin/users` | `user:create` |
| GET/PATCH/DELETE | `/api/admin/users/:id` | `user:read/update/delete` |
| POST | `/api/admin/users/:id/reset-password` | `user:manage` |
| GET/PUT | `/api/admin/users/:id/models` | `model:manage` — visible-model assignment |
| GET/POST | `/api/admin/departments` | `dept:*` |
| GET/PATCH/DELETE | `/api/admin/departments/:id` | |
| GET/POST | `/api/admin/roles` | `role:*` |
| PATCH/DELETE | `/api/admin/roles/:id` | |
| GET | `/api/admin/roles/:id/users` | |
| POST | `/api/admin/iam/bulk-import` | CSV bulk import |

---

## Model service

| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/admin/providers` | Provider list / create |
| GET/PATCH/DELETE | `/api/admin/providers/:id` | |
| POST | `/api/admin/providers/:id/test` | Connectivity probe |
| POST | `/api/admin/providers/:id/models` | Add a model |
| PATCH/DELETE | `/api/admin/providers/:id/models/:modelName` | Enable / disable a model |

Provider API keys are stored as AES-GCM ciphertext in `api_key_cipher` (key `AGX_PROVIDER_SECRET_KEY`).

---

## Gateway Channel

| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/admin/channels` | Channel CRUD |
| GET/PUT/DELETE | `/api/admin/channels/:id` | |
| GET | `/api/admin/channels/health` | Aggregated Channel health |
| GET | `/api/gateway/health` | Gateway process probe |

---

## Policy rule center

| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/policy/packs` | Rule packs |
| PATCH/DELETE | `/api/policy/packs/:code` | |
| GET/POST | `/api/policy/rules` | Rules (draft/active) |
| PATCH/DELETE | `/api/policy/rules/:id` | Soft delete → grayed out + restore |
| POST | `/api/policy/publish` | Publish snapshot |
| GET | `/api/policy/publishes` | Publish history |
| POST | `/api/policy/publishes/:id/rollback` | Rollback |
| POST | `/api/policy/test` | Sample test (merged with form preview) |

---

## Audit

| Method | Path | Scope |
|---|---|---|
| POST | `/api/audit/query` | `audit:read:all` or `audit:read:dept` |
| POST | `/api/audit/export` | `audit:export` |
| GET | `/api/audit/chain-verify` | `audit:read:all` — checksum chain verification |

---

## Metering

| Method | Path | Description |
|---|---|---|
| POST | `/api/metering/query` | Four-dimensional query |
| POST | `/api/metering/export` | Export |
| GET/PUT | `/api/metering/quota` | Tenant quota read / write |

---

## SSO Provider management

| Method | Path | Description |
|---|---|---|
| GET/POST | `/api/admin/sso/providers` | Provider CRUD |
| PATCH/DELETE | `/api/admin/sso/providers/:id` | |
| POST | `/api/admin/sso/providers/:id/test` | Config test |
| POST | `/api/admin/sso/providers/:id/health` | Health check |
| GET | `/api/admin/sso/providers/stats` | Stats |

Client-secret encryption key: `SSO_PROVIDER_SECRET_KEY`.

---

## Internal API (Gateway fetch)

See [internal-api.md](./internal-api.md). Path prefix `/api/internal/`.

---

## Key environment variables

| Variable | Purpose |
|---|---|
| `ADMIN_CONSOLE_LOGIN_EMAIL` / `ADMIN_CONSOLE_LOGIN_PASSWORD` | Password login |
| `ADMIN_CONSOLE_SESSION_SECRET` | Session signing |
| `GATEWAY_BASE_URL` | Gateway health check |
| `GATEWAY_INTERNAL_TOKEN` | Internal API Bearer |
| `GATEWAY_INTERNAL_BASE_URL` | Channel health aggregation (distinct from gateway 8088) |
| `AGX_PROVIDER_SECRET_KEY` | Provider key encryption |
| `SSO_PROVIDER_SECRET_KEY` | SSO secret encryption |

Made-with: Damon Li
