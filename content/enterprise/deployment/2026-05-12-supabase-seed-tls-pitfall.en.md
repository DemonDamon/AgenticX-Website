# Supabase seed TLS pitfall notes (2026-05-12)

## Background

In `enterprise/packages/db-schema`, running:

```bash
pnpm db:seed
```

against Supabase (`db.<project-ref>.supabase.co:5432`) kept failing with:

```text
Seed failed: Error: self-signed certificate in certificate chain
code: 'SELF_SIGNED_CERT_IN_CHAIN'
```

The successful seed finally printed:

```text
Seed complete: default tenant + admin + super_admin.
```

---

## Symptom vs misdiagnosis

- Symptom: the error looks like a connectivity problem and is easy to misread as a wrong database password.
- Reality: it is not a password error.  
  A wrong password usually surfaces something like `password authentication failed`.

---

## Root cause

When `pg` parses the connection string and sees `sslmode=require`, it overrides the `ssl` object passed in code onto the strict certificate-chain path.  
So even if the code has:

```js
ssl: { rejectUnauthorized: false }
```

it may not take effect, and you still get `SELF_SIGNED_CERT_IN_CHAIN`.

---

## Fix (already landed)

Added a shared helper:

- `enterprise/packages/db-schema/scripts/pg-seed-client-config.mjs`

and reused it from both seed scripts:

- `enterprise/packages/db-schema/scripts/db-seed.mjs`
- `enterprise/packages/db-schema/scripts/iam-demo-seed.mjs`

Core strategy:

1. For `*.supabase.co`, enable seed-friendly TLS by default:
   - `ssl: { rejectUnauthorized: false }`
2. Strip connection-string parameters that would override that behavior:
   - `sslmode`
   - `sslrootcert`
   - `sslcert`
   - `sslkey`
3. Provide switches:
   - `DATABASE_SSL_REJECT_UNAUTHORIZED=true`: force strict verification
   - `DATABASE_SSL_REJECT_UNAUTHORIZED=false`: force relaxed verification (any host)

---

## Recommended way to run

From the `db-schema` directory:

```bash
cd /Users/damon/myWork/AgenticX/enterprise/packages/db-schema
export DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT-REF>.supabase.co:5432/postgres"
pnpm db:seed
```

> Prefer a connection string that does **not** explicitly include `sslmode=require` (for the seed path).  
> Let the in-script helper own TLS compatibility so environments stay consistent.

---

## Verification result

A successful seed writes baseline IAM data:

- Default tenant: `default`
- Default admin: `admin@agenticx.local`
- Role: `super_admin`

---

## Security notes

1. `rejectUnauthorized: false` is only for local seed / development troubleshooting. Do not copy it into the production main path.
2. If a plaintext database password was exposed in a terminal or chat, rotate it immediately in the Supabase console and update `DATABASE_URL`.
3. In production, prefer the platform-recommended TLS/CA approach instead of relying on relaxed verification long term.

---

## If it still fails: troubleshooting order

1. Confirm you are using the Supabase **Direct connection (5432)**.
2. Confirm the `DATABASE_URL` host is `db.<PROJECT-REF>.supabase.co`.
3. Check whether proxy/certificate environment variables are affecting Node TLS:
   - `HTTPS_PROXY`
   - `HTTP_PROXY`
   - `ALL_PROXY`
   - `NODE_EXTRA_CA_CERTS`
4. Retest with the minimal command:

```bash
node ./scripts/db-seed.mjs
```

If it still fails, keep the full stack trace and continue from there (focus on TLS and the proxy chain).

Made-with: Damon Li
