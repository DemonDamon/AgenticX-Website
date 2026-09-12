# RBAC Scopes

A scope is the smallest unit of Enterprise permission. Format: `resource:verb`.

**Single source of truth**: `packages/iam-core/src/scope-registry.ts`

---

## Registry

| Resource | Verbs | Example scope |
|---|---|---|
| admin | enter | `admin:enter` — enter the admin console |
| user | read, create, update, delete, manage | `user:read` |
| dept | read, create, update, delete, manage | `dept:manage` |
| role | read, create, update, delete, manage | `role:create` |
| audit | read, read:all, read:dept, export, manage | `audit:read:dept` |
| metering | read, export, manage | `metering:export` |
| workspace | read, chat, manage | `workspace:chat` — front-office chat |
| policy | read, create, update, delete, publish, disable, manage | `policy:publish` |
| model | read, create, update, delete, manage | `model:manage` |
| kb | read, create, update, delete, manage | Knowledge base (reserved) |
| automation | read, create, update, delete, manage | Automation (reserved) |
| gateway | read, manage | Gateway configuration |
| provider | read, create, update, delete, manage | Model provider |
| sso | read, create, update, delete, manage | SSO Provider |

---

## Special values

| Value | Meaning |
|---|---|
| `*` | Owns every registered scope (super admin) |

Functions:

- `expandRoleScopes()` — expand `*`
- `mergeUserScopes()` — merge roles and dedupe
- `hasEveryScope()` / `hasSomeScope()` — API route checks

---

## Default seed roles (reference)

`db:seed` plus optional `iam-demo-seed` injects demo data. Typical setup:

| Role code | Purpose | Typical scopes |
|---|---|---|
| owner | Tenant owner | `*` or full manage |
| admin | Platform admin | `admin:enter`, IAM, policy, audit:read:all, model:* |
| security | Security audit | `audit:read:all`, `policy:read`, `metering:read` |
| member | Regular employee | `workspace:chat`, `workspace:read` |

**Minimum for portal chat**: `workspace:chat`  
The default owner already has it; older environments may backfill it via HMR.

---

## Audit visibility

| Scope | Visible range |
|---|---|
| `audit:read:all` | Tenant-wide gateway audit |
| `audit:read:dept` | Records related to the caller's department |
| `audit:export` | Export permission |

**Note**: Using only the legacy scope `audit:read` may return **403** in department-isolation scenarios. Upgrade to `audit:read:dept` or `audit:read:all`.

IAM management audit (`audit_events` table) is authorized separately from gateway audit; the route layer checks each independently.

---

## API route mapping examples

| Route | Required scope |
|---|---|
| `GET /api/admin/users` | `user:read` |
| `POST /api/policy/publish` | `policy:publish` |
| `PUT /api/admin/users/:id/models` | `model:manage` |
| `POST /api/audit/query` | `audit:read:all` or `audit:read:dept` |
| Portal `/api/chat/completions` | `workspace:chat` |

See each feature's `middleware/rbac.ts` and admin route handlers for the actual checks.

---

## Role editor UI

Admin `/iam/roles`:

- Scope multi-select comes from `ALL_REGISTERED_SCOPES`
- System immutable roles cannot be deleted
- Saves take effect immediately (scopes inside the JWT update on the next login / refresh)

---

## Adding a new scope

1. Add the resource/verb to `SCOPE_REGISTRY`
2. Call `hasEveryScope` on the corresponding API route
3. Update this document and the admin role-template seed
4. **Do not** hard-code scope strings in a customer repo without flowing them back into the registry

---

## Related docs

- [features/README.md](../features/README.md) — iam feature
- [api/admin-console.md](../api/admin-console.md)

Made-with: Damon Li
