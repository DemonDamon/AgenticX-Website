# SSO OIDC setup guide

> Dual-stack sibling document: [`sso-saml-setup.md`](./sso-saml-setup.md) (SAML 2.0 SP, including the one-click fallback switch `SSO_SAML_DISABLED`).

## Goal

Enable OIDC single sign-on in `enterprise`, with unified authentication for `web-portal` and `admin-console`.

## Common prerequisites

- `bash scripts/bootstrap.sh` has already been completed
- `DEFAULT_TENANT_ID` is configured
- `AUTH_JWT_PRIVATE_KEY` / `AUTH_JWT_PUBLIC_KEY` are configured
- `SSO_STATE_SIGNING_SECRET` and `SSO_PROVIDER_SECRET_KEY` are configured (32+ bytes recommended)

## Security semantics (implemented; for audit / delivery reference)

| Capability | Description |
| --- | --- |
| State cookie | `HttpOnly` + `SameSite=Lax`; the payload is encrypted with **AES-256-GCM** before it is written to the cookie, so plaintext state/nonce/PKCE verifier is not leaked |
| Key derivation | `SSO_STATE_SIGNING_SECRET` must have enough entropy; the implementation derives an encryption subkey with **HKDF** (see `@agenticx/auth` `oidc-state`) |
| SSRF / malicious issuer | Admin `sso-url-guard` DNS-resolves the **issuer** (**5s timeout** + **LRU cache**) and blocks results that resolve to private/loopback addresses |
| Redirect URI | In production, **`redirect_uri` must be HTTPS**; in development, only localhost http or `SSO_DEV_INSECURE_REDIRECT_ALLOWLIST` is allowed; you can tighten further with `NEXT_PUBLIC_SSO_REDIRECT_ORIGIN_ALLOWLIST` and `SSO_REDIRECT_REQUIRE_ISSUER_ORIGIN_MATCH` |

## Environment variables (minimum set)

```bash
NEXT_PUBLIC_SSO_PROVIDERS=default:Enterprise unified identity
SSO_STATE_SIGNING_SECRET=replace-with-32-plus-bytes-random-secret
SSO_PROVIDER_SECRET_KEY=replace-with-32-plus-bytes-random-secret

SSO_OIDC_DEFAULT_ISSUER=https://idp.example.com/realms/agenticx
SSO_OIDC_DEFAULT_CLIENT_ID=agenticx-portal
SSO_OIDC_DEFAULT_CLIENT_SECRET=replace-with-client-secret
SSO_OIDC_DEFAULT_REDIRECT_URI=http://localhost:3000/api/auth/sso/oidc/callback
SSO_OIDC_DEFAULT_ADMIN_REDIRECT_URI=http://localhost:3001/api/auth/sso/oidc/callback
```

### Redirect / issuer tightening (optional)

```bash
# Production recommendation: explicit origin allowlist (validated when admin-console saves a provider)
NEXT_PUBLIC_SSO_REDIRECT_ORIGIN_ALLOWLIST=https://portal.example.com,https://admin.example.com

# Require the redirect_uri origin to match the issuer host (some multi-app deployments need this off)
SSO_REDIRECT_REQUIRE_ISSUER_ORIGIN_MATCH=true

# Development-only non-localhost http redirects (comma-separated origins). Do not use in production.
# SSO_DEV_INSECURE_REDIRECT_ALLOWLIST=http://192.168.1.10:3000
```

## Keycloak example

1. Create a Realm: `agenticx`
2. Create a Client:
   - `Client ID`: `agenticx-portal`
   - `Access Type`: `confidential`
   - `Valid redirect URIs`:
     - `http://localhost:3000/api/auth/sso/oidc/callback`
     - `http://localhost:3001/api/auth/sso/oidc/callback`
3. Copy the client secret into `SSO_OIDC_DEFAULT_CLIENT_SECRET`
4. Set `SSO_OIDC_DEFAULT_ISSUER=https://<keycloak-host>/realms/agenticx`

## Azure Entra ID example

1. Create an App Registration: `AgenticX Enterprise`
2. Add Web Redirect URIs:
   - `http://localhost:3000/api/auth/sso/oidc/callback`
   - `http://localhost:3001/api/auth/sso/oidc/callback`
