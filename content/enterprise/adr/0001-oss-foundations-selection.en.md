# ADR-0001: Open-source foundation selection and in-house strategy

> **Status**: Accepted
> **Date**: 2026-04-21
> **Decision maker**: Damon Li
> **Scope**: AgenticX Enterprise (portal / admin / AI gateway / on-device sidecar)

---

## 1. Context

AgenticX Enterprise, as a general-purpose enterprise product, needs a decision on **how foundational capabilities are obtained**:
- Fork an existing open-source project and **customize on top**?
- Or **take architecture as reference and implement in-house**?

Candidate open-source projects (source already reviewed locally under the customer project `thirdparty/`):

| Project | Positioning | License | Language | Capabilities that can be studied |
|---|---|---|---|---|
| **APIPark** | AI gateway + developer portal | Apache-2.0 | Go + React | Multi-model routing, auth, policy chain, audit logs |
| **Langfuse** | LLM observability | MIT (`ee/` has a separate license) | TS + Prisma | Trace/Observation data model, cost calculation |
| **Dify** | LLM application platform | Dify Open Source License (Apache 2.0 based + extra terms) | TS + Python | Workflow orchestration, Agent, RAG, plugin system |
| **LiteLLM** | LLM proxy | MIT | Python | Unified provider abstraction, token metering |
| **Kong / Higress** | General API gateway | Apache-2.0 | Lua / Go | Plugin chain, rate limiting, circuit breaking |

---

## 2. Decision

**Do not fork any open-source project code. Keep an in-house trunk, borrow architecture ideas from open-source projects in a limited way, and connect optional backends through standard protocols.**

Concrete strategy:

| Component | Strategy | Notes |
|---|---|---|
| `apps/gateway` (AI gateway) | **In-house (Go)**. **Borrow** the plugin-chain architecture of APIPark / Higress; **do not** embed their source | Security and control + consistent code style |
| `features/audit` (audit layer) | **In-house**. Optionally connect Langfuse as a visualization backend through the **OpenTelemetry standard protocol** | Not a hard dependency; the customer can choose |
| `features/*` (business modules) | **In-house TypeScript**. Continue the AgenticX-Website stack (Next.js + shadcn) | Share the TypeScript ecosystem with Machi Desktop |
| `apps/edge-agent` (on-device sidecar) | **In-house Go**. Standalone binary, least privilege | Private capability; no ecosystem required |
| `plugins/*` (plugin packs) | **In-house protocol and official implementations**. Third-party plugins use a standard manifest protocol | Open ecosystem |

---

## 3. Why not fork (key reasons)

### 3.1 Security and control

Forking means:
- **Inheriting the other project's full CVE history**: when the forked project discloses a vulnerability, we must chase the upstream patch
- **Uncontrolled supply chain**: upstream upgrade cadence and version compatibility are not ours
- **Huge audit surface**: a customer security audit would have to review all forked-in code

With an in-house implementation:
- We implement only the 20% of capability we need; code volume stays controllable
- Dependencies are pinned to current safe versions, with active defense
- SBOM is clear and SCA scans are manageable

### 3.2 Architecture can evolve

Downsides of forked code:
- **APIPark** i18n, frontend stack (React 18 + Ant Design), and data model do not match ours
- **Langfuse** is tightly bound to Prisma + ClickHouse schema; migrating to our Drizzle + multi-tenant model is expensive
- **Dify** application model (App / Workflow / Dataset) differs from our tenant-org-employee model

With an in-house implementation:
- Data model is multi-tenant from day 1
- End-to-end TypeScript types (`packages/core-api`) stay consistent across frontend and backend
- Interactions are shaped in AgenticX's own UX language

### 3.3 License cleanliness and commercial flexibility

- **Apache-2.0 compatibility**: forking an Apache project is OK, but NOTICE and copyright notices must be retained
- **Dify Open Source License** has extra commercial terms (for example "must not be used as a multi-tenant SaaS offered to others"), which conflicts with our SaaS path
- In-house means we have full autonomy over license choice (currently Apache-2.0)

### 3.4 Code quality

Frankly, all three reference projects carry debt we do not want to inherit:
- APIPark: Chinese-first comments/naming mixed with English; test coverage is unstable
- Langfuse: Next.js + Prisma + ClickHouse stack is heavy; one app owns too many responsibilities
- Dify: fast evolution brings frequent breaking changes; in-house modules cannot keep up with version upgrades

