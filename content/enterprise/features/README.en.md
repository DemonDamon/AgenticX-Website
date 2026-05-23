# Features — Business Domains

Directory: `enterprise/features/`  
NPM naming: `@agenticx/feature-<name>`

Features are the **primary reuse unit for customers** — customization should reference feature packages via workspace, not fork app code.

---

## Overview

> Legend: ✅ implemented · 🟡 partial · ⚪ stub · ⛔ skeleton

| Feature | NPM | Status | Main code |
|---|---|---|---|
| iam | `@agenticx/feature-iam` | ✅ | `services/`, `api/`, `components/` |
| chat | `@agenticx/feature-chat` | ✅ | `ChatWorkspace.tsx`, `store.ts`, `components/` |
| policy | `@agenticx/feature-policy` | ✅ | `services/pg-store.ts`, `snapshot/writer.ts` |
| audit | `@agenticx/feature-audit` | ✅ | `services/pg-store.ts`, `api/audit.ts` |
| metering | `@agenticx/feature-metering` | ✅ | `services/metering.ts`, `api/metering.ts` |
| model-service | `@agenticx/feature-model-service` | ⚪ | logic in `admin-console/lib/model-providers-store.ts` |
| knowledge-base | `@agenticx/feature-knowledge-base` | ⚪ | planned Machi KB stage-1 integration |
| tools-mcp | `@agenticx/feature-tools-mcp` | ⚪ | planned MCP marketplace |
| agents | `@agenticx/feature-agents` | ⚪ | planned avatars/agents |
| settings | `@agenticx/feature-settings` | ⚪ | portal has local `SettingsPanel.tsx` |

---

## iam

**Responsibility**: tenant users, department tree, roles, RBAC, CSV bulk import.

**Key modules**

- `services/user.ts`, `department.ts`, `role.ts`, `bulk-import.ts`
- `middleware/rbac.ts` — scope validation
- `components/DepartmentTree.tsx`

**Admin pages**: `/iam/*`

**Depends on**: `@agenticx/iam-core`, `@agenticx/db-schema`

---

## chat

**Responsibility**: employee chat workspace UI, Zustand store, Markdown rendering, session history client.

**Key modules**

- `ChatWorkspace.tsx` — main UI
- `store.ts` — message/streaming state
- `history-client.ts` — calls portal `/api/chat/sessions`
- `components/` — input area, message bubbles, model selector
- `markdown/` — syntax highlighting (light/dark themes)

**Depends on portal API**: completions proxy, sessions CRUD, me/models

---

## policy

**Responsibility**: policy rules PG storage, draft/publish workflow, snapshot writer for gateway.

**Admin pages**: `/policy/*`

---

## audit

**Responsibility**: gateway audit event query, chain verification UI, CSV export.

**Admin pages**: `/audit`

---

## metering

**Responsibility**: four-dimensional token usage query (dept/user/provider/model/time), export.

**Admin pages**: `/metering`

---

## Related docs

- [../apps/README.md](../apps/README.md)
- [../packages/README.md](../packages/README.md)
- [../architecture/overview.md](../architecture/overview.md)
