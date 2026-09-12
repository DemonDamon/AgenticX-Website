# SSO Acceptance Checklist

## Alignment items

- Aligns with the *Unified LLM Application Service Procurement Technical Specification*:
  - Access control (sub-account management, freeze/reclaim)
  - 200 concurrent user logins

## Functional acceptance

- [ ] web-portal login page shows an "Enterprise SSO" entry
- [ ] admin-console login page shows an "Enterprise SSO login" entry
- [ ] After a successful portal SSO login, `agenticx_access_token` / `agenticx_refresh_token` are written
- [ ] Admin SSO login is allowed only for users with `admin:enter`
- [ ] Disabled accounts (`status=disabled`) are rejected on SSO login
- [ ] When a provider is disabled, the response is `provider_disabled`

### SAML 2.0 dual-stack acceptance

> Details: [`sso-saml-setup.md`](./sso-saml-setup.md).

- [ ] Admin console can create and enable a protocol=saml provider, and the "Health check" button shows certificate validFrom/validTo
- [ ] portal `/api/auth/sso/saml/start` redirects to the IdP; after a successful callback, access/refresh cookies are set
- [ ] Admin SAML login uses the "pre-provisioned + admin:enter" three-state check
- [ ] Callback failures write `auth.sso.login_failed` audit events with `protocol=saml` and `reason_code=saml.*`
- [ ] After `SSO_SAML_DISABLED=true`, all SAML paths return `saml.provider_not_configured`; OIDC is unaffected

## Security acceptance

- [ ] The state cookie is `HttpOnly`, and SameSite matches the environment: production `SameSite=None + Secure`, non-production `SameSite=Lax`
- [ ] Callback supports state replay protection
- [ ] `client_secret` is stored encrypted (`client_secret_encrypted`)
- [ ] Logs do not print token/id_token/client_secret

## Concurrency acceptance (k6)

Script: `enterprise/scripts/perf/sso-200-concurrent.js` (200 VU ramp; check P50/P95/P99 and error rate in the summary).

```bash
# Requires k6 locally; start web-portal first (default 3000)
SSO_K6_BASE=http://127.0.0.1:3000 k6 run enterprise/scripts/perf/sso-200-concurrent.js
```

Reading template (from the k6 end-of-run summary):

- `http_req_duration..............: avg=... min=... med=... max=... p(90)=... p(95)=...`
- `http_req_failed................: 0.00%`

Acceptance guidance (use as your own baseline when aligning with procurement terms; thresholds in the script are loose defaults and can be tightened per environment):

- At 200 concurrency (or a ramp peak of 200), `/api/auth/sso/oidc/start` **P95 < 800ms** (record a baseline once on a 4C/8G-class machine with a stable network)
- Callback failure rate is 0 (assuming valid test accounts)

Optional archive: paste the summary into `enterprise/docs/perf-baselines/` (see that directory's README).

## Regression commands

```bash
pnpm --filter @agenticx/auth test
pnpm --filter @agenticx/auth typecheck
pnpm --filter @agenticx/app-web-portal test
pnpm --filter @agenticx/app-web-portal typecheck
pnpm --filter @agenticx/app-admin-console test
pnpm --filter @agenticx/app-admin-console typecheck
pnpm e2e:sso
```

Made-with: Damon Li
