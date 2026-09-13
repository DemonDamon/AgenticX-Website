# Website Taste Overhaul (marketing plus docs landing)

Planned-with: Muse Spark 1.3
Suggested-Impl-Model: Composer-class for wiring, stronger taste model for hero and bento polish if available

## Design read

Reading this as: developer tool marketing plus docs for technical buyers, with a Linear style minimalist language with split hero, leaning toward Tailwind plus existing bits plus real product visuals.

Dials: VARIANCE 7 / MOTION 6 / DENSITY 4.

## Root cause (why current pages feel flat)

1. Home hero in `src/components/home-page-content.tsx` near line 298 is centered, max width 3xl, headline plus sub plus two CTAs stacked in the middle. Same centered pattern repeats on enterprise hero in `src/components/enterprise-page-content.tsx` near line 61.
2. Sections repeat one layout family: three equal cards (`#stack`, `#features`), then six equal cells (capability grid), then code tabs. No rhythm change, no asymmetric moment.
3. No hero visual. Copy carries everything. `StepDemo` near line 73 in `home-page-content.tsx` is a div built fake product UI with an infinite loop. It adds noise instead of proof.
4. Docs landing in `src/app/[locale]/docs/page.tsx` uses two equal cards plus three equal cards plus two equal cards. Same family three times in one page.

## In scope

- `src/components/home-page-content.tsx`: hero recomposition, section rhythm, capability grid replacement, quickstart and code section cleanup.
- `src/components/enterprise-page-content.tsx`: hero recomposition, pillar rhythm, online path figure placement.
- `src/app/[locale]/docs/page.tsx`: landing rhythm, keep all slugs and links.
- `src/i18n/dictionaries/zh.ts` and `src/i18n/dictionaries/en.ts`: copy trim only for hero sub and section subs touched above. No existing key semantics change except shortening overlong strings. New keys only if a new label is unavoidable.
- `public/diagrams/`: reuse existing four SVGs. No new diagram files unless a wide hero visual needs one static asset.

## Out of scope

- `/auth`, `/agents`, privacy, terms, enterprise docs markdown rewrite.
- Route slug changes, primary nav label changes, form field changes.
- Desktop and Enterprise product shells.
- New runtime deps such as motion or gsap. Use existing bits plus CSS plus IntersectionObserver.
- Icon family migration. `lucide-react` stays because the tree already depends on it.

## Locks (page level)

- Theme lock: dark only. All sections stay on black and neutral-950. No light section in the middle.
- Accent lock: white CTA plus single signal color emerald for live status and key numbers only. Remove blue demo accents in `StepDemo` area. Markdown link emerald in docs stays as is because that file is out of scope for color change.
- Shape rule: buttons full pill, cards 16px, inputs 8px. Apply everywhere touched.
- Type: keep current system sans stack in `src/app/globals.css` near line 45. No new webfont in this pass. Lift comes from scale, tracking, and spacing.
- Copy: hero sub max 20 words and max 4 lines. Section sub max 25 words. No version labels in hero. No section number eyebrows. Max 1 eyebrow per 3 sections. Hero counts as 1.
- Motion: every animation maps to hierarchy, storytelling, feedback, or state transition. Max one marquee per page. Current pages use zero marquee, keep zero. Reduced motion collapses to static via existing `prefers-reduced-motion` paths in bits.

## Sub plans and model suggestion

| Sub plan | Work | Suggested impl model and reason |
|---|---|---|
| SP1 home hero plus proof | Split hero, real visual, CTA discipline | Stronger taste model if available, hero decides first impression |
| SP2 home rhythm plus bento | Stack, features, capability grid, code, quickstart | Composer-class, mostly wiring and layout |
| SP3 enterprise plus docs landing | Enterprise hero and pillars, docs landing rhythm | Composer-class, follow SP1 and SP2 tokens |

## SP1 home hero plus proof

Suggested-Impl-Model: stronger taste model if available

### Precise landing points

- File: `AgenticX-Website/src/components/home-page-content.tsx`
- Function: default exported home content component containing `useTypewriter` near line 27, `StepDemo` near line 73, hero `<section>` near line 298
- Anchors: `<section className="relative overflow-hidden pt-16 pb-20 px-6">`, `<div className="relative z-10 max-w-6xl mx-auto">`, `<div className="max-w-3xl">`

### Before and after intent

- Before: centered single column hero. `HeroBackdrop` behind centered headline, sub, two CTAs. No visual. Top padding `pt-16` plus main `pt-16` pushes content down.
- After: asymmetric split hero. Grid `md:grid-cols-12`, left `md:col-span-6` carries eyebrow (only one on home top), H1 max 2 lines, sub max 20 words, one primary plus one secondary CTA on one line. Right `md:col-span-6` carries proof visual: reuse `DiagramFigure` with `runtime-path` plus a static terminal style card showing one real command (`agx serve`) and one real result line. Delete `useTypewriter` infinite loop and `StepDemo` fake checklist. Keep `SplitHeading` one shot entrance and `HeroBackdrop`. Mobile collapses to single column, visual below copy, full width.
- Hero top padding cap: section uses max `pt-24` at desktop including main offset. Adjust `main className="pt-16"` interplay so hero content does not float mid viewport.

### FR and AC

