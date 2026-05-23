# Enterprise API Overview

Enterprise exposes three HTTP API surfaces:

| Category | Base URL | Auth | Doc |
|---|---|---|---|
| Web Portal | `http://localhost:3000` | JWT Cookie / Bearer | [web-portal.md](./web-portal.md) |
| Admin Console | `http://localhost:3001` | Admin Session + RBAC | [admin-console.md](./admin-console.md) |
| AI Gateway | `http://localhost:8088` | JWT Bearer | [gateway.md](./gateway.md) |
| Internal (Gateway only) | admin `:3001/api/internal/*` | `GATEWAY_INTERNAL_TOKEN` | [internal-api.md](./internal-api.md) |

---

## Conventions

### Authentication

- **Portal JWT**: httpOnly cookie after login/SSO; API routes read claims from session
- **Admin session**: separate cookie signed by `ADMIN_CONSOLE_SESSION_SECRET`
- **Gateway**: `Authorization: Bearer <portal_jwt>`, public key `AUTH_JWT_PUBLIC_KEY`
- **Internal**: `Authorization: Bearer <GATEWAY_INTERNAL_TOKEN>`

### Error format

Next.js APIs typically return:

```json
{ "error": "error_code", "message": "human readable" }
```

Gateway business errors use `9xxxx` series (policy block, quota exceeded, etc.), distinct from upstream OpenAI errors.

### Multi-tenancy

Most write operations bind implicitly to JWT `tenant_id`. Internal API returns single-tenant or full config depending on store implementation.

---

## Route counts

| App | Page routes | API routes |
|---|---|---|
| web-portal | 3 | 14 |
| admin-console | 15 | 49+ |
| gateway | — | 4 |

---

## OpenAI-compatible surface

Front-office chat ultimately hits Gateway:

```
POST /v1/chat/completions   # includes SSE stream
POST /v1/embeddings
GET  /healthz
GET  /internal/channel-stats  # requires internal token
```

Portal does not expose OpenAI API directly; `/api/chat/completions` proxies and injects audit headers.

---

## Related docs

- [web-portal.md](./web-portal.md)
- [admin-console.md](./admin-console.md)
- [gateway.md](./gateway.md)
- [internal-api.md](./internal-api.md)
