# Database Schema

> Last updated: 2026-05-21 · Corresponding code: `packages/db-schema/src/schema/*`

ORM: **Drizzle ORM** + PostgreSQL  
Package: `@agenticx/db-schema` (`packages/db-schema/`)  
Migrations: `packages/db-schema/drizzle/` (`0000` → `0011_gateway_channels.sql`)

---

## 1. Migrations and Seed

```bash
# bootstrap.sh runs this automatically
pnpm --filter @agenticx/db-schema db:migrate
pnpm --filter @agenticx/db-schema db:seed
```

| Seed script | What it writes |
|---|---|
| `scripts/db-seed.mjs` | Default tenant, owner user, `owner` role (including `*` scope) |
| `scripts/iam-demo-seed.mjs` (optional) | Multi-level departments, 4 roles, 10 demo users; triggered via `reset-dev-data.sh --with-iam-seed` |

---

## 2. Table inventory (22 tables)

### 2.1 IAM core (7)

| Table | Key columns | Description |
|---|---|---|
| `tenants` | `id`, `code`, `name`, `plan` | Tenant |
| `organizations` | `id`, `tenant_id`, `name` | Organization |
| `departments` | `id`, `tenant_id`, `org_id`, `parent_id`, `path` | Department tree (with path) |
| `users` | `id`, `tenant_id`, `dept_id`, `email`, `display_name`, `password_hash`, `status`, `phone`, `employee_no`, `job_title`, `failed_login_count`, `locked_until`, `is_deleted`, `deleted_at` | Users (soft delete + login lockout) |
| `roles` | `id`, `tenant_id`, `code`, `name`, `scopes` jsonb, `immutable` | `immutable=true` marks a system role that cannot be deleted |
| `user_roles` | `user_id`, `role_id`, `scope_org_id`, `scope_dept_id` | Multiple roles; supports scoped assignment |
| `sso_providers` | `id`, `tenant_id`, `provider_type`(oidc/saml), `client_secret_cipher` | Client secret encrypted with AES-GCM |

### 2.2 Chat (2)

| Table | Key columns | Description |
|---|---|---|
| `chat_sessions` | `id`, `tenant_id`, `user_id`, `title`, `active_model`, `message_count`, `last_message_at`, `deleted_at` | Soft delete; `active_model` remembers the current model |
| `chat_messages` | `id`, `session_id`, `role`, `content`, `model`, `metadata` jsonb | Full message history |

### 2.3 Metering (1)

| Table | Key columns | Description |
|---|---|---|
| `usage_records` | `tenant_id`, `dept_id`, `user_id`, `provider`, `model`, `route`, `time_bucket`, `input_tokens`/`output_tokens`/`total_tokens` numeric(20,0), `cost_usd` numeric(18,8) | Five-dimension aggregation |

### 2.4 Audit (two tables)

| Table | Key columns | Description |
|---|---|---|
| `audit_events` | actor, target_kind, detail | Audit of **IAM admin operations** (admin CRUD) |
| `gateway_audit_events` | `event_time`, `event_type`, `user_id`, `user_email`, `department_id`, `session_id`, `client_type`, `client_ip`, `provider`, `model`, `route`, `input/output/total_tokens`, `latency_ms`, `digest` jsonb, `policies_hit` jsonb (GIN index), `tools_called` jsonb, `prev_checksum`, `checksum`, `signature` | Audit of **LLM calls**; Blake2b chain |

> ⚠️ The two tables have different uses: the admin `/audit` page queries `gateway_audit_events`; IAM operation logs go to `audit_events`.

### 2.5 Policy (4)

| Table | Key columns | Description |
|---|---|---|
| `policy_rule_packs` | `code`, `name`, `source`, `enabled`, `applies_to` jsonb | Rule pack |
| `policy_rules` | `pack_id`, `code`, `kind`, `action`, `severity`, `message`, `payload` jsonb, `applies_to` jsonb, `status`(draft/active), `updated_by` | Individual rule |
| `policy_rule_versions` | `rule_id`, `version`, `snapshot` jsonb, `author` | A version is kept on each save |
| `policy_publish_events` | `snapshot` jsonb | Publish history |

`applies_to` field (`PolicyAppliesTo` type):

```ts
{
  version?: number;
  departmentIds?: string[];
  departmentRecursive?: boolean;
  roleCodes?: string[];
  userIds?: string[];
  userExcludeIds?: string[];
  clientTypes?: string[];
  stages?: string[];
}
```

### 2.6 Runtime configuration (6, migrated from JSON to PG)

