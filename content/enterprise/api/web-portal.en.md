# Web Portal API

> Source root: `apps/web-portal/src/app/api/`  
> Page root: `apps/web-portal/src/app/`

Base URL: `http://localhost:3000` (replace with the production domain)

---

## Page routes

| Path | Description |
|---|---|
| `/` | Session present → `/workspace`, otherwise → `/auth` |
| `/auth` | Login / register / SSO |
| `/workspace` | Main chat workspace |

---

## Auth

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Email-and-password login |
| POST | `/api/auth/register` | Register (if enabled) |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/session` | Current session / claims |

### SSO — OIDC

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/sso/oidc/start?provider=<id>` | 302 redirect to the IdP |
| GET | `/api/auth/sso/oidc/callback` | Callback: exchange token and write session |

### SSO — SAML

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/sso/saml/start?provider=<id>` | Redirect to the IdP |
| POST | `/api/auth/sso/saml/callback` | ACS callback |

SSO buttons are controlled by `NEXT_PUBLIC_SSO_PROVIDERS=id:displayName`. See [runbooks/sso-oidc-setup.md](../runbooks/sso-oidc-setup.md) for configuration.

---

## Chat

| Method | Path | Description |
|---|---|---|
| POST | `/api/chat/completions` | Proxy to Gateway; supports SSE |
| GET | `/api/chat/sessions` | Current user's session list |
| POST | `/api/chat/sessions` | Create a session |
| PATCH | `/api/chat/sessions/:sessionId` | Update title and similar fields |
| DELETE | `/api/chat/sessions/:sessionId` | Soft delete |
| GET | `/api/chat/sessions/:sessionId/messages` | Message list |
| POST | `/api/chat/sessions/:sessionId/messages` | Append a message (persisted) |

### Completions request notes

- Requires a valid portal session (`workspace:chat` scope)
- Body: OpenAI chat completions format (`model`, `messages`, `stream`, and so on)
- Env var `GATEWAY_COMPLETIONS_URL` defaults to `http://127.0.0.1:8088/v1/chat/completions`
- On a policy **block**, the UI must be visually distinct from a normal model reply (compliance-block styling)

---

## User models

| Method | Path | Description |
|---|---|---|
| GET | `/api/me/models` | Models visible to the current user (after admin assignment) |

Data source: `enterprise_runtime_user_visible_models` + provider configuration.

---

## Admin helpers

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/users` | Create a user in restricted cases (requires manage scope) |

---

## Key environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PG |
| `AUTH_JWT_PRIVATE_KEY` / `AUTH_JWT_PUBLIC_KEY` | JWT |
| `AUTH_DEV_OWNER_PASSWORD` | Dev owner password |
| `ENABLE_DEV_BOOTSTRAP` | Auto-bootstrap outside production |
| `DEFAULT_TENANT_ID` / `DEFAULT_DEPT_ID` | Default tenant / department |
| `GATEWAY_COMPLETIONS_URL` | Gateway forward URL |
| `NEXT_PUBLIC_SSO_PROVIDERS` | SSO button list |

For the full list, see `enterprise/.env.local.example` and [deployment/vercel-env-checklist.md](../deployment/vercel-env-checklist.md).

Made-with: Damon Li
