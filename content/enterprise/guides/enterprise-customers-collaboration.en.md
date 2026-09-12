# Enterprise ↔ Customers collaboration handbook

> Audience: engineers who work on AgenticX Enterprise development + customer delivery
> Version: v0.1 (2026-04-21)

---

## 1. Core idea

```
enterprise/   is the "general product" — the fullest feature set
customers/*/  is a "customer instance" — reuse enterprise modules + a small amount of customization
```

**Iron rules**:
1. A customer repo **only writes** business customization (rules / config / UI overrides). It **does not change** `@agenticx/*` source.
2. When you find a general need → flow it back into `enterprise/`. Do not reimplement it in the customer repo.
3. Before every commit, ask: "Will the next customer also benefit from this change?" If yes, it goes into enterprise.

---

## 2. Repo layout at a glance

```
AgenticX/                       [public, open-source main repo]
├── enterprise/                 General product (released with AgenticX in the same repo)
│   ├── apps/
│   ├── features/               ⭐ Primary unit customers reuse
│   ├── packages/
│   ├── plugins/                Official industry-general plugins
│   └── docs/
└── customers/                  [gitignored]
    └── <client-name>/          [private, independent git repo]
        ├── apps/               Assembly shell
        ├── config/             ⭐ White-label config
        ├── rules/              Dedicated rule packs
        ├── plugins/            Customer-specific plugins
        └── overrides/          UI overrides (rare)
```

---

## 3. First-time environment setup

### 3.1 Clone both repositories

```bash
# 1) Open-source main repo (includes enterprise)
git clone git@github.com:your-org/AgenticX.git ~/myWork/AgenticX
cd ~/myWork/AgenticX

# 2) Customer private repo (nested under customers/<client-name>)
# customers/ is gitignored by the main repo, so the two do not interfere
git clone git@github.com:your-org/customer-<slug>.git customers/<client-name>
```

### 3.2 Install dependencies (from the enterprise root)

```bash
cd enterprise
pnpm install
```

Important: `enterprise/pnpm-workspace.yaml` includes `../customers/*/apps/*`,
so **running `pnpm install` from enterprise also brings customer apps into the workspace**,
and `workspace:*` cross-directory references resolve.

### 3.3 Start development

```bash
# General product (for demos)
pnpm --filter @agenticx/app-web-portal dev       # :3000
pnpm --filter @agenticx/app-admin-console dev    # :3001

# Target customer edition (actual delivery)
pnpm --filter @customer-<slug>/portal dev      # :3100
pnpm --filter @customer-<slug>/admin dev       # :3101
```

---

## 4. The four reuse mechanisms

### Mechanism 1: pnpm workspace dependency (code-level reuse)

**When**: the customer needs the full `@agenticx/feature-chat` capability and only assembles the outer shell.

`customers/<client-name>/apps/portal/package.json`:
```json
{
  "dependencies": {
    "@agenticx/feature-chat": "workspace:*",
    "@agenticx/feature-iam": "workspace:*"
  }
}
```

`customers/<client-name>/apps/portal/src/app/page.tsx`:
```tsx
import { ChatWorkspace } from "@agenticx/feature-chat";
import { brand } from "../../../config/brand";
import { rulePacks } from "../../../rules";

export default () => (
  <ChatWorkspace brand={brand} rulePacks={rulePacks} features={features} />
);
```

---

### Mechanism 2: config injection (zero-code customization)

**When**: brand, color system, copy, and feature flags differ per customer.

`customers/<client-name>/config/brand.yaml`:
```yaml
brand:
  name: "the customer project's AI platform"
  primary_color: "220 90% 50%"
  logo: ./assets/logo.svg
features:
  knowledge_base: true
  workflow: false
```

`@agenticx/config` loads this YAML at startup and distributes it to all components through Context / env.

---

### Mechanism 3: plugin override (rules / tools)

**When**: the customer needs a dedicated extension on top of an industry-general rule pack.

`customers/<client-name>/plugins/moderation-custom/manifest.yaml`:
```yaml
name: moderation-custom
type: rule-pack
extends:
  - "@agenticx/moderation-pii-baseline"
  - "@agenticx/moderation-finance"
rules:
  - id: custom-001
    name: Internal project codes
    type: keyword-list
    source: ../../rules/keywords/project-codes.txt
    action: block
```

At runtime `@agenticx/policy-engine` loads the enterprise industry pack first, then overlays customer rules.

---

### Mechanism 4: component slot override (deep UI customization)

