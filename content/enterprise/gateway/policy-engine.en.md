# Gateway Policy Engine

Implementation: `packages/policy-engine/go/` (embedded in Gateway)  
Admin: `@agenticx/feature-policy` + `/policy` UI  
Plugin manifest: [plugin-protocol/README.md](../plugin-protocol/README.md)

---

## Three-channel evaluation

| Channel | When | Description |
|---|---|---|
| Request | After user messages are received, before calling upstream | block returns immediately; no upstream consumption |
| Response | Non-streaming full response | Can block/warn/redact assistant content |
| Stream | SSE fragment scan | Streaming idle timeout + buffer cap to prevent hangs |

Source entry: policy call sites in `apps/gateway/internal/server/server.go`.

---

## Rule types (Go engine)

| kind | Description | payload / manifest fields |
|---|---|---|
| `keyword` | Keyword Trie | `keywords[]` |
| `regex` | Regular expression | `pattern` |
| `pii` | Built-in detector | `pii_type`: email, mobile, id-card, bank-card, api-key |

**Not supported** (difference from the Python framework): `keyword-list` as a standalone kind.

---

## Actions

| action | Behavior |
|---|---|
| `block` | Abort; Portal must show a compliance-block UI (not a model's natural-language refusal) |
| `warn` | Record hits, continue |
| `redact` | Replace sensitive spans, then continue |

Admin test API: `blocked` is true **only** when action=block.

---

## Rule source merge

```
1. plugins/moderation-*/manifest.yaml     (部署内置)
2. enterprise_runtime_policy_snapshots    (admin 发布)
3. GATEWAY_POLICY_OVERRIDE_FILE           (本地覆盖，调试)
```

Publish flow:

- Draft: `policy_rules.status = draft` — **not** included in the snapshot
- Publish: `POST /api/policy/publish` → snapshot JSON
- Rollback: `POST /api/policy/publishes/:id/rollback`

Runbook: [runbooks/policy-snapshot-rollback.md](../runbooks/policy-snapshot-rollback.md)

---

## applies_to scope

Rules / rule packs may include optional JSONB `applies_to`:

- `departmentIds` + `departmentRecursive`
- `roleCodes`
- `userIds` / `userExcludeIds`
- `clientTypes`, `stages`

**Pitfall**: putting placeholder examples in `userIds` (e.g. `u1,u2`) makes real JWT users miss the match, so the rule never applies. Leave org-wide rules empty.

---

## Audit hit structure

Gateway audit `policies_hit` JSONB includes:

- `matched_rule` — rule id/code
- `severity`, `action`
- Message summary

**Not** the old field names `rule_id` / `reason` (watch for this when inspecting historical data).

---

## Admin policy test

```
POST /api/policy/test
```

- Merges the **current form preview** (unsaved action/payload) with published rules in the DB
- Avoids “UI selected block but the old DB action is still used”

Chinese UI labels: 拦截/警告/脱敏; 关键词/正则/PII.

---

## Industry plugin packs

| Pack | extends | Scenario |
|---|---|---|
| moderation-pii-baseline | — | Generic PII |
| moderation-finance | pii-baseline | Finance |
| moderation-medical | pii-baseline | Medical PHI warn |

Customer-specific rules: PG policy center or `customers/*/rules/`; see the collaboration handbook.

---

## Stream hardening

| Environment variable | Purpose |
|---|---|
| `GATEWAY_STREAM_IDLE_TIMEOUT` | SSE idle cutoff |
| `GATEWAY_STREAM_SCANNER_MAX_BUFFER_MB` | Max buffer per chunk |

Prevents malicious/abnormal streaming responses from filling memory.

---

## Related docs

- [overview.md](./overview.md)
- [../plugin-protocol/README.md](../plugin-protocol/README.md)

Made-with: Damon Li
