# Enterprise deployment

There are two production paths. A Helm chart is **not provided**.

| Path | Use when | Read first |
|------|----------|------------|
| **Local / self-hosted Docker** | Your own servers or intranet; Docker for Postgres/Redis; run portal + admin + gateway | [local-selfhost.md](./local-selfhost.md) |
| **Vercel + external gateway** | portal/admin on Vercel; Go gateway on your host | [vercel-env-checklist.md](./vercel-env-checklist.md) · [vercel-git-autodeploy.md](./vercel-git-autodeploy.md) |

Local **development** (not production) uses `enterprise/scripts/start-dev.sh` / `start-dev-with-infra.sh`. See [development/local-dev.md](../development/local-dev.md).

---

## Where plaintext secrets go

- Real PEMs, tokens, and `DATABASE_URL` belong in `enterprise/.local-secrets/`
- That directory is gitignored (same class as `.env*.local`). **Do not commit it**
- Keep a local copy of [vercel-env-checklist.md](./vercel-env-checklist.md) as `enterprise/.local-secrets/vercel-env-values.local.md` and fill values there

Upstream keys are env vars or Channel `api_key_cipher`. PAT plaintext is shown once at create time. See [gateway/api-tokens.md](../gateway/api-tokens.md).

## Database

- Migrate: `pnpm --filter @agenticx/db-schema db:migrate`
- External Postgres (including hosted): [supabase-migration-guide.md](./supabase-migration-guide.md)
- Seed TLS pitfall: [2026-05-12-supabase-seed-tls-pitfall.md](./2026-05-12-supabase-seed-tls-pitfall.md)

## Also

- [vercel-env-checklist.md](./vercel-env-checklist.md) — env checklist for the two Vercel projects
- [runbooks/](../runbooks/) — SSO, audit backfill, policy rollback, tunnel demos

Made-with: Damon Li
