# Local / private deployment (Docker self-host)

> **When to use this**: Start Postgres/Redis with Docker on your own server or machine, and run web-portal + admin-console + Gateway, without depending on hosted platforms such as Vercel / Supabase.
> **Audience**: Private delivery, intranet deployment, offline evaluation.
> **Last updated**: 2026-06-01

For Vercel hosted deployment, see [README.md](./README.md) and [vercel-env-checklist.md](./vercel-env-checklist.md). This document is the **fully local** path.

---

## 1. Prerequisites

| Tool | Requirement | Notes |
|---|---|---|
| Node.js | ≥ 20 | Run web-portal / admin-console (Next.js) |
| pnpm | Latest stable | Monorepo package manager |
| Go | ≥ 1.22 | Build and run the AI gateway |
| Docker + Compose v2 | Any recent version | Start local Postgres / Redis |
| openssl | Usually preinstalled | Generate the RSA JWT key pair |

Required free ports: **3000** (portal), **3001** (admin), **8088** (Gateway), **5432** (Postgres), **6379** (Redis).

---

## 2. Start from zero (recommended path)

First decide which scenario you are in:

| Scenario | Recommended command | Notes |
|---|---|---|
| First deploy on this machine | `bash scripts/bootstrap.sh` | Initializes `.env.local`, keys, Postgres/Redis, migrations, and seed data |
| Test environment you want to wipe and start over | `bash scripts/bootstrap.sh --reset-db` | Deletes the local Postgres data volume and rebuilds; development / POC only |
| External Postgres already exists | `bash scripts/bootstrap.sh --mode=server` | Does not start Docker middleware; requires `DATABASE_URL` and keys from the outside |

> Note: Deleting a Docker image is not the same as wiping the database. Postgres data usually lives in a Docker volume. If the old database still has half-finished migrations, leftover tables, or bad connections, deleting the image and rerunning can still fail. To rebuild a test environment, use `--reset-db`.

### 1. First-time initialization

```bash
cd enterprise

# Interactive setup of two login passwords, each ≥14 characters, with upper/lower case, digits, and symbols
bash scripts/bootstrap.sh
```

For a test-environment reinstall, when you explicitly allow wiping the database:

```bash
cd enterprise
bash scripts/bootstrap.sh --reset-db
```

### 2. Start the three apps

After `bootstrap.sh` succeeds, start the applications:

```bash
bash scripts/start-dev-with-infra.sh --ui=stream
```

`--ui=stream` prints the three apps' logs directly, which is clearer for live troubleshooting than the Turbo TUI.

### 3. Success criteria

After startup, visit:

| Service | URL |
|---|---|
| Employee portal | <http://localhost:3000> |
| Admin console | <http://localhost:3001> |
| Gateway health check | <http://localhost:8088/healthz> |

The default login is `admin@agenticx.local`. The password is the value you set in step 2 (written to `enterprise/.env.local`):

```bash
grep -E 'ADMIN_CONSOLE_LOGIN_PASSWORD|AUTH_DEV_OWNER_PASSWORD' .env.local
```

> `staff@agenticx.local` is **not** in the default seed. Create it manually in the admin console after login.

### 4. If `bootstrap.sh` fails midway

Do not keep rerunning it. Collect information in this order:

```bash
cd enterprise
ls -lt .runtime/logs/
tail -n 120 .runtime/logs/bootstrap-*.log
tail -n 120 .runtime/logs/db-migrate-*.log 2>/dev/null || true
docker ps
docker logs --tail=120 agenticx-postgres-dev
```

If the terminal only shows something like:

```text
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL @agenticx/db-schema@0.1.0 db:migrate: `drizzle-kit migrate`
Exit status 1
```

that is only the pnpm/drizzle summary, not the real cause. The actual PostgreSQL error is usually in `.runtime/logs/bootstrap-*.log` or the Postgres container logs.

---

## 3. What `bootstrap.sh` does

1. Preflight: node / pnpm / go / docker / openssl
2. Generate `enterprise/.env.local` (chmod 600, already gitignored)
3. Generate an RSA-2048 JWT key pair under `enterprise/.local-secrets/*.pem`
4. `pnpm install`
5. Start Postgres + Redis with Docker (`deploy/docker-compose/dev.yml`)
6. `db:migrate` + `db:seed` (create tables + default tenant / owner)
7. `migrate:legacy-runtime` (idempotently import old JSON config into PG)