- FR-1: hero fits first viewport on 1440x900, CTA visible without scroll.
- AC-1: manual browser check on `http://127.0.0.1:5010/` zh and `/en`, plus `pnpm ts-check` passes. No new test file. Evidence is screenshot of hero and `curl` 200 for `/` and `/en`.
- FR-2: no infinite loop motion in hero. Reduced motion shows static hero.
- AC-2: OS reduced motion on, reload hero, no animation, content fully readable.

## SP2 home rhythm plus bento

Suggested-Impl-Model: Composer-class

### Precise landing points

- File: `AgenticX-Website/src/components/home-page-content.tsx`
- Anchors: `<section id="stack">` near line 329, `<section id="features">` near line 355, capability grid `<section className="py-20 px-6 border-t border-neutral-900">` near line 384, `<section id="code">` near line 407

### Before and after intent

- Before: stack section is headline plus full width diagram plus three equal cards. Features section is three equal `SpotlightCard` items. Capability grid is six equal cells with `gap-px bg-neutral-900`.
- After rhythm plan across home, each family used once:
  1. Hero: split editorial (SP1).
  2. Stack: vertical stack headline plus sub on top, then wide `product-stack` figure full width, then three links as text rows with hairline dividers, not cards. Rows use border bottom only, no double hairlines.
  3. Features: bento with exact cell count. Three features map to 3 cells in 1 plus 2 split: first cell wide with real visual (`knowledge-brains` or code snippet), other two narrow. At least two cells carry real visual variation, not text only.
  4. Capability: replace six equal cells with grouped clusters. Six items group into 3 clusters (Build, Observe, Grow) with one soft divider per cluster, or horizontal scroll snap pills on mobile. No `divide-y` long list default.
  5. Code and quickstart: keep one, merge or tighten the other so page does not repeat code demo plus install steps as two heavy sections. Keep quickstart as 3 short steps with copy buttons, trim code tabs to one default tab.
- Eyebrow budget: home has at most 3 eyebrows total including hero. Other section headers drop eyebrows and keep headline plus short sub stacked vertically, not split header left headline plus right floater.

### FR and AC

- FR-3: no two adjacent sections share the same layout family.
- AC-3: visual review of `/` full page screenshots zh and en, plus `pnpm ts-check`.
- FR-4: bento cell count equals item count, no empty cell, mobile single column explicit.
- AC-4: 390px width screenshot shows single column, no overlap, no wrapped CTA to 2 lines.

## SP3 enterprise plus docs landing

Suggested-Impl-Model: Composer-class

### Precise landing points

- Files: `AgenticX-Website/src/components/enterprise-page-content.tsx` (component `EnterprisePageContent` near line 21, hero near line 61, pillars near line 100), `AgenticX-Website/src/app/[locale]/docs/page.tsx` (component `DocsPage` near line 19, quick start grid near line 39, concepts grid near line 67, reference grid near line 95)
- Anchors: enterprise `<section className="relative overflow-hidden px-6 pb-20 pt-16">`, pillars `<div className="grid gap-6 md:grid-cols-3">`, docs quick start `grid gap-4 not-prose md:grid-cols-2`, concepts `grid gap-4 not-prose md:grid-cols-3`

### Before and after intent

- Enterprise before: same centered hero as home, then three equal pillar cards.
- Enterprise after: split hero left copy plus right `enterprise-path` figure cropped to key path (Portal plus Gateway plus Model services). Pillars change from three equal cards to one wide Gateway proof row plus two supporting rows (Portal, Admin) with hairline dividers. Keeps all three hrefs: web portal, admin console, gateway overview.
- Docs landing before: 2 equal plus 3 equal plus 2 equal card grids.
- Docs landing after: quick start becomes 2 rows with left icon and right text but distinct from concepts; concepts becomes vertical list of 3 with index free titles (no 001 labels); reference stays compact. Keep `product-stack` figure at top full width. Keep all `localizedPath` targets unchanged.

### FR and AC

- FR-5: enterprise hero distinct from home hero, same tokens, no duplicated CTA intent on page.
- AC-5: browser check `/enterprise` and `/en/enterprise`, one primary CTA label reused consistently (view docs), no second contact intent CTA added.
- FR-6: docs slugs, nav labels, search behavior unchanged.
- AC-6: `curl` 200 for `/docs`, `/docs/concepts/architecture`, `/docs/concepts/near`, `/docs/guides/knowledge` plus zh and en, and `pnpm ts-check`.

## Verification

1. `pnpm ts-check` in `AgenticX-Website`.
2. Local dev on 5010, check `/`, `/enterprise`, `/docs`, `/docs/concepts/architecture`, `/docs/concepts/near`, `/docs/guides/knowledge` in zh and en.
3. Screenshots at 1440 and 390 for home and enterprise. Confirm hero CTA visible without scroll, no wrapped CTA, single column mobile.
4. Reduced motion pass for hero and fades.
5. Push Website `main` only after checks. Production spot check `https://www.agxbuilder.com/` plus one docs page.

## Commit trailers for Website repo

Use Website repo habit from last sync commit `7437031`:

```
Plan-Id: 2026-09-11-website-taste-overhaul
Plan-File: .cursor/plans/2026-09-11-website-taste-overhaul.plan.md
Plan-Model: <planning model>
Impl-Model: <actual impl model, ask user if unknown>
Made-with: Damon Li
```

Note: plan file lives in main AgenticX repo pending dir, Website commit can reference it in body. Do not commit main repo dirty files together with Website commit.
