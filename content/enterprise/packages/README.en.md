# Packages — Shared Technical Modules

Directory: `enterprise/packages/`  
Shared by apps and features; managed as a pnpm workspace.

---

## Package list

> Legend: ✅ implemented · 🟡 partial · ⚪ stub · ⛔ skeleton

| Package | NPM | Status | Description |
|---|---|---|---|
| ui | `@agenticx/ui` | ✅ | shadcn primitives, OKLCH theme, AppShell, DataTable, and more |
| auth | `@agenticx/auth` | ✅ | JWT, passwords, OIDC/SAML, Next middleware |
| db-schema | `@agenticx/db-schema` | ✅ | Drizzle schema, migrations, seed |
| iam-core | `@agenticx/iam-core` | ✅ | PG repos, scope-registry, crypto, legacy migrate |
| core-api | `@agenticx/core-api` | 🟡 | Chat types, errors, audit schema |
| config | `@agenticx/config` | 🟡 | Branding / feature-flag / plugin config loading |
| policy-engine | `@agenticx/policy-engine` | Go ✅ / TS ⚪ | Policy engine embedded in Gateway |
| sdk-ts | `@agenticx/sdk-ts` | 🟡 | HTTP chat client / mock |
| sdk-py | `agenticx-sdk` | ⚪ | Not in the pnpm workspace |
| branding | `@agenticx/branding` | ⚪ | Reserved for white-label components |
| telemetry | `@agenticx/telemetry` | ⚪ | Reserved for analytics / OTel |

---

## @agenticx/ui

**Entry**: component barrel + `themes/base.css`

**Highlights**

- Tailwind v4 `@theme inline` + OKLCH indigo/violet primary
- Three-state theme: `system` / `dark` / `light` (`useUiTheme`)
- AppShell v2: grouped sidebar, ⌘K command palette, breadcrumbs
- Primitives: Button, Dialog, Sheet, DataTable (tanstack-table), Toaster (sonner), and more

**Consumers**: web-portal, admin-console

---

## @agenticx/auth

**Responsibilities**

- RS256 JWT issue / verify
- Portal refresh session (PG)
- OIDC / SAML protocol handlers (shared by portal + admin)
- Next.js middleware helpers

**Environment variables**: see [api/web-portal.md](../api/web-portal.md)

---

## @agenticx/db-schema

**Responsibilities**

- Drizzle definitions for all PG tables
- `drizzle-kit` migrations
- `db:seed` default tenant and owner

**Docs**: [database/schema.md](../database/schema.md)

---

## @agenticx/iam-core

**Responsibilities**

- User / Dept / Role repository
- `scope-registry.ts` — see [rbac/scopes.md](../rbac/scopes.md)
- `provider-key-crypto.ts` — Provider API Key AES-GCM
- `runtime-legacy-migrate` — JSON → PG import logic
- Refresh token store

**CLI**: `pnpm migrate:legacy-runtime`

---

## @agenticx/core-api

**Responsibilities**

- Cross-app TypeScript types (`ChatMessage`, `Session`, `AuditEvent`, and so on)
- Unified error codes
- Session title helpers

The Gateway Go side has independent structs; keep them aligned manually when types change.

---

## @agenticx/policy-engine

**Dual language**

- **Go** (production): `packages/policy-engine/go/` — Trie, regex, PII detector; imported by `apps/gateway`
- **TS** (stub): admin policy tests may reuse some types

**Docs**: [gateway/policy-engine.md](../gateway/policy-engine.md)

---

## @agenticx/config

**Exports**

- `.` — config loading
- `./schemas` — Zod/YAML schema
- `./loaders` — file / env loaders
- `./react` — React context

Used for brand name, feature flags, and plugin paths.

---

## @agenticx/sdk-ts

**Purpose**: integrate external systems with Enterprise Gateway (OpenAI-compatible)

```ts
// Summary — see packages/sdk-ts/src/
import { createChatClient } from "@agenticx/sdk-ts";
```

**Status**: HTTP client is usable; advanced capabilities (stream reconnect, policy-error parsing) are still incomplete.

---

## Stub package roadmap

| Package | Plan |
|---|---|
| branding | Inject from `customers/*/config/branding` |
| telemetry | OpenTelemetry + optional Langfuse (ADR-0001) |
| sdk-py | Align with the AgenticX Python SDK |

---

## Dependency rules

```
apps → features → packages
apps → packages (direct)
gateway (Go) → policy-engine (Go only)
```

Features **must not** depend on each other in a cycle. Cross-feature collaboration is assembled in apps or via core-api types.

---

## Version and publish

The monorepo is currently `private: true`, version `@agenticx/enterprise@0.2.0`. Customer repos reference packages via `workspace:*`; npm publish is not required.

Made-with: Damon Li
