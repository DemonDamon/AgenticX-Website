# Troubleshooting Guide

Common issues and remediations. Fuller script notes: [../scripts/README.md](../scripts/README.md).

---

## Startup and environment

| Symptom | Cause | Remedy |
|---|---|---|
| `start-dev.sh` reports missing `AUTH_JWT_*` | bootstrap not run, or PEM deleted | `bash scripts/bootstrap.sh` |
| Portal `chat history operation failed` | PG/Redis not running | `bash scripts/start-dev-with-infra.sh` |
| Port 3000/3001/8088 in use | leftover process | `lsof -i :8088` then kill |
| Turbo TUI Ctrl+C does nothing | TUI captures the signal | Esc then q, or `--ui=stream` |
| Manual pnpm portal login missing JWT key | `*_FILE` not expanded | See [local-dev.md](./local-dev.md) for the manual export |

---

## Login and IAM

| Symptom | Cause | Remedy |
|---|---|---|
| admin password rejected | password env changed after seed | Re-run bootstrap or `reset-dev-data.sh --with-seed` |
| `staff@...` Invalid credentials | no such seed user | Use owner, or create the user from admin |
| Portal has no models to select | no visible models assigned / PG empty | Admin model services + user-visible models; or `migrate:legacy-runtime` |
| IAM 403 | insufficient scope | See [rbac/scopes.md](../rbac/scopes.md) |

---

## Gateway and models

| Symptom | Cause | Remedy |
|---|---|---|
| Only mock replies | no Key | Configure a Provider in admin, or set env `*_API_KEY` |
| Policy not blocking | wrong snapshot path / unpublished | Confirm the `policy-snapshot` path; publish in admin; restart gateway |
| Rule saved but still inactive | placeholder userIds do not match | Leave applies_to empty, or fill real ids |
| blocked=false but Block was selected | test API used the old action in the DB | Use `/api/policy/test`, which merges the form preview |
| Channel unhealthy | wrong `GATEWAY_INTERNAL_BASE_URL` port | Align 8088 and the internal token |

---

## Policy and audit

| Symptom | Cause | Remedy |
|---|---|---|
| After reset `--full`, no policy hits | snapshot cleared | Re-publish in admin + restart gateway |
| Admin has audit, PG pending growing | PG briefly unavailable | [runbooks/audit-pg-backfill.md](../runbooks/audit-pg-backfill.md) |
| Department audit 403 | missing `audit:read:dept` | Upgrade role scopes |

---

## SSO

| Symptom | Cause | Remedy |
|---|---|---|
| SSO button not shown | `NEXT_PUBLIC_SSO_PROVIDERS` not set | Set the env and **fully restart** the Next process |
| `oidc.discovery_failed` | issuer unreachable or placeholder | Self-check with `pnpm sso:oidc-smoke` |
| Changing SSO env has no effect | Next hot reload does not read env | Fully restart admin + portal |

Runbooks: [sso-oidc-setup.md](../runbooks/sso-oidc-setup.md) · [sso-saml-setup.md](../runbooks/sso-saml-setup.md)

---

## Vercel split deployment

| Symptom | Cause | Remedy |
|---|---|---|
| Gateway empty providers | wrong `GATEWAY_REMOTE_*` URL / token mismatch | [internal-api.md](../api/internal-api.md) |
| Portal 0 history rows, admin has data | different DATABASE_URL | Check Vercel env |
| Token always 0 | usage not written back | Confirm gateway DATABASE_URL and portal share the same DB |

Checklist: [deployment/vercel-env-checklist.md](../deployment/vercel-env-checklist.md)

---

## E2E / visual

| Symptom | Cause | Remedy |
|---|---|---|
| chromium not found | Playwright not installed | `pnpm visual-tour:install` |
| visual-tour timeout | dev server not up / passwords not exported | Run `start-dev.sh` first, then export the login passwords |

---

## Log locations

| Component | Log |
|---|---|
| Gateway audit JSONL | `apps/gateway/.runtime/audit/` |
| Gateway metering JSONL | `GATEWAY_USAGE_LOG` or `apps/gateway/.runtime/usage.jsonl` |
| PG pending audit | `apps/gateway/.runtime/audit/.pg-pending` |
| Local quota | `.runtime/gateway/quota-usage.json` |

---

## Database migrations

### `db:migrate` fails with almost no error in the terminal

Symptom: `pnpm --filter @agenticx/db-schema db:migrate` or `bootstrap.sh` exits at the migrate stage with
`Exit status 1` / `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`. The terminal only shows a one-line failure summary — no concrete SQL error.

If the log stops here:

```text
postgres is ready
running db:migrate
...
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL ... drizzle-kit migrate
```

Docker and Postgres are already up; the failure is the database migration. Do not keep re-running `bootstrap.sh`. Get the underlying error first.

**Step 1: Read the on-disk script logs**

```bash
cd enterprise
ls -lt .runtime/logs/
tail -n 120 .runtime/logs/bootstrap-*.log
tail -n 120 .runtime/logs/db-migrate-*.log 2>/dev/null || true
docker logs --tail=120 agenticx-postgres-dev
```

The terminal summary is not the root cause. The real PostgreSQL error is usually in `.runtime/logs/bootstrap-*.log`, `db-migrate-*.log`, or the Postgres container logs.

**Step 2: Check whether you only removed the image, not the database**

Docker images and Postgres data volumes are different things. After `docker rmi` or “clear images”, old database data usually remains in the Docker volume. Old tables, half-finished migrations, or old migration records can still make `db:migrate` fail.

If a development / POC environment can wipe the database, take the rebuild path:

```bash
cd enterprise
bash scripts/bootstrap.sh --reset-db
bash scripts/start-dev-with-infra.sh --ui=stream
```

`--reset-db` deletes the local Postgres data volume and recreates the database. Do not use this in environments that must keep data.

**Step 3: When you cannot wipe the database, keep the scene and keep investigating**

```bash
cd enterprise
docker ps
docker exec -it agenticx-postgres-dev psql -U postgres -d agenticx -c '\dt'
docker exec -it agenticx-postgres-dev psql -U postgres -d agenticx -c 'select * from drizzle.__drizzle_migrations order by created_at desc limit 5;'
```

If `drizzle.__drizzle_migrations` is missing or the schema does not match expectations, send the output together with the logs.

**Step 4: Check for concurrent migrations**

If you see many `CREATE TABLE waiting` or `too many clients already` at the same time, see the [PostgreSQL DDL lock-wait Runbook](../runbooks/postgres-ddl-lock-waiting.md). This is usually multiple processes / replicas running migrations at once, not normal application traffic.

---

## Getting help

1. Confirm `DATABASE_URL` points at the expected database (especially since reset scripts echo the URL)
2. `curl --noproxy '*' http://127.0.0.1:8088/healthz`
3. Admin `GET /api/gateway/health`
4. Gateway process logs (`--ui=stream` mode)

Made-with: Damon Li
