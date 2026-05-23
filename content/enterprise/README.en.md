# AgenticX Enterprise Documentation

> Compiled from the full `enterprise/` codebase. Last updated: 2026-05-21

Enterprise is an integrated platform for enterprise LLM applications, combining **employee portal (web-portal)**, **admin console (admin-console)**, and **AI gateway (gateway)** with a shared Postgres multi-tenant data layer and unified RBAC.

---

## Quick navigation

| I want to… | Go to |
|---|---|
| Run it for the first time | [../README.md](../README.md) → [development/local-dev.md](./development/local-dev.md) |
| Understand the architecture | [architecture/overview.md](./architecture/overview.md) |
| Look up API routes | [api/README.md](./api/README.md) |
| Look up database tables | [database/schema.md](./database/schema.md) |
| Look up environment variables | [configuration/env-vars.md](./configuration/env-vars.md) |
| **Connect real models** | [development/local-dev.md#connect-real-models](./development/local-dev.md) · [gateway/runtime-config.md](./gateway/runtime-config.md) |
| **Publish / test policies** | [gateway/policy-engine.md](./gateway/policy-engine.md) · [api/admin-console.md#policy-rule-center](./api/admin-console.md) |
| **View token usage** | [api/admin-console.md#metering](./api/admin-console.md) · `/metering` page |
| Configure SSO | [runbooks/sso-oidc-setup.md](./runbooks/sso-oidc-setup.md) |
| Configure policies / plugins | [plugin-protocol/README.md](./plugin-protocol/README.md) · [gateway/policy-engine.md](./gateway/policy-engine.md) |
| Deploy to Vercel + external Gateway | [deployment/README.md](./deployment/README.md) |
| Customer customization | [guides/enterprise-customers-collaboration.md](./guides/enterprise-customers-collaboration.md) |
| Troubleshooting | [development/troubleshooting.md](./development/troubleshooting.md) |

---

## Documentation index

### Architecture

- [overview.md](./architecture/overview.md) — Component topology, monorepo layout, tech stack
- [data-flow.md](./architecture/data-flow.md) — Chat, policy, audit, and metering data flows

### Apps & modules

- [apps/README.md](./apps/README.md) — Four deployable units (portal / admin / gateway / edge-agent)
- [features/README.md](./features/README.md) — Ten business domains and implementation status
- [packages/README.md](./packages/README.md) — Shared technical packages

### API reference

- [api/README.md](./api/README.md) — API index
- [api/web-portal.md](./api/web-portal.md) — Portal REST routes
- [api/admin-console.md](./api/admin-console.md) — Admin REST routes
- [api/gateway.md](./api/gateway.md) — Go gateway OpenAI-compatible API
- [api/internal-api.md](./api/internal-api.md) — Gateway ↔ Admin internal API

### Gateway

- [gateway/overview.md](./gateway/overview.md) — Routing, channel relay, quota, audit
- [gateway/policy-engine.md](./gateway/policy-engine.md) — Three-channel policy evaluation
- [gateway/runtime-config.md](./gateway/runtime-config.md) — Provider / quota / snapshot in Postgres

### Data & permissions

- [database/schema.md](./database/schema.md) — Drizzle schema, 22 tables, migration strategy
- [rbac/scopes.md](./rbac/scopes.md) — Scope registry and role templates

### Configuration

- [configuration/env-vars.md](./configuration/env-vars.md) — Full environment variable reference

### Plugins

- [plugin-protocol/README.md](./plugin-protocol/README.md) — rule-pack / tool-pack / theme-pack manifest spec

### Development & testing

- [development/local-dev.md](./development/local-dev.md) — bootstrap / start-dev workflow
- [development/troubleshooting.md](./development/troubleshooting.md) — Common issues
- [testing/README.md](./testing/README.md) — E2E, visual tour, load-test scripts

### Deployment & operations

- [deployment/README.md](./deployment/README.md) — Vercel + external gateway
- Runbooks under [runbooks/](./runbooks/)
