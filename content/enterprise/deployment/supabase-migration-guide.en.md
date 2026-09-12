# Enterprise database migration technical guide

> **When to use this**: Push Drizzle migration files from `enterprise/packages/db-schema` to Supabase Postgres and create all business tables.  
> **Audience**: Developers, operators, new teammates.  
> **Last updated**: 2026-05-12

---

## 1. Background and how it works

### What is a Drizzle migration?

[Drizzle ORM](https://orm.drizzle.team/) is a TypeScript ORM. The workflow is:

1. You **describe the table structure** in TypeScript under `packages/db-schema/src/schema/` (column types, indexes, constraints, and so on).
2. Run `pnpm db:generate` → Drizzle compares the current schema with the historical snapshot and **generates incremental `.sql` migration files** (stored in `drizzle/`).
3. Run `pnpm db:migrate` → Drizzle reads `.sql` files under `drizzle/` that have not yet been applied and **pushes them to the database in order**.

### What Supabase is used for here

Supabase provides a standard Postgres database (hosted).  
We use **only its Postgres**. We do not use Supabase Auth / Row Level Security / Realtime or similar features.  
The only difference from local docker-compose Postgres is the connection string.

---

## 2. Prerequisites

| Requirement | Notes |
|------|------|
| Node.js ≥ 20 | Confirm with `node --version` |
| pnpm ≥ 9 | Confirm with `pnpm --version` |
| A Supabase project already created | Sign in at [app.supabase.com](https://app.supabase.com) and create a project |
| Local clone of the repo | The `enterprise/` directory is accessible |

---

## 3. Get the Supabase connection string

1. Sign in to Supabase → select your project.
2. Left menu **Settings → Database**.
3. Find the **Connection string** section and choose the **URI** tab.
4. Choose **Direct connection** (**do not** choose Supabase Pooler).

> ⚠️ Why Direct connection?  
> `drizzle-kit migrate` uses `SET LOCAL` transaction statements. That is incompatible with the pooler's (Pooler/PgBouncer) transaction mode, so you must use Direct connection (port 5432).  
> Vercel runtime code can use the Pooler (port 6543), but the migration tool cannot.

Connection string format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

Replace `[YOUR-PASSWORD]` with the database password you set when creating the Supabase project.

#### Notes
`PROJECT-REF` is the unique ID Supabase assigns to your project — a random alphanumeric string such as `abcdefghijklmn`.

**Where to find it:**

You can see it in either place:

**Method 1**: Look at the browser address bar  
Open your Supabase project. The URL looks like:
```
https://supabase.com/dashboard/project/abcdefghijklmn
```
The last segment `abcdefghijklmn` is the PROJECT-REF.

**Method 2**: Settings → Database → Connection string  
Copy the full URI there. PROJECT-REF is already filled in, so **you do not need to look it up yourself** — copy the whole string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmn.supabase.co:5432/postgres
```

---

So the **lowest-friction path** is:

Go to Supabase → **Settings → Database → Connection string → URI → Direct connection**, click copy, replace only `[YOUR-PASSWORD]` with the password you set when creating the project, leave everything else as-is, and append `?sslmode=require` at the end.
---

## 4. Run the migration (step by step)

### Step 1: Enter the db-schema package

```bash
cd enterprise/packages/db-schema
```

### Step 2: Install dependencies (first time, or after updates)

```bash
# From the enterprise/ repo root
cd ../..
pnpm install
cd packages/db-schema
```

### Step 3: Set DATABASE_URL and run the migration

```bash
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

pnpm db:migrate
```

**Example of a healthy run**:

```
[drizzle-kit] Using 'pg' driver...
[drizzle-kit] Reading config...
[drizzle-kit] 11 migrations to apply
[drizzle-kit] Applying 0000_friendly_rictor...  ✓
[drizzle-kit] Applying 0001_smiling_tusk...     ✓
...
[drizzle-kit] Applying 0010_runtime_config_pg...✓
[drizzle-kit] All migrations applied successfully
```

### Step 4: Run seed (create the initial admin account)

```bash
pnpm db:seed
```

This inserts into the database:
- Default tenant (`default`)
- Default department (`default`)
- Admin account `admin@agenticx.local`
- Roles and bindings

> To insert IAM demo data (department hierarchy, sample users):
> ```bash
> pnpm db:seed:iam
> ```

### Step 5: Verify in Supabase

Open Supabase → **Table Editor** or **Database → Tables** and confirm these tables exist:

| Table | Description |
|------|------|
| `users` | User accounts |
| `roles` / `user_roles` | Roles and bindings |
| `departments` | Departments |
| `sso_providers` | SSO configuration |
| `audit_events` | IAM operation audit |
| `gateway_audit_events` | AI request audit |
| `chat_sessions` / `chat_messages` | Chat history |
| `usage_records` | Token usage |
| `policy_rules` / `policy_packs` | Policy rules |
| `enterprise_runtime_model_providers` | AI provider configuration (newer) |
| `enterprise_runtime_user_visible_models` | User-visible models (newer) |
| `enterprise_runtime_token_quotas` | Token quotas (newer) |
| `enterprise_runtime_policy_snapshots` | Policy snapshots (newer) |
| `auth_refresh_sessions` | Refresh token persistence (newer) |

About **17+ tables** in total.

---

## 5. Current migration file list

| File | Main contents |
|--------|----------|
| `0000_friendly_rictor.sql` | users / roles / departments baseline tables |
| `0001_smiling_tusk.sql` | user_roles bindings |
| `0002_cultured_ma_gnuci.sql` | audit_events |
| `0003_aberrant_archangel.sql` | chat_sessions / chat_messages |
| `0004_overrated_slyde.sql` | usage_records |
| `0005_supreme_boomer.sql` | policy_rules / policy_packs |
| `0006_complete_ben_parker.sql` | gateway_audit_events |
| `0007_typical_roulette.sql` | Extra indexes and constraints |
| `0008_sso_providers.sql` | sso_providers |
| `0009_eager_famine.sql` | Field patches |
| `0010_runtime_config_pg.sql` | enterprise_runtime_* + auth_refresh_sessions (latest) |

---

## 6. Workflow for later schema changes

When the schema changes (new columns, new tables, index changes, and so on):

```bash
# 1. Edit src/schema/*.ts
# 2. Generate a new migration file
pnpm db:generate

# 3. Review the generated SQL (drizzle/XXXX_*.sql)
# 4. Push it to the database
DATABASE_URL="..." pnpm db:migrate
```

Drizzle keeps a `drizzle.__drizzle_migrations` table in the database that records which migrations have already run, so **already-applied migrations are not executed again**.

---

## 7. Common issues

### Q: Migration reports `prepared statement already exists`
**Cause**: You used a Pooler connection.  
**Fix**: Switch to Direct connection (port 5432).

### Q: Migration reports `SSL SYSCALL error: EOF detected`
**Cause**: The connection string is missing `?sslmode=require`.  
**Fix**: Append `?sslmode=require` to the connection string.

### Q: `pnpm db:migrate` cannot find `DATABASE_URL`
**Fix**: Confirm you have `export DATABASE_URL=...`, or inline it before the command:
```bash
DATABASE_URL="postgresql://..." pnpm db:migrate
```

### Q: Seed reports `duplicate key value`
**Cause**: Seed has already been run once.  
**Fix**: Ignore it. The data already exists and usage is unaffected.

### Q: How to reset the database (destructive)
```bash
# Development/test environments only — this wipes all data!
# In Supabase Dashboard → Database → Reset Database
# Then re-run pnpm db:migrate && pnpm db:seed
```

---

## 8. Companion file index

| File | Description |
|------|------|
| `enterprise/packages/db-schema/src/schema/` | TypeScript schema definitions |
| `enterprise/packages/db-schema/drizzle/` | Migration SQL files |
| `enterprise/packages/db-schema/scripts/db-seed.mjs` | Baseline seed |
| `enterprise/packages/db-schema/drizzle.config.ts` | Drizzle config (reads `DATABASE_URL`) |
| `enterprise/.local-secrets/web-portal.env` | Local Vercel env draft (not in git) |
| `enterprise/docs/deployment/vercel-env-checklist.md` | Full Vercel environment variable checklist |

Made-with: Damon Li