| Table | Former JSON | Key columns |
|---|---|---|
| `enterprise_runtime_model_providers` | `providers.json` | `tenant_id`, `provider_id`, `display_name`, `base_url`, `api_key_cipher`, `enabled`, `is_default`, `route`, `env_key`, `models` jsonb |
| `enterprise_runtime_user_visible_models` | `user-models.json` | `tenant_id`, `assignment_key`(user ulid or `email:xxx`), `model_id` — composite primary key |
| `enterprise_runtime_token_quotas` | `quotas.json` | `tenant_id` primary key, `config` jsonb |
| `enterprise_runtime_policy_snapshots` | `policy-snapshot.json` | `tenant_id` primary key, `snapshot` jsonb |
| `auth_refresh_sessions` | — | `session_id`, `user_id`, `tenant_id`, `dept_id`, `email`, `scopes_json`, `expires_at` (serverless multi-replica refresh) |
| `gateway_channels` | — | `id`, `tenant_id`, `name`, `provider_type`(default `openai`), `base_url`, `api_key_cipher`, `weight`, `priority`, `status`(active/disabled), `supported_models` jsonb, `metadata` jsonb |

Migration CLI:

```bash
pnpm -C enterprise migrate:legacy-runtime
```

Triggered automatically by `bootstrap.sh` and `start-dev.sh` (local DB only); idempotent.

---

## 3. ER relationships

![Table relationships with tenants as the root](/docs/svg/ent-schema-en.svg?v=2)

*Diagram: tenants own IAM, chat, policy, runtime, audit, and Channel; departments can nest; users own sessions.*

---

## 4. Shared column conventions (`_shared.ts`)

| Helper | Columns |
|---|---|
| `ulid(name)` | `varchar(26)` — used for all primary keys / FKs |
| `auditColumns` | `created_at`, `updated_at` (withTimezone, defaultNow) |
| `softDeleteColumns` | `is_deleted` boolean, `deleted_at` timestamptz |

---

## 5. Tenant isolation rules

- Business tables all carry a `tenant_id` FK → `tenants.id`; delete policy is usually `RESTRICT` (to avoid accidental wipes)
- Composite unique indexes often include `tenant_id` (e.g. `users_tenant_email_uq`)
- The API layer injects tenant from the JWT; the server must not read or write across tenants
- Multi-tenant expansion: the Internal API currently returns the whole tenant in a single-tenant deployment; for multi-tenant fan-out, the caller passes `tenant_id` to filter (as implemented)

---

## 6. Encrypted fields

| Field | Algorithm | Secret env var |
|---|---|---|
| `enterprise_runtime_model_providers.api_key_cipher` | AES-256-GCM | `AGX_PROVIDER_SECRET_KEY` |
| `gateway_channels.api_key_cipher` | AES-256-GCM | `AGX_PROVIDER_SECRET_KEY` |
| `sso_providers.client_secret_cipher` | AES-256-GCM | `SSO_PROVIDER_SECRET_KEY` |

Key rotation: all existing rows must be re-encrypted; batch via an ops script.

---

## 7. Source index

| File | Tables |
|---|---|
| `schema/tenants.ts` | tenants |
| `schema/organizations.ts` | organizations |
| `schema/departments.ts` | departments |
| `schema/users.ts` | users |
| `schema/roles.ts` | roles |
| `schema/user-roles.ts` | user_roles |
| `schema/sso-providers.ts` | sso_providers |
| `schema/chat-sessions.ts` | chat_sessions |
| `schema/chat-messages.ts` | chat_messages |
| `schema/usage-records.ts` | usage_records |
| `schema/audit-events.ts` | audit_events |
| `schema/gateway-audit-events.ts` | gateway_audit_events |
| `schema/policy.ts` | policy_rule_packs, policy_rules, policy_rule_versions, policy_publish_events |
| `schema/runtime-config.ts` | enterprise_runtime_*, auth_refresh_sessions |
| `schema/gateway-channels.ts` | gateway_channels |

Export index: `schema/index.ts`

---

## 8. Related docs

- [../gateway/runtime-config.md](../gateway/runtime-config.md) — PG-backed runtime configuration
- [../deployment/supabase-migration-guide.md](../deployment/supabase-migration-guide.md)
- [../runbooks/audit-pg-backfill.md](../runbooks/audit-pg-backfill.md) — Audit PG backfill
- [../configuration/env-vars.md](../configuration/env-vars.md) — Environment variable catalog

Made-with: Damon Li