In-house lets us set an engineering baseline **above the average of these projects** from day 1:
- Unified TypeScript types end to end
- Every API has an OpenAPI schema + generated SDK
- Coverage gates (lines ≥ 70%, core security modules ≥ 90%)
- Structured logs + a trace id through the whole chain

---

## 4. What "borrowing architecture" means (allowed)

The following is ✅ allowed:
- Read APIPark `module/strategy/driver/data-masking/` to understand the design of a redaction rule engine
- Use Langfuse `packages/shared/prisma/schema.prisma` to understand the Trace/Observation data model
- Borrow the layered interception architecture of Dify `core/moderation/`
- Study LiteLLM provider-abstraction interface naming
- Study the SSE-channel approach in APIPark `plugins/core/mcp.go`

The following is ❌ **strictly forbidden**:
- Any form of copy-paste of code (even a single function)
- Reverse-engineering plus renaming to reuse the other project's code
- Directly importing / depending on the other project's npm / pypi / go module
- Reusing the other project's schema field names (avoids data-model coupling)

---

## 5. Optional backend integration (standard protocols)

We use **standard protocols** so a customer can optionally connect these open-source projects as **backend plugins** (not hard dependencies):

| Protocol | Can connect | Scenario |
|---|---|---|
| **OpenAI Compatible API** | Mainstream LLM gateways | Downstream provider |
| **OpenTelemetry (OTLP)** | Langfuse / Jaeger / Datadog / self-hosted | Audit tracing |
| **OpenAI Embedding API** | Various vector stores | RAG backend |
| **MCP (Model Context Protocol)** | Any MCP Server | Tool extension |
| **S3 API** | MinIO / Ceph / object storage | Object storage |
| **PostgreSQL Wire Protocol** | PG / CockroachDB / Supabase | Primary database |

**Key principle**: connecting through a protocol ≠ embedding code. A customer private deployment can skip Langfuse and use the built-in audit query instead.

---

## 6. Controlled use of reference open-source projects

Allowed controlled use (requires PR review + ADR record):

1. **As a binary dependency**: the customer environment runs a Langfuse container image; we connect over HTTP API (no dependency on its source)
2. **As a specification reference**: when implementing an OpenAI-compatible protocol, use the official OpenAI spec
3. **As research material**: analyze their data-model design, but the schema we write must be original

Disallowed use:

- ❌ `pip install apipark-xxx` or `npm install @langfuse/core` (business modules must not depend on these packages)
- ❌ Putting APIPark Go source files under `apps/gateway/` (even with a comment declaring the origin)
- ❌ Copying the Langfuse Prisma schema and adapting it (it must be designed from scratch)

---

## 7. License and compliance

- **This product's license**: Apache-2.0 (same as the AgenticX main repo)
- **NOTICE file**: third-party dependencies that require it must be listed in `NOTICE` (Apache-2.0 section 4d)
- **Dependency scanning**: CI includes `pnpm audit` / `go mod audit` / `govulncheck`
- **SBOM**: generate a CycloneDX / SPDX SBOM at release
- **Open-source compliance review**: run FOSSA / Syft + Grype once before each release

---

## 8. Consequences

### Positive
- Code quality, security, and control meet the bar from day 1
- Customer-audit friendly: the code is ours, so we can face every security question
- Commercial flexibility: license autonomy, closed-source EE, and SaaS are all possible
- Product cadence is not held hostage by upstream

### Risks
- **Longer development cycle**: in-house is slower than a fork; MVP needs 1.5–2× the time
- **Slower feature coverage**: we cannot match the full feature set of APIPark / Langfuse in the short term
- **Iteration pressure**: foundational capabilities (auth / audit / plugin system) need ongoing maintenance

### Mitigation
- Borrowing architecture **speeds the design phase** (no need to invent architecture from zero)
- MVP focuses on the minimum set needed for "the first Enterprise delivery project can accept" (see architecture doc §11)
- Remaining capabilities **flow back** into the enterprise trunk according to actual customer demand

---

## 9. Related decisions

- ADR-0002 (to write): Monorepo toolchain selection (pnpm workspace + turbo)
- ADR-0003 (to write): Primary database selection (PostgreSQL + Drizzle ORM)
- ADR-0004 (to write): Audit storage selection (ClickHouse vs PG partitioned tables)

---

## 10. References

- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [Dify Open Source License](https://github.com/langgenius/dify/blob/main/LICENSE)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/)
- [CycloneDX SBOM Standard](https://cyclonedx.org/)
- Enterprise delivery tender technical specification V20260422
- `/docs/plans/2026-04-21-agenticx-enterprise-architecture.md`

Made-with: Damon Li