**When**: the customer requires a piece of UI to differ from the general edition. ⚠️ Avoid this when you can; prefer mechanism 2.

enterprise leaves slots at key points:
```tsx
// enterprise/features/chat/src/ChatWorkspace.tsx
export function ChatWorkspace({ slots }: { slots?: { header?: ReactNode } }) {
  return (
    <div>
      {slots?.header ?? <DefaultHeader />}
      <ChatArea />
    </div>
  );
}
```

The customer passes a custom component:
```tsx
// customers/<client-name>/overrides/CustomerHeader.tsx
export const CustomerHeader = () => <header>Customer-specific top bar</header>;

// customers/<client-name>/apps/portal/src/app/page.tsx
<ChatWorkspace slots={{ header: <CustomerHeader /> }} />
```

---

## 5. Where a new requirement should live

```
New requirement → ask three questions
  ┌─────────────────────────────────────────┐
  │ 1. Would at least two industry customers │
  │    need this?                            │
  │    → ✅ into enterprise/features or      │
  │       packages                           │
  │                                          │
  │ 2. Can it be done with config/plugins?   │
  │    → ✅ into enterprise/features, make   │
  │       it configurable                    │
  │                                          │
  │ 3. Does it hard-code one customer's      │
  │    data/rules?                           │
  │    → ✅ stay in customers/<name>/        │
  └─────────────────────────────────────────┘
```

---

## 6. Flowing customer customization back into enterprise

When you implement a capability in a customer repo that is **clearly general**, flow it back as follows:

1. Open an issue on the enterprise side describing the scenario and general value
2. Abstract that part of the customer repo **after removing brand / rules / secrets**
3. Add an API so it is configurable (the original customer need should still be met through config)
4. Land it in `enterprise/features/...` or `enterprise/packages/...`
5. Delete the original implementation in the customer repo and reuse the new module
6. Write it into the enterprise CHANGELOG

---

## 7. FAQ

### Q1. The customer wants to change a function in `@agenticx/feature-chat`. What then?

**Do not change it directly.** Take one of these paths:

1. If it can be made configurable (for example "accept a customRenderer callback") → change enterprise to add a configuration point
2. If the UI really needs a deep change → use the slot mechanism
3. If the underlying logic really must change → that means the abstraction is wrong; extract an interface and let the customer implement and inject their own

### Q2. Two customers need conflicting behavior. What then?

Make the enterprise layer a **replaceable strategy**:
```ts
interface PolicyStrategy { check(input: string): Result; }
const strategy = config.policy.strategy === "strict" ? strictPolicy : softPolicy;
```

### Q3. There is an urgent customer bug that involves enterprise code. What then?

**Do not patch it in the customer repo.** Do this:

1. Emergency fix in enterprise (normal PR)
2. In the customer repo, `pnpm update @agenticx/feature-xxx`
3. Rebuild and redeploy
4. If there is truly no time, temporarily monkey-patch via `overrides/` in the customer repo, and open an enterprise fix PR immediately

### Q4. `pnpm install` reports "workspace:* not found"?

Check:
1. Did you run `pnpm install` from the **enterprise/ root**?
2. Does `enterprise/pnpm-workspace.yaml` include `../customers/*/apps/*`?
3. Does the customer repo `package.json` `name` start with `@customer-xxx/`?

---

## 8. Versioning

- `@agenticx/*` package versions follow enterprise main-repo tags
- Customer repos pin a specific version: `"@agenticx/feature-chat": "0.5.2"` (do not ship `workspace:*` to production)
- Breaking enterprise upgrades use **0.x.0**; small changes use **0.x.y**
- Before each customer delivery, run `pnpm install --lockfile-only` to pin versions and commit the lockfile to the customer repo

---

## 9. Forbidden list

| Forbidden | Why |
|---|---|
| ❌ Changing `node_modules/@agenticx/*` directly in a customer repo | The next install overwrites it |
| ❌ Committing customer rules / keys / logos into enterprise | The open-source repo would leak customer secrets |
| ❌ Hard-coding a customer brand string in enterprise | The next customer cannot reuse it |
| ❌ A customer-repo feature calling across enterprise module boundaries | Tight coupling; upgrades break the chain |
| ❌ Patching enterprise type definitions in a customer repo | Chaos; extract an interface and let the customer implement it |

---

## 10. Next steps

- Learn the `enterprise/features/chat/` API
- Read the rule-pack protocol in `enterprise/docs/plugin-protocol/`
- See the overall architecture in `docs/plans/2026-04-21-agenticx-enterprise-architecture.md`

Made-with: Damon Li