3. Create a Client Secret
4. Use issuer `https://login.microsoftonline.com/<tenant-id>/v2.0`

## Alibaba Cloud IDaaS example

1. Create an OIDC application
2. Configure the same callback URLs as above
3. Record issuer / clientId / clientSecret in the SSO configuration

## Customer-cloud IDaaS (OIDC) intake checklist

> This section is for M0-stage integration with the customer project's cloud IDaaS. **Until you have the customer's real issuer, do not change business code, and do not replace the `idp.example.com` placeholder with a resolvable domain** — that would cause OIDC discovery to actually fire and surface `oidc.discovery_failed` instead of the existing `oidc.provider_not_configured`.

Ask the customer-side counterpart for the following before filling `.env.local` (see the "customer-cloud IDaaS (OIDC) intake template" at the end of `.env.local.example`).

| Field | Required | Notes / example |
| --- | --- | --- |
| Use OIDC? | Required | If the customer can only provide SAML, switch to [sso-saml-setup.md](sso-saml-setup.md) (M3-stage delivery) |
| Full issuer URL | Required | Shape: `https://<customer-idaas-host>/oauth2`, **no trailing slash** |
| OIDC discovery supported? | Required | That is, can `<issuer>/.well-known/openid-configuration` be reached? If not, the customer must separately provide `authorization_endpoint`, `token_endpoint`, and `jwks_uri` |
| client_id / client_secret | Required | Obtained after creating a confidential client in the customer IDaaS console |
| redirect_uri | Required | During testing, include at least `http://localhost:3000/api/auth/sso/oidc/callback` and `http://localhost:3001/api/auth/sso/oidc/callback`; replace with production domains before go-live |
| User email claim | Required | Default `email`; if the customer uses `mail` / `preferred_username`, override with `SSO_OIDC_CMCC_IDAAS_CLAIM_EMAIL` |
| Display-name claim | Recommended | Usually `name` or `display_name` |
| Department claim | Optional | If the customer wants JIT department sync, they must provide the claim name (for example `department` / `dept_path`) and value convention |
| Role claim | Optional | If the customer uses "role pass-through", they must provide the claim name (for example `roles` / `groups`) and a role dictionary |
| Single logout endpoint | Optional | OIDC RP-Initiated Logout / Back-Channel Logout; if not provided, keep local logout semantics |
| Test allowlist | Required | Whether the customer IDaaS allows `http://localhost:3000` and `http://localhost:3001` on the redirect allowlist for joint debugging; if not, a dedicated test domain is required |
| Customer response SLA | Optional | How issuer / certificate rotation is announced and how much notice is given, so operations can prepare |

After collection, in `.env.local`:

1. Uncomment the "customer-cloud IDaaS (OIDC) intake template" section at the end of `.env.local.example` and fill in the customer values.
2. Change `NEXT_PUBLIC_SSO_PROVIDERS` to a display name such as `customer-idaas:Enterprise unified identity`.
3. Restart `web-portal` and `admin-console`: `NEXT_PUBLIC_*` changes are not picked up by Next.js hot reload.

You can run a baseline self-check without issuing a real OIDC discovery request:

```bash
pnpm --dir enterprise run sso:oidc-smoke
```

The command only reads the current process environment and defaults, then prints whether issuer / client_id / client_secret / redirect_uri / required claims are satisfied. If any item is missing or still the `idp.example.com` placeholder, the exit code is `1`.

## Verification steps

1. Start: `bash scripts/start-dev.sh --ui=stream`
2. Open `http://localhost:3000/auth` and click "Enterprise SSO"
3. After IdP login, you should land on `/workspace`
4. Open `http://localhost:3001/login` and click "Enterprise SSO login"
5. If the user has `admin:enter`, they should enter `/dashboard`

## Common issues

- `oidc.invalid_state`: Multi-tab login or an expired cookie; start login again.
- `admin_scope_missing`: The account lacks `admin:enter`; grant it on the admin role.
- `provider_disabled`: The provider is disabled; enable it under `/settings/sso`.

Made-with: Damon Li
