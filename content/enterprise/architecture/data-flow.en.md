# Enterprise Data Flow

> Last updated: 2026-05-21

This document describes data flow for a complete chat request and related subsystems.

---

## 1. Chat completions main path

![Chat request through the gateway](/docs/svg/ent-chat-seq-en.svg?v=2)

*Diagram: portal forwards to the gateway for quota and policy; a block is a business error; allow calls upstream then writes audit and usage.*

### Portal session persistence

Chat history **is not persisted by Gateway**; portal API writes to PG:

- `POST /api/chat/sessions` → `chat_sessions`
- `POST /api/chat/sessions/:id/messages` → `chat_messages`

Gateway handles inference, policy, audit, and metering only.

---

## 2. Model visibility

![Visible models versus callable upstreams](/docs/svg/ent-visibility-en.svg?v=2)

*Diagram: admin writes providers and visible-model rows; portal filters the dropdown by JWT; the gateway reads callable upstreams separately.*

Portal controls **which model IDs users see**; gateway controls **which upstreams are callable** via internal API or PG provider config.

---

## 3. Policy publish flow

![Only published rules enter the snapshot](/docs/svg/ent-policy-publish-en.svg?v=2)

*Diagram: only status=active rules enter the snapshot; the gateway hot-reloads from a remote URL or local file.*

**Note**: `blocked=true` only when action is **block**; warn/redact may have hits without blocking.

Test endpoint: `POST /api/policy/test` merges form preview with DB rules.

---

## 4. Audit dual-write

![Audit dual-write](/docs/svg/ent-audit-dual-en.svg?v=2)

*Diagram: JSONL must succeed; Postgres is best-effort; failures land in .pg-pending and backfill on boot.*

Admin `/audit` queries PG `PgAuditStore` with scope-based visibility:

- `audit:read:all` — full tenant
- `audit:read:dept` — own department

IAM admin audit lives in a **separate table** `audit_events`.

---

## 5. Token metering

![Token metering](/docs/svg/ent-metering-en.svg?v=2)

*Diagram: the gateway writes usage_records; admin queries and exports; the portal can show a token chip from SSE usage.*

Quotas: `enterprise_runtime_token_quotas` → gateway `quota.Tracker`. Currently **tenant-level**; dept/user TPM requires separate planning.

---

## 6. Channel relay (optional)

When `GATEWAY_CHANNEL_REGISTRY=on`:

![Channel relay](/docs/svg/ent-channel-en.svg?v=2)

*Diagram: admin writes channels; the gateway polls about every 5s; Picker selects; Executor retries the upstream.*

See [runbooks/gateway-channel-relay.md](../runbooks/gateway-channel-relay.md).

---

## 7. SSO login flow (OIDC example)

![OIDC login](/docs/svg/ent-sso-en.svg?v=2)

*Diagram: SSO click → start → IdP authorize → callback token exchange → JIT upsert and cookie.*

Admin mirrors routes on `:3001`; provider CRUD at `/settings/sso` + `/api/admin/sso/providers/*`.

---

## 8. Legacy JSON migration flow

```
.runtime/admin/*.json  (historical local files)
  ▼
migrate-runtime-legacy.ts  (bootstrap / start-dev auto trigger)
  ▼
enterprise_runtime_* tables
  ▼
admin / portal / gateway read PG only
```
