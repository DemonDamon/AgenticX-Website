# Enterprise Data Flow

> Last updated: 2026-05-21

This document describes data flow for a complete chat request and related subsystems.

---

## 1. Chat completions main path

```mermaid
sequenceDiagram
    autonumber
    participant U as User browser
    participant P as web-portal API
    participant G as apps/gateway
    participant Pol as policy-engine
    participant Up as Upstream LLM
    participant DB as PostgreSQL

    U->>P: POST /api/chat/completions<br/>(JWT cookie + model + messages)
    P->>P: Validate session<br/>Build OpenAI body
    P->>G: Forward to GATEWAY_COMPLETIONS_URL
    G->>G: Parse JWT → tenant/dept/user/session
    G->>DB: quota.Tracker check
    G->>Pol: Request-phase evaluation (keyword/regex/pii)
    alt action=block
        Pol-->>G: Hit
        G-->>P: Business error (not model refusal)
        P-->>U: Compliance block UI
    else allow/redact
        G->>Up: Call OpenAI-compatible upstream
        Up-->>G: response / SSE stream
        G->>Pol: Response/stream second-pass evaluation
        G->>DB: audit (JSONL + gateway_audit_events)
        G->>DB: metering (usage_records)
        G-->>P: completions / SSE
        P-->>U: Render
    end
```

### Portal session persistence

Chat history **is not persisted by Gateway**; portal API writes to PG:

- `POST /api/chat/sessions` → `chat_sessions`
- `POST /api/chat/sessions/:id/messages` → `chat_messages`

Gateway handles inference, policy, audit, and metering only.

---

## 2. Model visibility

```mermaid
flowchart LR
    admin["admin-console<br/>/admin/models"] -->|CRUD| providers[("enterprise_runtime_<br/>model_providers")]
    admin -->|visible model assignment| visible[("enterprise_runtime_<br/>user_visible_models")]
    portal["web-portal<br/>GET /api/me/models"] -->|filter by JWT| visible
    portal --> ui["ChatWorkspace<br/>model dropdown"]
    gateway["apps/gateway"] -. /api/internal/providers .-> providers
```

Portal controls **which model IDs users see**; gateway controls **which upstreams are callable** via internal API or PG provider config.

---

## 3. Policy publish flow

```mermaid
flowchart LR
    draft["policy_rules<br/>status=draft"] -->|POST /api/policy/publish| publish[/Publish/]
    publish --> events[("policy_publish_events")]
    publish --> snap[("enterprise_runtime_<br/>policy_snapshots")]
    snap -->|remote URL or local file| gateway["apps/gateway<br/>policy-engine hot reload"]
```

**Note**: `blocked=true` only when action is **block**; warn/redact may have hits without blocking.

Test endpoint: `POST /api/policy/test` merges form preview with DB rules.

---

## 4. Audit dual-write

```mermaid
flowchart LR
    llmCall["Each Gateway LLM call"] -->|must succeed| jsonl[("JSONL<br/>apps/gateway/<br/>.runtime/audit/")]
    llmCall -->|best-effort| pg[("gateway_audit_events")]
    pg -.->|failure| pending[(".pg-pending")]
    boot["Process start"] -->|backfill GATEWAY_AUDIT_BACKFILL_DAYS=7| pending
    pending --> pg
```

Admin `/audit` queries PG `PgAuditStore` with scope-based visibility:

- `audit:read:all` — full tenant
- `audit:read:dept` — own department

IAM admin audit lives in a **separate table** `audit_events`.

---

## 5. Token metering

```mermaid
flowchart LR
    bill["Gateway billing settlement"] --> usage[("usage_records<br/>tenant/dept/user/<br/>provider/model/time_bucket")]
    usage --> admin["admin-console /metering<br/>query + export"]
    bill -. SSE/usage .-> chip["portal header<br/>token chip"]
```

Quotas: `enterprise_runtime_token_quotas` → gateway `quota.Tracker`. Currently **tenant-level**; dept/user TPM requires separate planning.

---

## 6. Channel relay (optional)

When `GATEWAY_CHANNEL_REGISTRY=on`:

```mermaid
flowchart LR
    admin["admin CRUD<br/>gateway_channels"] -->|/api/internal/channels<br/>~5s poll| reg["channel.Registry"]
    reg --> picker["Picker<br/>weight/priority/affinity"]
    picker --> relay["relay.Executor<br/>retry on failure"]
    relay --> adaptor["adaptor factory"] --> upstream(["upstream"])
```

See [runbooks/gateway-channel-relay.md](../runbooks/gateway-channel-relay.md).

---

## 7. SSO login flow (OIDC example)

```mermaid
sequenceDiagram
    participant U as User
    participant P as portal /auth
    participant IdP as Enterprise IdP
    participant DB as PostgreSQL

    U->>P: Click SSO button
    P->>U: 302 → GET /api/auth/sso/oidc/start
    U->>IdP: authorize
    IdP-->>U: callback → /api/auth/sso/oidc/callback?code=...
    U->>P: callback
    P->>IdP: token endpoint exchange
    P->>DB: JIT user upsert + auth_refresh_sessions
    P-->>U: Set-Cookie + redirect /workspace
```

Admin mirrors routes on `:3001`; provider CRUD at `/settings/sso` + `/api/admin/sso/providers/*`.

---

## 8. Legacy JSON migration flow

```
.runtime/admin/*.json  (historical local files)
  ▼
migrate-runtime-legacy.ts  (bootstrap / start-dev auto trigger)
  ▼
enterprise_runtime_* tables
  ▼
admin / portal / gateway read PG only
```
