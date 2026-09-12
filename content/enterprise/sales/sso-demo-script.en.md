# 3-Minute SSO Demo Script

## 0:00 - 0:30 Background

“We are now demonstrating AgenticX Enterprise unified authentication. The goal is to connect the customer's existing IdP (for example Keycloak/Entra/IDaaS), rather than asking the customer to migrate their account system.”

## 0:30 - 1:30 Demo portal SSO

1. Open the `web-portal` login page and click “Enterprise SSO”.
2. Redirect to the IdP login page and sign in with a test account.
3. After a successful login, return automatically to `/workspace`.
4. Note: first login can auto-create a local account by policy (JIT); later logins use the same permission system.

## 1:30 - 2:20 Demo admin SSO + access control

1. Open the `admin-console` login page and click “Enterprise SSO login”.
2. Sign in with an account that has `admin:enter` and enter `/dashboard`.
3. Then try a regular account; the page shows `admin_scope_missing` (demonstrates least privilege).

> **Talking points · Why admin does not do JIT**: Admin-console accounts are pre-provisioned by ops/super-admin and granted `admin:enter` and related permissions by default; SSO only authenticates and maps identity. It does not auto-create high-sensitivity admin accounts at login time, avoiding a “first login grants admin identity” window. The portal can still enable JIT / default roles as planned, controlled by a policy switch.

## 2:20 - 2:50 Demo configuration

1. Go to `/settings/sso`.
2. Show the provider list, enable/disable, and save configuration.
3. Click connectivity test (if the demo environment supports it).

## 2:50 - 3:00 Close

“We use standard OIDC SSO and do not run our own OAuth2 authorization server. That keeps onboarding fast and risk low: reuse the enterprise's existing auth system while retaining audit and access-control capabilities.”

Made-with: Damon Li
