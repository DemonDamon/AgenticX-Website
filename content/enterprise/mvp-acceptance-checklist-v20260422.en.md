# AgenticX Enterprise MVP Acceptance Checklist (V20260422)

> Checklist results against technical specification sections §1.3 / §1.4 / §1.5.

## §1.3 Admin capabilities

- [x] Visual admin entry available (`admin-console` login + sidebar + top bar).
- [x] Sub-account management: user CRUD, enable/disable, password reset, role binding, bulk CSV import (preflight/retry/progress).
- [x] Department tree: hierarchy, member assignment, node CRUD.
- [x] Four-dimensional usage query UI (dept → user → vendor/model → time range) with export.
- [x] Independent deployment: `web-portal` / `admin-console` / `gateway` can deploy separately.

## §1.4 AI gateway capabilities

- [x] Self-hosted Go gateway startup: config load + `healthz` health check.
- [x] OpenAI-compatible API: `/v1/chat/completions` (normal response + SSE streaming).
- [x] Three-route routing: `local / private-cloud / third-party` (request headers + model config).
- [x] Provider abstraction layer (OpenAI-compatible provider; mock output validates contract).
- [x] Sensitive policy engine: keyword (Trie), regex, PII baseline, `block/redact/warn`.
- [x] Pre/post processing: request pre-check block, response post-check redact, unified `9xxxx` error codes.
- [x] E2E block verification: 3 financial-sensitive prompts blocked 100%.

## §1.5 Logging & audit

- [x] AuditEvent schema fixed in `packages/core-api` (covers actor/model/route/summary/policy hits/checksum chain).
- [x] Gateway audit persistence: append-only JSONL + checksum chain + file mode `0600`.
- [x] Audit query API: filter by tenant and RBAC scope with chain integrity check on query.
- [x] Audit log UI: list, filters, detail drawer, CSV export.
- [x] usage_records: async gateway reporting + PostgreSQL storage + daily materialized view aggregation.
- [x] Four-dimensional query API: `dept/user/provider/model/start/end/group_by` pivot support.

## Verification artifacts this phase

- Screenshots under `enterprise/docs/visuals/`:
  - `w4-portal-auth.png`
  - `w4-portal-signup-result.png`
  - `w4-portal-workspace.png`
  - `w4-portal-chat-normal.png`
  - `w4-portal-chat-compliance.png`
  - `w4-admin-login.png`
  - `w4-admin-dashboard.png`
  - `w4-admin-metering.png`
