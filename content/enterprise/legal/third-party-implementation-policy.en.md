# Enterprise Gateway third-party implementation and compliance notes (Third-Party Implementation Policy)

- **Document version**: v1.0
- **Effective date**: 2026-05-22
- **Maintainer**: Damon Li · `enterprise/apps/gateway` Owner
- **Scope**: AI-gateway-related submodules in `enterprise/apps/gateway`, `enterprise/packages/policy-engine`, `enterprise/apps/admin-console`, and `enterprise/apps/web-portal`
- **Nature**: **Internal engineering and self-imposed compliance notes**; this is not legal advice to any third party. Have counsel review before any external commitment.

> This document explains the implementation origin, reference boundary, license obligations, and external-wording rules for AgenticX Enterprise Gateway, so we "learn the capability, do not copy the code, and do not trip the license."

---

## 1. Project principles

Enterprise Gateway overlaps in product shape with several leading open-source AI gateways. To avoid legal and reputation risk, this project keeps these three principles:

1. **Clean-room implementation**: every subsystem — protocol adapters, Channel scheduling, cache, billing, audit, MCP hosting, and so on — uses **official public API specs / protocol docs / de-facto industry standards** as the only implementation source. Do not consult, copy, or port third-party implementation source.
2. **Independent architecture and data model**: the four moats — identity (JWT four principals / RS256 / RBAC scopes), audit (Blake2b hash chain + PG `gateway_audit_events` + JSONL fallback), policy (three-channel evaluation + PG rule center), metering (token + monthly quota; **do not** introduce an integer-currency Quota shape) — are designed independently and are incompatible with any comparison target's database schema.
3. **License-clean dependencies**: `go.mod` / `package.json` only take third-party dependencies compatible with this project's primary license. Do not introduce, package, or distribute any component affected by AGPL or similar copyleft that would create spillover obligations for how we ship.

---

## 2. Sources of truth

