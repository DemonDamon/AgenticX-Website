# Plugin Protocol

Enterprise plugins are described by a YAML **manifest**. Gateway and the admin policy center both consume it. Source directory: `enterprise/plugins/`.

---

## Manifest types

| type | Purpose | Status |
|---|---|---|
| `rule-pack` | Compliance / sensitive-term / PII rules | **Implemented** (3 moderation packs) |
| `tool-pack` | Tool-capability extension template | Stub (watermark/doc-review) |
| `theme-pack` | White-label theme | Stub (theme-default) |

---

## rule-pack spec

### Top-level fields

```yaml
name: moderation-pii-baseline    # Unique id; extends refers to this name
version: 0.1.0
type: rule-pack
description: Human-readable description
extends: moderation-pii-baseline  # Optional; inherit another rule-pack (Go loader: single string)
rules:
  - id: pii-email
    kind: pii | keyword | regex
    action: block | warn | redact
    severity: critical | high | medium | low
    message: Copy shown to the user / audit on a hit
    # Kind-specific fields below
```

### kind: pii

```yaml
kind: pii
pii_type: email | mobile | id-card | bank-card | api-key
```

The Go policy-engine ships built-in detectors; `redact` replaces with a placeholder, `block` aborts the request.

### kind: keyword

```yaml
kind: keyword
keywords:
  - keyword-1
  - keyword-2
```

### kind: regex

```yaml
kind: regex
pattern: "(?i)regular-expression"
```

---

## Action semantics

| action | Gateway behavior | UI blocked flag |
|---|---|---|
| `block` | Abort and return a business error | true |
| `warn` | Allow; record hits | false |
| `redact` | Replace the sensitive span and continue | false |

Admin policy test `POST /api/policy/test`: `blocked` is true **only** when action=block.

---

## extends inheritance

Example: `moderation-finance/manifest.yaml`

```yaml
extends: moderation-pii-baseline
rules:
  - id: finance-keyword-insider
    kind: keyword
    ...
```

**Limits (Go loader)**:

- `extends` is a **single string**; an array fails deserialization or keeps only the first item
- The inheritance chain merges rules at load time; a child pack may override the same id (as implemented)

---

## Official rule-packs

| Directory | extends | Description |
|---|---|---|
| `moderation-pii-baseline` | — | Email / mobile / national ID / bank card / API Key |
| `moderation-finance` | pii-baseline | Finance keywords + regex warn |
| `moderation-medical` | pii-baseline | Medical PHI keyword warn |

Gateway default scan: `../../plugins/moderation-*/manifest.yaml` (see `apps/gateway/internal/config/config.go`).

---

## PG policy vs manifest

1. **Plugins** — built-in baseline, shipped with Gateway
2. **Admin policy center** — tenant-custom rules written to `policy_rules`, published into `enterprise_runtime_policy_snapshots`
3. **Gateway** — merges the snapshot + override file and hot-reloads

Customer-specific rules should live in the **PG policy center** or `customers/*/rules/`, not in `@agenticx/*` source.

---

## tool-pack / theme-pack (reserved)

```yaml
name: tool-watermark
version: 0.1.0
type: tool-pack
description: PDF watermark tool template
# Current manifest is an empty-shell TODO
```

Implementation roadmap: connect to the Machi tool registry / enterprise tool marketplace. Schema docs will be filled in after the protocol stabilizes.

---

## Customer-defined plugins

1. Define a rule-pack at `customers/<client>/plugins/<name>/manifest.yaml`
2. At deploy time, add the manifest path to Gateway config or import it as an admin policy pack
3. Follow [guides/enterprise-customers-collaboration.md](../guides/enterprise-customers-collaboration.md): **do not** change the enterprise trunk

---

## Related docs

- [gateway/policy-engine.md](../gateway/policy-engine.md) — three-channel evaluation
- [runbooks/policy-snapshot-rollback.md](../runbooks/policy-snapshot-rollback.md)
- Admin UI: Policy rule center `/policy`

Made-with: Damon Li
