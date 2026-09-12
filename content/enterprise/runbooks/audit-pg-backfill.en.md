# Gateway Audit: PostgreSQL Dual-Write, Backfill, and Troubleshooting

## Architecture overview

- **JSONL** (`.runtime/audit/audit-YYYYMMDD.jsonl`): local Gateway **must-succeed** append-only fallback; the Blake2b chain is computed before the file write.
- **PostgreSQL** (`gateway_audit_events`): when `DATABASE_URL` is set, **best-effort** async insert; on failure, append to `.runtime/audit/.pg-pending`.
- **Backfill**: on process start, async `RunBackfill` scans JSONL for the last `GATEWAY_AUDIT_BACKFILL_DAYS` days (default 7, max 90) and fills missing PG `id`s via `INSERT ... ON CONFLICT DO NOTHING`.

## Ops checks

1. **Migration**: after deploy, run
   `pnpm --filter @agenticx/db-schema db:migrate`
   Confirm table `gateway_audit_events` exists.

2. **Gateway environment variables**
   - `DATABASE_URL`: may point at the same PG as Enterprise IAM.
   - `GATEWAY_AUDIT_BACKFILL_DAYS`: tunable backfill window.

3. **Admin queries**
   - List/export uses `PgAuditStore`, requires `tenant_id`, and scopes visibility:
     `audit:read:all` (and `*` / `audit:manage`) all tenants; `audit:read:dept` own department; others (e.g. `audit:read` only) self only.
   - Full-table chain verify: `GET /api/audit/chain-verify`, requires **`audit:read:all`** (super-admin `*` also works).

## `.pg-pending` troubleshooting

- Path: `{auditDir}/.pg-pending` (same directory as `FileWriter`).
- Meaning: a pending-backfill clue from a failed async PG write; after a successful backfill, `RunBackfill` tries `clearPgPending` to clean it up.
- If it **accumulates long-term** and PG has recovered: restart Gateway to trigger backfill, or confirm `DATABASE_URL` network/permissions and migrations are ready.

## Chain verification failure

- Admin-console "full-table chain verify" returns the first broken-chain `id` and `reason` (`prev_checksum_mismatch` / `checksum_mismatch`, etc.).
- **`client_type = admin-console`** export self-audit rows **do not participate** in chain calculation (checksum is a placeholder); do not mix them with the gateway chain.
- Investigation order: corresponding tenant JSONL raw row → whether it matches the PG row → whether the file/PG was manually altered.

## Existing tenant role upgrade notes

Built-in roles are inserted by `ensureSystemRoles` **only when a role code first appears**; existing `owner`/`admin`/`auditor` rows that still have the old `audit:read` must be **manually updated** in the database so `roles.scopes` includes `audit:read:all` (and `audit:export` if needed), or create a `dept_admin` role row as needed. Newly created tenants use the latest seed in the repo.

## Export self-audit and rate limits

- After each successful CSV export, write `event_type = audit_export` to `gateway_audit_events` (`client_type: admin-console`).
- Same user export **≤ 3 times per minute** (in-process memory bucket in admin-console; multi-instance needs Redis or similar later).

Made-with: Damon Li