| Subsystem | **Only** implementation source | Do not consult |
|---|---|---|
| OpenAI-compatible inbound / outbound | [OpenAI Platform API Reference](https://platform.openai.com/docs/api-reference) | Source of any third-party OpenAI-compatible gateway |
| Claude Messages inbound / outbound | [Anthropic Messages API](https://docs.anthropic.com/en/api/messages), [Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) | Same as above |
| Google Gemini inbound / outbound | [Google AI API Reference](https://ai.google.dev/api/rest) | Same as above |
| OpenAI Responses inbound | [Responses API Reference](https://platform.openai.com/docs/api-reference/responses) | Same as above |
| MCP Server hosting / OpenAPI→MCP | [Model Context Protocol Specification](https://modelcontextprotocol.io), [OpenAPI 3.x Specification](https://spec.openapis.org/oas/v3.1.0) | Same as above |
| Wasm plugin ABI | [proxy-wasm ABI public spec](https://github.com/proxy-wasm/spec) (public version as of this document's date) | SDK source of any concrete implementation |
| Channel weighting / retry / reserve-and-settle | Standard algorithms (weighted random sampling, token bucket, reservation/settlement two-phase bookkeeping) | Any third-party gateway's concrete implementation |
| Semantic cache | Vector nearest-neighbor + canonical key (project-specific), reusing our existing KB vector backend | Any third-party gateway cache plugin |
| Audit hash chain | Blake2b (in-house from early in the project); record format defined by this repo's `audit/writer.go` | — |

> **Behavioral research material**: research notes under this repo's `docs/thrdparty/` and `.cursor/plans/` (for example chat-interface and completions-interface notes) are only for **describing behavior and boundaries** ("what the upstream did and what it returned"). They must not be used as text to port code from.

---

## 3. Discipline for research, reading, and implementation

To avoid accidentally seeing someone else's source during research and then unconsciously writing it into our implementation, the following discipline applies:

### 3.1 Separate "research" from "implementation"

- **Research reading** of a third-party repo README, docs, issues, or technical blog → **allowed**.
- **Reading third-party repo source** (including any concrete implementation under controller / relay / adaptor / web) → **must not be written into** this repo's plans, designs, issues, commits, PRs, comments, docs, test fixtures, or code.
- The **same developer in the same period must not** both "read third-party source" and "write the corresponding module in this repo". If a deep read is truly needed, **split the work**: A reads the public spec and writes requirements; B implements from the requirements.

### 3.2 Forbidden actions

When implementing any Enterprise Gateway module, these actions are explicitly forbidden:

- ❌ Directly or indirectly copying third-party source, comments, test fixtures, error-code strings, error copy, or UI copy.
- ❌ Renaming third-party files, reordering functions, or renaming variables and then taking them into this repo (a "reskin port").
- ❌ Introducing a third-party repo as a git submodule, go module, npm dependency, or Docker base image of this repo.
- ❌ Packaging a third-party repo binary (including a post-fork build artifact) into this repo's distribution (DMG / EXE / Docker / Helm).
- ❌ Copying third-party data files such as `manifest.yaml` / `model_pricing.json` verbatim. When building our own config tables, even if a naming convention looks the same (for example `gpt-5-high`), the **upstream official docs** remain the only source.
- ❌ Calling this project, in internal or external materials, a "third-party enterprise edition", a "domestic replacement" of another gateway, or a "second development based on" another project.

### 3.3 Allowed actions

- ✅ Read a comparison target's official README / homepage / docs site to understand its capability list and design orientation.
- ✅ In plans / docs, **name** a third-party project as a "research target / industry counterpart" and link its official repository.
- ✅ Implement features that are **architecturally similar but independently coded** (for example Channel weighting + failure retry is an industry-common pattern; an independent implementation is not copying).
- ✅ Cite public model-naming conventions, API fields, error codes, and protocol event streams from upstream model vendors (OpenAI / Anthropic / Google / Mistral and similar).

---

## 4. License and dependency governance

### 4.1 Primary and subdirectory licenses

| Path | Primary license | Notes |
|---|---|---|
| `AgenticX/` root (Python framework) | Apache-2.0 | See root `LICENSE` |
| `enterprise/` | Apache-2.0 (same as root unless a subdirectory says otherwise) | — |
| `enterprise/customers/<name>/` | Customer-private (not open source) | Customer-specific customization layer |

### 4.2 Dependency allowlist and denylist

**Allowlist (already used and compatible)**: Apache-2.0, MIT, BSD-2/3-Clause, ISC, MPL-2.0 (file-level copyleft only, controllable), Go standard library, CNCF projects (mostly Apache-2.0).

**Use with care (case-by-case)**: LGPL (dynamic linking is safer than static embedding), MPL (isolating the file is enough).

**Do not take into the gateway core process**:

- **AGPL-3.0** (for example some later versions of common open-source API-relay projects / some model-inference projects) — once used as a dependency or derivative work and offered as a network service, it may trigger an obligation to publish modified source, which conflicts directly with enterprise private-delivery mode.
- **SSPL / BUSL / Elastic License v2 / Commons Clause** and other **non-OSI** or **commercially addended** terms must not enter the main process or customer distributions.

### 4.3 Current `enterprise/apps/gateway/go.mod` status (baseline)

As of this document's date, the gateway module's direct dependencies are only:

- `github.com/go-chi/chi/v5` (MIT)
- `github.com/golang-jwt/jwt/v5` (MIT)
- `github.com/jackc/pgx/v5` / `github.com/lib/pq` (MIT)
- `golang.org/x/crypto` / `x/sync` / `x/sys` / `x/text` (BSD-3-Clause)
- `gopkg.in/yaml.v3` (MIT + Apache-2.0 dual license)
- `github.com/agenticx/enterprise/policy-engine` (in-repo replace)

**Not introduced**: AGPL or semantically neighboring third-party gateway codebases. This baseline is continuously checked by CI (see §6.2).

### 4.4 NOTICE and LICENSE retention

- Any **new** third-party component taken into the main process or a distribution must be declared in `enterprise/NOTICE`, and its original `LICENSE` text must be retained.
- External binaries (DMG / EXE / Docker / Helm chart) must be able to list third-party components on an About page or via a `--license` subcommand.

---

## 5. Submodule notes (aligned with the plans)

> The following clauses share a source of truth with the `.cursor/plans/2026-05-21-enterprise-gateway-*.plan.md` series and interlock with them.

### 5.1 Channel + Relay + Adaptor (landed)

- Landed under `enterprise/apps/gateway/internal/{channel,relay,adaptor,billing}/`;
- All implementations are based on the public OpenAI Chat Completions / Embeddings protocol docs;
- Streaming SSE parse, idle timeout, and buffer caps are in-house mechanisms and do not consult a third-party gateway's concrete implementation code.

### 5.2 Key pool + multi-dimension quota + PAT (in progress)

- PAT implementation: prefix `agx-pat-` + SHA-256 / Argon2id hash in the database, **incompatible with any third-party token-system database schema**;
- TPM/RPM/concurrency limits use a standard token bucket / sliding window;
- Quota table `quota_rules` is defined by this repo's PG migrations and does not reuse another project's `Token`/`Quota` table structure.

### 5.3 MCP Server hosting + OpenAPI→MCP (planned, Plan A)

- Only implementation sources: [MCP official spec](https://modelcontextprotocol.io) (2025-03-26 / 2025-06-18 versions) + OpenAPI 3.x;
- streamable-http / SSE dual transport is a native Go handler implementation and **does not cite** any Wasm-based MCP plugin source;
- Tool-call audit continues this repo's Blake2b chain.

### 5.4 Multi-protocol inbound + cross-format conversion (planned, Plan B)

- Inbound normalization for each protocol uses the official SDK (`@anthropic-ai/sdk`, `@google/genai`, `openai`) wire-format tests as the only precision reference;
- Reasoning Effort model-suffix derivation (for example `gpt-5-high`) is built from this repo's own config tables. Naming conventions come from upstream official docs; no third-party model_pricing data file is copied.

### 5.5 AI cache + billing + observability (planned, Plan C)

- L1 / L2 cache is an independent implementation in this repo's `cache/` package; semantic cache reuses the project's existing KB vector stack (Chroma / Qdrant and similar) with no new external dependency;
- The normalized usage table follows each upstream vendor's **official** API fields (for example OpenAI `prompt_tokens_details.cached_tokens`, Anthropic `cache_creation_input_tokens` / `cache_read_input_tokens`).

### 5.6 Wasm plugin runtime (planned, Plan D)

- Runtime choice is [wazero](https://wazero.io/) (Apache-2.0, pure Go, no CGO); keep its LICENSE and NOTICE;
- ABI subset is implemented in-house from the [proxy-wasm spec](https://github.com/proxy-wasm/spec); do not copy any wasm-go SDK implementation source;
- Built-in sample plugins (keyword-rewrite / bearer-extractor / audit-tagger / waf-basic) are original code in this repo.

---

## 6. Verification and enforcement

### 6.1 PR checklist

For every PR that touches `enterprise/apps/gateway/` and related modules, the author must self-check in the PR description (the template will land during engineering work):

- [ ] This PR does not introduce AGPL / SSPL / BUSL or other restrictive-license dependencies
- [ ] This PR does not copy or port source, comments, or test fixtures from any third-party repo
- [ ] Protocol adapters and algorithm implementations in this PR only consulted the "implementation source" column in the §2 table
- [ ] If a third-party dependency was added, `enterprise/NOTICE` and the allowlist assessment were updated

### 6.2 CI automatic checks

Maintain these hard gates in `enterprise` CI (any failure blocks merge):

1. **Path and string scan**: forbid any of the following tokens under `enterprise/apps/gateway/**` or `enterprise/packages/policy-engine/**` (except explicit research-note contexts such as `docs/` and `.cursor/plans/`):
   - `QuantumNous`, `new-api`, `newapi.pro`
   - `songquanpeng`, `one-api`
   - `higress-group`, `higress.cn`
   - `calciumion`
2. **go.mod dependency allowlist**: forbid §4.2 denylist entries in `enterprise/apps/gateway/go.mod`.
3. **NOTICE completeness**: if `go.mod` or `package.json` adds a third-party direct dependency, CI checks that `enterprise/NOTICE` was updated in the same change.
4. **License SBOM**: generate an SBOM before each release (for example with `syft` / `go-licenses`) and archive it at `enterprise/docs/legal/sbom/<version>.json`.

### 6.3 Exception handling

- Accidental third-party code → withdraw it in that PR immediately (not only revert; keep a "withdrawn" mark in git history, and use `git filter-repo` if needed);
- Accidental AGPL library → prefer replacing it with a compatible-license dependency; if there is no substitute, escalate to out-of-process communication with no dynamic linking in the main process, and confirm with counsel.

---

## 7. External wording rules (Sales / Marketing / Docs)

### 7.1 Recommended wording

- "AgenticX Enterprise Gateway — an enterprise AI gateway for B2B private deployment"
- "Compatible with mainstream public model APIs such as OpenAI / Anthropic / Google Gemini; supports multi-protocol inbound and cross-format conversion"
- "Native MCP Server hosting, forming an end-cloud loop with Machi Desktop"
- "Implemented in-house from public protocol specifications such as OpenAI / Anthropic / Google / MCP"
- "Covers capability dimensions commonly seen among open-source gateways, with a fully independent implementation"

### 7.2 Forbidden wording

- ❌ "Based on / forked from / modified from a third-party gateway"
- ❌ "Third-party enterprise edition / domestic replacement / enhanced edition of another gateway"
- ❌ "Reuses another project's protocol-adapter code / Wasm implementation"
- ❌ Any wording that would make a customer, journalist, or partner think this project is a "shell / reskin / repackaged relay" of a third-party project

### 7.3 Suggested customer-contract clauses

- Commitments about "open-source dependencies" in a customer contract may cite §4.2 and §4.3 of this document;
- If a customer additionally requires a written "no AGPL dependency" commitment, this document plus the current SBOM support it together;
- Second-development licenses for customer-specific code (`enterprise/customers/<name>/`) are agreed in the customer contract separately and are out of scope here.

---

## 8. Document lifecycle

- **Revision owner**: Damon Li (Gateway Owner).
- **Revision triggers**: a new main-process dependency, a new sub-plan, a third-party repo changing its license, or a customer contract imposing new requirements on the dependency structure.
- **Change record**: each revision adds a changelog entry in §9 and is marked in the corresponding commit with a `docs(legal): ...` prefix.
- **Audience to sync**: Sales / pre-sales / counsel (if any) should read major revisions.

---

## 9. Changelog

| Date | Change | Notes |
|---|---|---|
| 2026-05-22 | v1.0 first draft | Companion to the four sub-plans in the `2026-05-21-enterprise-gateway-roadmap.plan.md` series; §6.2 CI gates are still to be engineered |

---

## 10. Legal disclaimer

This document is an AgenticX internal engineering and self-imposed compliance note. **It is not legal advice.** Judgments here about license obligations and copyright risk are only for internal project discipline. Any external commitment, customer-contract clause, or potential dispute handling must be finalized after review by a licensed legal advisor.

---

**Made-with: Damon Li**
