# Deployable Apps

Directory: `enterprise/apps/`

---

## Overview

> Legend: ✅ implemented · 🟡 partial · ⚪ stub · ⛔ skeleton

| App | Tech | Port | Workspace | Status |
|---|---|---|---|---|
| web-portal | Next.js 15 | 3000 | pnpm | ✅ |
| admin-console | Next.js 15 | 3001 | pnpm | ✅ |
| gateway | Go 1.25 | 8088 | go.mod standalone | ✅ |
| edge-agent | Go | 7823 (design) | — | ⛔ |

---

## web-portal — `@agenticx/app-web-portal`

**Users**: enterprise employees

**Capabilities**

- Login / register / SSO
- Chat workspace (`@agenticx/feature-chat`)
- Model dropdown (admin-assigned visible models)
- Session history persisted in PG
- Token usage chip

**Pages**: `/`, `/auth`, `/workspace`

**API**: see [api/web-portal.md](../api/web-portal.md)

**Start**

```bash
pnpm --filter @agenticx/app-web-portal dev
# or bash scripts/start-dev.sh
```

---

## admin-console — `@agenticx/app-admin-console`

**Users**: tenant admins / security admins

**Capabilities**

- IAM (users / departments / roles / bulk import)
- Policy rule center (draft/publish/rollback/test)
- Gateway audit query and chain verification
- Token metering and quotas
- Model services (providers / keys / model list / user visibility)
- Gateway channel management and health
- SSO provider CRUD

**Pages**: see [api/admin-console.md](../api/admin-console.md)

**Start**

```bash
pnpm --filter @agenticx/app-admin-console dev
```

---

## gateway — Go AI Gateway

**Users**: portal (server-side proxy), external OpenAI-compatible clients

**Capabilities**

- `/v1/chat/completions`, `/v1/embeddings`
- JWT subject forwarding
- Three-channel policy evaluation
- Audit JSONL + PG dual-write
- Token metering
- Quota tracker
- Channel relay (optional)
- Remote pull of admin internal config

**Docs**

- [api/gateway.md](../api/gateway.md)
- [gateway/overview.md](../gateway/overview.md)

**Build**

```bash
cd apps/gateway && go build -o bin/gateway ./cmd/gateway
```

`start-dev.sh` auto-runs gateway via `go run`.

---

## edge-agent — on-device sidecar

**Design goals**

- Local Ollama routing
- Workspace sandbox
- Redacted audit upload

**Current status**

- `cmd/edge-agent/main.go` ~33-line skeleton
- **Not demo-ready**; Machi Desktop uses embedded `agx serve`, not this component

---

## Process dependencies

```
start-dev.sh
  ├── gateway :8088
  ├── web-portal :3000  → depends on gateway + PG
  └── admin-console :3001 → depends on PG; gateway pulls internal API
```

Postgres/Redis: `start-dev-with-infra.sh` or external `DATABASE_URL`.

---

## Customer apps

`pnpm-workspace.yaml` can include `../customers/*/apps/*`:

- Customer portal often `:3100`, admin `:3101`
- `start-dev.sh --all` starts all

Customer apps are **assembly shells** referencing `@agenticx/feature-*` and `@agenticx/ui`.
