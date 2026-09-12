# Testing Strategy

Enterprise tests are spread across the Go gateway, TS packages/apps, and scripted E2E. The repo has **no** documented guarantee of a unified all-green CI (treat each package `test` script as the source of truth).

---

## Command matrix

| Command | Scope | Prerequisites |
|---|---|---|
| `pnpm test` | turbo per-package test | Varies by package |
| `pnpm typecheck` | Full TS monorepo | `pnpm install` |
| `pnpm lint` | ESLint | |
| `cd apps/gateway && go test ./...` | Gateway unit tests | Go 1.25+ |
| `pnpm e2e:iam` | Playwright IAM smoke | :3000 + :3001 already up |
| `pnpm e2e:sso` | SSO entry reachability | Same as above |
| `pnpm visual-tour` | 13 pages × 2 themes screenshots | Same as above + Chromium |
| `pnpm sso:oidc-smoke` | OIDC env-field self-check | No network |
| `k6 run scripts/perf/sso-200-concurrent.js` | SSO concurrency load test | k6 installed |

---

## E2E: IAM

```bash
bash scripts/start-dev.sh
pnpm e2e:iam
```

Covers the admin IAM department / role / user critical path.

Environment variables:

- `ADMIN_BASE_URL` (default `http://localhost:3001`)
- `ADMIN_CONSOLE_LOGIN_PASSWORD`

---

## E2E: SSO smoke

```bash
pnpm e2e:sso
```

- `PORTAL_BASE` / `ADMIN_BASE`
- Only checks that `/auth`, `/login`, and the SSO entry are reachable; it does **not** complete a full IdP token exchange

---

## Visual tour

```bash
pnpm visual-tour:install   # first time
bash scripts/start-dev.sh
export ADMIN_CONSOLE_LOGIN_PASSWORD=...
export AUTH_DEV_OWNER_PASSWORD=...
pnpm visual-tour
```

Output: `docs/visuals/v2/{page}-{theme}.png` (26 images; may be gitignored)

Used for PR visual regression. Reference commit `feat/enterprise-visual-overhaul-v2`.

---

## OIDC config self-check

```bash
pnpm sso:oidc-smoke
```

Exit codes:

- `0` — all fields present
- `1` — missing field or placeholder issuer
- `2` — `NEXT_PUBLIC_SSO_PROVIDERS` not configured

---

## SAML mock IdP

```bash
pnpm sso:saml-mock-setup
pnpm sso:saml-mock
```

Local mock IdP; see `scripts/sso/mock-saml-idp/`.

---

## Channel rotate E2E

```bash
bash scripts/e2e-channel-rotate.sh
```

Requires the gateway channel registry enabled plus admin channels configured.

---

## Performance load test

```bash
k6 run scripts/perf/sso-200-concurrent.js
```

**Note**: The repo has no official performance baseline. Do not treat a single run as a customer SLA commitment. See [perf-baselines/README.md](../perf-baselines/README.md).

---

## MVP acceptance

Before an on-site demo, check: [mvp-acceptance-checklist-v20260422.md](../mvp-acceptance-checklist-v20260422.md)

Distinguish:

- ✅ Demoable — IAM, chat, policy, audit, metering, model service
- ⚠️ Needs a small change — depends on deploy env
- ❌ Not demoable — KB, MCP marketplace, edge-agent, tool-watermark, and other stubs

---

## Writing new tests

- **Unit**: vitest inside each package, close to the public API
- **Integration**: prefer Playwright on admin/portal critical paths
- **Gateway**: Go table-driven tests in `internal/*/*_test.go`

Avoid implementation-coupled assertions (for example asserting a specific CSS class) unless the test is dedicated visual regression.

---

## Related docs

- [development/local-dev.md](../development/local-dev.md)
- [../scripts/README.md](../scripts/README.md)

Made-with: Damon Li