Common options:

```bash
bash scripts/bootstrap.sh --reset-db      # Destroy the PG data volume and rebuild (development only)
bash scripts/bootstrap.sh --skip-docker   # You already have a standalone Postgres; skip compose
bash scripts/bootstrap.sh --mode=server   # Non-interactive; all keys/passwords must come from external env vars
```

`bootstrap.sh` is an initialization script, not a long-running service start command. In production / Enterprise delivery test environments, run database migration once as a separate release step. Do not let multiple application replicas migrate at the same time on startup.

---

## 4. Day-to-day and maintenance commands

```bash
# Middleware is already running; start apps only
bash scripts/start-dev.sh --ui=stream

# Stop middleware containers only (does not delete volumes)
bash scripts/start-dev-with-infra.sh --down

# Old JSON runtime config → PG (machine restore / portal has no models)
pnpm migrate:legacy-runtime

# Clear development traces (chat / usage / gateway counters) without deleting primary data
bash scripts/reset-dev-data.sh
```

Middleware container names are fixed as `agenticx-postgres-dev` / `agenticx-redis-dev`. `--down` does not delete volumes. To wipe PG, use `bootstrap.sh --reset-db`.

---

## 5. Connect a real model (optional)

**Recommended (admin GUI)**: Admin console → Platform configuration → Model services → Add vendor → fill in the API Key → Test → Save → Identity & access → Users → check "visible model assignment".

**Alternative (environment variables)**: Append to `enterprise/.env.local`, for example:

```bash
DEEPSEEK_API_KEY=sk-...
LLM_API_KEY=sk-...   # generic fallback
```

> Runtime configuration (model services / user-visible models / token quotas) uses Postgres as the single source of truth (`enterprise_runtime_*` tables). Gateway rereads provider config about every 5 seconds, so admin changes take effect within a few seconds with no restart. Key resolution rules are in [../gateway/runtime-config.md](../gateway/runtime-config.md).

---

## 6. Enterprise servers (non-interactive / external Postgres)

On a server, stay non-interactive and inject all secrets from the outside:

```bash
export DATABASE_URL='postgresql://user:pass@db-host:5432/agenticx'
export AUTH_JWT_PRIVATE_KEY="$(cat /secure/path/auth_private.pem)"
export AUTH_JWT_PUBLIC_KEY="$(cat /secure/path/auth_public.pem)"
export ADMIN_CONSOLE_LOGIN_PASSWORD='...'
export ADMIN_CONSOLE_SESSION_SECRET='...'
bash scripts/bootstrap.sh --mode=server
```

- `--mode=server` does not start Docker and requires a reachable external Postgres (`DATABASE_URL`).
- Production builds use `pnpm build` plus each app's own `start`. Gateway is `go build ./apps/gateway/cmd/gateway`, producing a single binary run as its own process.
- Full environment variable groups are in [../configuration/env-vars.md](../configuration/env-vars.md).

---

## 7. Common issues

| Symptom | Action |
|---|---|
| `start-dev.sh` reports missing `AUTH_JWT_*` | Bootstrap was not run, or PEM files were deleted → rerun `bootstrap.sh` |
| Portal `chat history operation failed` | PG/Redis is not up → use `start-dev-with-infra.sh` |
| Admin login password is wrong | Env was changed after seed → rerun bootstrap or `reset-dev-data.sh --with-seed` |
| Portal has no models to select | Admin has not configured models / has not assigned visible models → configure them, or `pnpm migrate:legacy-runtime` |
| `db:migrate` only shows `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` | Read `.runtime/logs/bootstrap-*.log` / `db-migrate-*.log` first; do not stop at the terminal summary |
| Migration still fails after deleting images | Images are not the data; in a test environment use `bash scripts/bootstrap.sh --reset-db` to wipe the PG volume |
| Port in use (3000/3001/8088) | `lsof -i :8088` then kill the old process |
| Docker CLI hangs with no response | See [../development/troubleshooting.md](../development/troubleshooting.md#docker-cli-卡住--daemon-无响应) |

For fuller troubleshooting see [../development/troubleshooting.md](../development/troubleshooting.md) and [../../scripts/README.md](../../scripts/README.md).

Made-with: Damon Li
