# Portal Online Audit Remediation

## TL;DR

> **Summary**: Remediate sitewide audit failures by fixing the global metadata/canonical contract first, then aligning crawl/indexability and deployment headers, and finally repairing template/component-level performance and accessibility regressions on the highest-impact routes.
> **Deliverables**:
>
> - Deterministic metadata, canonical, and indexability behavior across global, archive, detail, author, tag, and utility pages
> - Deployment-accurate security/cache header strategy for Cloudflare-served pages and static assets
> - Image/performance/a11y cleanup for article, author, and shared marketing components with reproducible QA evidence
>   **Effort**: Large
>   **Parallel**: YES - 3 waves
>   **Critical Path**: 1 → 2 → 3/4 → 5/6/7/8 → 9

## Context

### Original Request

Analisa hasil audit dan buat rencana untuk perbaikan.

### Interview Summary

- No blocking product ambiguity remained after repository exploration; plan proceeds with repo-derived defaults.
- Default verification strategy: keep existing toolchain (`npm run lint`, `npm run build`) and agent-executed QA only; do **not** add a new test framework or CI in this remediation pass.
- Scope includes all audited public route families that exist in the repo: home, static pages, category archives, article detail, author routes, tag routes, `/sitemap/`, and utility pages under `/seo/` and `/text/`.
- Route structure and public URLs are preserved; remediation must not introduce new URLs or broad content rewrites.

### Metis Review (gaps addressed)

- Header and canonical truth must be fixed before route-by-route work.
- Deployment validation must check `https://portalonline.id/`, because `public/_headers` may not cover Worker-generated responses.
- Utility page noindex behavior for `/seo/google-submit/` and `/text/lorem-ipsum/` is preserved by default and must stay consistent with sitemap output.
- Scope is capped to technical remediation: metadata, crawlability, headers, image delivery, render-blocking, heading order, contrast, form/ARIA naming, and EEAT/byline structure. Editorial copy rewrites are out of scope.

## Work Objectives

### Core Objective

Resolve the audit’s highest-impact SEO, crawlability, security-header, performance, and accessibility failures without changing route structure, analytics behavior, or introducing new testing infrastructure.

### Deliverables

- Global canonical/metadata contract implemented in the shared layout stack
- Robots, XML sitemap, and human sitemap behavior aligned with actual indexability intent
- Cloudflare-compatible security/cache header implementation validated on deployed origin
- Article/detail, author, tag, contact, and shared component markup updated to follow existing repo best patterns for images, headings, and controls
- Evidence bundle for all critical route checks stored under `.sisyphus/evidence/`

### Definition of Done (verifiable conditions with commands)

- `npm run lint` exits `0`
- `npm run build` exits `0`
- Local preview of representative routes returns exactly one `<title>`, one `meta[name="description"]`, and one canonical link per page
- `curl -sI https://portalonline.id/` exposes the agreed security headers on deployed origin
- `curl -s https://portalonline.id/robots.txt` references the same sitemap location actually served by the site
- Representative homepage, archive, detail, author, tag, and utility routes satisfy heading/image/indexability checks defined in the task QA scenarios

### Must Have

- One absolute canonical URL per public page, built from production site origin
- Sitemap/robots/indexability rules that do not contradict each other
- Header strategy that distinguishes static `_headers` behavior from SSR/Worker responses
- Priority-based image optimization using existing good patterns already present in the repo (`astro:assets`, explicit dimensions, meaningful loading intent)
- Agent-executed QA evidence for every task

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)

- No route renames, new URL schemes, or redirect-policy overhauls beyond single-hop canonical normalization
- No full-site editorial rewrite or keyword-targeting rewrite of article bodies
- No new permanent test framework, e2e framework, or CI setup in this remediation pass
- No broad JS or styling rewrites unrelated to measured audit findings
- No analytics/Partytown removal unless a task explicitly proves it is necessary

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification is agent-executed.

- Test decision: tests-after with existing npm commands only (`npm run lint`, `npm run build`); no unit/e2e framework currently exists in the repo
- QA policy: every task includes agent-executed bash and/or browser scenarios against concrete URLs/selectors
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy

### Parallel Execution Waves

> Target: 5-8 tasks per wave. This plan uses smaller dependency-dense waves because metadata, crawl, and header fixes are high-coupling prerequisites for the remaining work.

Wave 1: T1 baseline matrix, T2 global metadata/canonical contract, T3 crawl/indexability alignment, T4 deployment header/cache alignment

Wave 2: T5 article/detail template remediation, T6 shared component image/perf cleanup, T7 author/tag/static route normalization, T8 accessibility/form/heading/contrast cleanup

Wave 3: T9 full regression sweep and evidence consolidation

### Dependency Matrix (full, all tasks)

- T1 blocks T2-T9
- T2 blocks T3, T5, T6, T7, T8, T9
- T3 blocks T9
- T4 blocks T9
- T5 blocks T9
- T6 blocks T9
- T7 blocks T9
- T8 blocks T9

### Agent Dispatch Summary (wave → task count → categories)

- Wave 1 → 4 tasks → implementation, security, review
- Wave 2 → 4 tasks → implementation, visual-engineering, security, testing
- Wave 3 → 1 task → testing

## TODOs

> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x]   1. Build Representative Route Matrix and Baseline Evidence

    **What to do**: Start from the actual route families in `src/pages/` and produce a reproducible route matrix that covers `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/sitemap/`, `/article/`, `/tips/`, `/tutorial/`, `/update/`, `/author/`, `/tags/`, `/seo/google-submit/`, `/text/lorem-ipsum/`, one generated article detail URL, one generated author detail URL, one generated tag detail URL, and one guaranteed-missing URL for 404 behavior. Build and preview the app locally, then capture baseline head-tag counts, canonical values, and origin-header evidence before any remediation starts.
    **Must NOT do**: Do not invent URLs that are not derived from the running app. Do not treat local preview headers as proof of Cloudflare production behavior.

    **Recommended Agent Profile**:
    - Category: `testing` — Reason: This task is evidence collection and route-matrix definition.
    - Skills: [`audit-website`] — Useful only if the same audit workflow can be replayed after the baseline is recorded.
    - Omitted: [`playwright`] — Browser automation is not required for the first-pass route inventory.

    **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2, 3, 4, 5, 6, 7, 8, 9] | Blocked By: []

    **References** (executor has NO interview context — be exhaustive):
    - Route families: `src/pages/`
    - Utility routes: `src/pages/seo/google-submit.astro`, `src/pages/text/lorem-ipsum.astro`
    - Category route generators: `src/pages/[category]/index.astro:10-22`, `src/pages/[category]/[...slug].astro:8-23`
    - Audit baseline: `report.html`
    - Existing header policy: `public/_headers`

    **Acceptance Criteria** (agent-executable only):
    - [x] `.sisyphus/evidence/task-1-baseline/routes.json` lists all representative URLs in scope, including one real detail/article URL, one real author URL, and one real tag URL extracted from the running preview.
    - [x] `.sisyphus/evidence/task-1-baseline/local-head-checks.json` records `<title>`, `meta[name="description"]`, and canonical counts/values for every route in the matrix.
    - [x] `.sisyphus/evidence/task-1-baseline/origin-headers.txt` records `curl -I` output for `https://portalonline.id/` and one deep production URL.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Baseline matrix and local head capture
      Tool: Bash
      Steps: Run `npm run build`; start preview on `127.0.0.1:4173`; derive the first article/author/tag detail URLs by scraping `/article/`, `/author/`, and `/tags/`; fetch every route in the matrix and write title/description/canonical counts to `.sisyphus/evidence/task-1-baseline/local-head-checks.json`.
      Expected: Every route in the matrix is reachable locally except the intentional 404 probe; evidence files are created with no missing route entries.
      Evidence: .sisyphus/evidence/task-1-baseline/local-head-checks.json

    Scenario: Missing-route and origin-header validation
      Tool: Bash
      Steps: Request `/__audit_missing__/`; capture response status and head tags; run `curl -sI https://portalonline.id/` and one deep production URL into `.sisyphus/evidence/task-1-baseline/origin-headers.txt`.
      Expected: The missing route resolves as a 404-class page; origin header evidence is captured separately from local preview evidence.
      Evidence: .sisyphus/evidence/task-1-baseline/origin-headers.txt
    ```

    **Commit**: NO | Message: `n/a` | Files: [`.sisyphus/evidence/task-1-baseline/*`]

- [ ]   2. Normalize Global Metadata and Canonical Contract

    **What to do**: Refactor the shared head contract so every public page emits exactly one absolute canonical, one title, and one meta description derived from `Astro.site` + `Astro.url.pathname`, not raw href strings. Preserve the current trailing-slash policy, strip query/hash from canonical output, reduce overstuffed fallback metadata, and ensure the same canonical source feeds `astro-seo`, open graph, twitter, and JSON-LD URLs.
    **Must NOT do**: Do not change public route paths. Do not move security-header responsibility into HTML meta tags. Do not introduce duplicate metadata between route files and the shared layout.

    **Recommended Agent Profile**:
    - Category: `implementation` — Reason: Shared layout logic and route-prop normalization are code-centric and high leverage.
    - Skills: []
    - Omitted: [`audit-website`] — Audit reruns are validation, not implementation.

    **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [3, 5, 6, 7, 8, 9] | Blocked By: [1]

    **References** (executor has NO interview context — be exhaustive):
    - Site origin and sitemap integration: `astro.config.mjs:14-48`
    - Current canonical logic and metadata defaults: `src/layouts/Layout.astro:49-70`
    - Shared SEO output: `src/layouts/Layout.astro:91-180`
    - Home route metadata handoff: `src/pages/index.astro:17-49`
    - Category archive metadata handoff: `src/pages/[category]/index.astro:31-77`
    - Detail route metadata handoff: `src/pages/[category]/[...slug].astro:29-39`
    - Detail layout currently passes `canonical={Astro.url.href}`: `src/layouts/DocLayout.astro:96-132`
    - Official guidance source: `https://docs.astro.build/`

    **Acceptance Criteria** (agent-executable only):
    - [ ] `npm run lint` passes after the metadata/canonical refactor.
    - [ ] On local preview, `/`, `/article/`, the first article detail page, `/author/`, the first author detail page, `/tags/`, `/contact/`, and `/sitemap/` each return exactly one `<title>`, one `meta[name="description"]`, and one canonical link.
    - [ ] All canonical links begin with `https://portalonline.id/`, preserve the existing trailing-slash policy, and omit query-string/hash noise even when the page is requested with `?utm=test`.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Representative head-tag verification
      Tool: Playwright
      Steps: Open `/`, `/article/`, `/contact/`, and `/sitemap/`; then click the first article card, first author link, and first tag link found in preview; on each page evaluate `document.head` for title/description/canonical counts and capture canonical href.
      Expected: Every checked page has exactly one title, one description, and one canonical; canonical hrefs are absolute production URLs.
      Evidence: .sisyphus/evidence/task-2-metadata/head-checks.json

    Scenario: Query-parameter canonical normalization
      Tool: Playwright
      Steps: Open `/article/?utm=test` and the first article detail URL with `?ref=audit`; inspect canonical href on both pages.
      Expected: Canonical href excludes query params and matches the clean production URL for the page.
      Evidence: .sisyphus/evidence/task-2-metadata/canonical-query-check.json
    ```

    **Commit**: YES | Message: `fix(seo): normalize global metadata and canonical rules` | Files: [`astro.config.mjs`, `src/layouts/Layout.astro`, `src/layouts/DocLayout.astro`, `src/pages/index.astro`, `src/pages/[category]/index.astro`, `src/pages/[category]/[...slug].astro`]

- [ ]   3. Align Robots, XML Sitemap, Human Sitemap, and Utility-Page Indexability

    **What to do**: Make robots, XML sitemap generation, the human `/sitemap/` page, and route-level indexability rules agree with each other. Keep utility pages `/seo/google-submit/` and `/text/lorem-ipsum/` out of search-focused public discovery by default unless the code already intentionally indexes them; ensure XML sitemap contains only intended public pages and uses the same production origin as canonical tags.
    **Must NOT do**: Do not leave `robots.txt`, generated sitemap files, and canonical/noindex rules contradicting each other. Do not list utility/noindex pages in the human sitemap unless the plan explicitly changes their indexability.

    **Recommended Agent Profile**:
    - Category: `implementation` — Reason: This is route-policy and output-generation work across config + page templates.
    - Skills: []
    - Omitted: [`playwright`] — Browser validation is needed only after generation logic is updated.

    **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [9] | Blocked By: [1, 2]

    **References** (executor has NO interview context — be exhaustive):
    - Sitemap generation rules: `astro.config.mjs:20-48`
    - Human sitemap page: `src/pages/sitemap.astro:6-53`
    - Current robots policy and sitemap pointer: `public/robots.txt`
    - Utility route existence: `src/pages/seo/google-submit.astro`, `src/pages/text/lorem-ipsum.astro`
    - Category and detail route generators: `src/pages/[category]/index.astro:10-22`, `src/pages/[category]/[...slug].astro:8-23`
    - Official guidance source: `https://docs.astro.build/`

    **Acceptance Criteria** (agent-executable only):
    - [ ] `npm run build` generates sitemap files whose URLs use `https://portalonline.id/` and exclude routes intentionally kept out of index.
    - [ ] `public/robots.txt` points to the actual XML sitemap location served by the build and does not accidentally disallow the intended sitemap endpoint.
    - [ ] Local preview of `/sitemap/` contains intended public routes and omits `/seo/google-submit/` and `/text/lorem-ipsum/` unless those routes were explicitly switched to indexable.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: XML sitemap and robots consistency
      Tool: Bash
      Steps: Run `npm run build`; inspect generated sitemap files under `dist/`; fetch `robots.txt` from preview or built output; verify sitemap URL, origin, and excluded utility routes.
      Expected: Robots points to the real XML sitemap, sitemap entries use `https://portalonline.id/`, and no utility/noindex route leaks into XML output.
      Evidence: .sisyphus/evidence/task-3-crawl/sitemap-robots-check.txt

    Scenario: Human sitemap exclusion check
      Tool: Playwright
      Steps: Open `/sitemap/`; search the rendered page for links to `/seo/google-submit/` and `/text/lorem-ipsum/`; verify the page still links to `/about/`, `/contact/`, and `/privacy/`.
      Expected: Human sitemap reflects the same discovery intent as the XML sitemap.
      Evidence: .sisyphus/evidence/task-3-crawl/human-sitemap-check.png
    ```

    **Commit**: YES | Message: `fix(crawl): align robots and sitemap behavior` | Files: [`astro.config.mjs`, `public/robots.txt`, `src/pages/sitemap.astro`, `src/pages/seo/google-submit.astro`, `src/pages/text/lorem-ipsum.astro`]

- [ ]   4. Implement Cloudflare-Accurate Security and Cache Header Strategy

    **What to do**: Move header policy to the correct delivery layer for this Astro + Cloudflare setup. Keep `_headers` for static output where it applies, but implement or adjust SSR/runtime response headers for Worker-served pages if needed. Replace the current HTML `http-equiv` CSP shortcut with a real CSP configuration or response-header strategy compatible with Partytown, inline JSON-LD, and any remaining inline scripts. Define intentional caching behavior for HTML responses versus hashed `/_astro/` assets.
    **[DECISION NEEDED: Use a branch preview or staging URL that is actually served through Cloudflare for final HTML-header verification; local `astro preview` is not sufficient proof for SSR/Worker responses.]**
    **Must NOT do**: Do not assume `public/_headers` covers Worker-rendered HTML. Do not ship a CSP that breaks JSON-LD, Partytown analytics, or essential page interactivity. Do not change analytics behavior unless the new CSP makes a concrete change unavoidable.

    **Recommended Agent Profile**:
    - Category: `security` — Reason: This task is primarily about header correctness, CSP safety, and deployment-layer behavior.
    - Skills: []
    - Omitted: [`audit-website`] — Audit rerun comes after the header implementation is stable.

    **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [9] | Blocked By: [1]

    **References** (executor has NO interview context — be exhaustive):
    - Cloudflare adapter and server output mode: `astro.config.mjs:14-18`, `astro.config.mjs:56-60`
    - Current HTML CSP meta tag: `src/layouts/Layout.astro:94-98`
    - JSON-LD and inline-script usage: `src/layouts/Layout.astro:172-180`, `src/layouts/Layout.astro:302-331`, `src/layouts/DocLayout.astro:714-746`
    - Existing static headers: `public/_headers`
    - Official guidance source: `https://docs.astro.build/`

    **Acceptance Criteria** (agent-executable only):
    - [ ] Source changes clearly separate static-asset headers from SSR/HTML response headers.
    - [ ] The shared layout no longer treats HTML `http-equiv` CSP as the primary production CSP mechanism.
    - [ ] Header evidence captured from a branch preview, staging URL, or production-like origin shows the agreed `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS, CSP, and cache behavior on HTML responses.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Source-level header policy verification
      Tool: Bash
      Steps: Run `npm run build`; inspect the changed header/config files and confirm `_headers` covers static behavior while runtime/SSR response code or Astro security config covers HTML/CSP behavior.
      Expected: Header responsibilities are explicitly split; CSP is no longer represented only by an HTML meta tag.
      Evidence: .sisyphus/evidence/task-4-headers/source-policy-check.txt

    Scenario: Origin header validation
      Tool: Bash
      Steps: Curl a preview/staging/deployed branch URL for `/` and one deep content page with `curl -sI`; save raw responses.
      Expected: Returned headers include the agreed security set and intentional cache policy for HTML pages.
      Evidence: .sisyphus/evidence/task-4-headers/origin-check.txt
    ```

    **Commit**: YES | Message: `fix(security): align cloudflare headers and cache policy` | Files: [`astro.config.mjs`, `public/_headers`, `src/layouts/Layout.astro`, `src/layouts/DocLayout.astro`]

- [ ]   5. Refactor Article Detail Rendering for Metadata, Media, and Interaction Safety

    **What to do**: Rework the article/detail experience so `DocLayout.astro` and the detail route follow the global metadata contract, emit consistent byline/schema signals, and stop using fragile raw-media / inline-event patterns. Replace the featured image and author-avatar delivery with the repo’s existing good image conventions where possible, preserve the WhatsApp CTA/copy-link/print behaviors, and keep the article page to one semantic H1 with stable subordinate heading levels.
    **Must NOT do**: Do not rewrite article body content. Do not remove the share/copy/print features. Do not degrade pages that lack optional `image` frontmatter.

    **Recommended Agent Profile**:
    - Category: `implementation` — Reason: This task is concentrated in the detail template and route handoff.
    - Skills: []
    - Omitted: [`audit-website`] — The work is template remediation, not audit rerun yet.

    **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [9] | Blocked By: [1, 2]

    **References** (executor has NO interview context — be exhaustive):
    - Detail route handoff: `src/pages/[category]/[...slug].astro:29-40`
    - Detail layout metadata and canonical handoff: `src/layouts/DocLayout.astro:96-132`
    - Breadcrumb and hero structure: `src/layouts/DocLayout.astro:140-247`
    - Featured image block: `src/layouts/DocLayout.astro:257-271`
    - Author widget and inline interactions: `src/layouts/DocLayout.astro:500-607`, `src/layouts/DocLayout.astro:714-746`
    - Content schema guarantees and optional image field: `src/content.config.ts:29-87`
    - Good in-repo image pattern: `src/components/Customers.astro:42-47`, `src/components/Hero.astro:150-157`

    **Acceptance Criteria** (agent-executable only):
    - [ ] `npm run build` succeeds after refactoring `DocLayout.astro` and the detail route.
    - [ ] The first generated article detail page has exactly one H1, valid canonical/meta output, and optimized image markup for the featured image and author avatar where those assets exist.
    - [ ] Copy-link, print, and WhatsApp CTA behavior still work after inline-event cleanup.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Detail page semantic and media verification
      Tool: Playwright
      Steps: Open `/article/`; click the first article card; inspect the resulting detail page for H1 count, canonical href, featured-image attributes (`width`/`height` and responsive markup), and author-avatar markup.
      Expected: The page has one H1, a clean canonical, and media markup that follows the selected optimization strategy.
      Evidence: .sisyphus/evidence/task-5-detail/detail-check.json

    Scenario: Interaction regression after inline cleanup
      Tool: Playwright
      Steps: On the same detail page, click the copy-link button, print button, and WhatsApp CTA; then revisit the same page with `?utm=test` to confirm canonical normalization is unchanged.
      Expected: The controls still respond without JS errors, and canonical output remains clean even on parameterized URLs.
      Evidence: .sisyphus/evidence/task-5-detail/interaction-check.json
    ```

    **Commit**: YES | Message: `fix(content): optimize article detail metadata and media` | Files: [`src/layouts/DocLayout.astro`, `src/pages/[category]/[...slug].astro`, `src/content.config.ts`]

- [ ]   6. Normalize Shared Component Images and Above-the-Fold Performance

    **What to do**: Bring shared homepage/static-page components onto the repo’s existing good media-delivery pattern. Audit Navbar, Footer, Comparison, Testimonials, CTA, ChatWidget, and any other shared marketing components still using raw `<img>` or non-essential above-the-fold eager behavior; migrate them to `astro:assets` or otherwise give them explicit dimensions, correct loading intent, and reduced render-blocking impact. Preserve the home hero’s intentional high-priority image behavior.
    **Must NOT do**: Do not blindly make every image lazy. Do not remove the hero’s `fetchpriority="high"` pattern. Do not change visual content or copy beyond what is needed for image/perf remediation.

    **Recommended Agent Profile**:
    - Category: `visual-engineering` — Reason: This task touches shared UI/media behavior and performance-sensitive rendering.
    - Skills: []
    - Omitted: [`audit-website`] — The work is component remediation, not external audit execution.

    **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [9] | Blocked By: [1, 2]

    **References** (executor has NO interview context — be exhaustive):
    - Good home-image reference: `src/components/Hero.astro:150-157`
    - Good smaller-image reference: `src/components/Customers.astro:42-47`
    - Navbar logo and controls: `src/components/Navbar.astro:30-37`, `src/components/Navbar.astro:114`, `src/components/Navbar.astro:207-211`
    - Footer logo/image: `src/components/Footer.astro:24-31`
    - Comparison image pattern: `src/components/Comparison.astro:103-108`
    - Testimonials media + control labels: `src/components/Testimonials.astro:61`, `src/components/Testimonials.astro:146`, `src/components/Testimonials.astro:164`, `src/components/Testimonials.astro:182`, `src/components/Testimonials.astro:204`
    - CTA/chat outbound interactions: `src/components/CTA.astro`, `src/components/ChatWidget.astro`, `src/components/Pricing.astro`

    **Acceptance Criteria** (agent-executable only):
    - [ ] Homepage and shared marketing components use intentional image loading (`eager` only for the truly above-the-fold asset; `lazy` below the fold) with explicit dimensions or generated responsive markup.
    - [ ] `npm run build` succeeds without introducing broken asset references.
    - [ ] Navbar and testimonial controls retain accessible labels and continue functioning after the media/perf cleanup.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Homepage image-loading verification
      Tool: Playwright
      Steps: Open `/`; inspect the hero image plus the first visible shared-component images in Navbar, Comparison, Testimonials, and Footer; record `loading`, `fetchpriority`, dimensions, and whether responsive markup is present.
      Expected: Only the true hero asset is high priority/eager; below-the-fold/shared assets are dimensioned and use the intended lower-priority strategy.
      Evidence: .sisyphus/evidence/task-6-shared/home-image-check.json

    Scenario: Shared-control regression check
      Tool: Playwright
      Steps: Open `/`; trigger the mobile menu toggle if present and the testimonial navigation controls; verify the controls remain keyboard-focusable and labeled.
      Expected: Shared controls still work and keep accessible names after the component cleanup.
      Evidence: .sisyphus/evidence/task-6-shared/control-check.png
    ```

    **Commit**: YES | Message: `fix(ui): optimize shared media and rendering` | Files: [`src/components/Navbar.astro`, `src/components/Footer.astro`, `src/components/Comparison.astro`, `src/components/Testimonials.astro`, `src/components/Hero.astro`, `src/components/CTA.astro`, `src/components/ChatWidget.astro`, `src/components/Pricing.astro`]

- [ ]   7. Normalize Author, Tag, and Static Route Metadata and Media

    **What to do**: Apply the global metadata/canonical contract and image/heading conventions to the route families outside the article/category core: author index/detail, tag index/detail, and the static public pages (`about`, `contact`, `privacy`, `terms`, `sitemap`). Ensure these routes have complete metadata, sane fallbacks, and no image/performance outliers relative to the main templates.
    **Must NOT do**: Do not change route slugs or introduce new content taxonomies. Do not make author/tag pages depend on article-only assumptions.

    **Recommended Agent Profile**:
    - Category: `implementation` — Reason: This task is route-template normalization across multiple page families.
    - Skills: []
    - Omitted: [`audit-website`] — Validation belongs to the regression sweep.

    **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [9] | Blocked By: [1, 2]

    **References** (executor has NO interview context — be exhaustive):
    - Route family inventory: `src/pages/author/`, `src/pages/tags/`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/sitemap.astro`
    - Author route existence: `src/pages/author/index.astro`, `src/pages/author/[author].astro`
    - Tag route existence: `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`
    - Contact metadata and markup: `src/pages/contact.astro:27-30`, `src/pages/contact.astro:167-274`
    - Human sitemap page metadata/layout: `src/pages/sitemap.astro:27-53`
    - Shared metadata contract: `src/layouts/Layout.astro:49-180`

    **Acceptance Criteria** (agent-executable only):
    - [ ] `/author/`, the first author detail page, `/tags/`, the first tag detail page, `/about/`, `/contact/`, `/privacy/`, `/terms/`, and `/sitemap/` each return exactly one title/description/canonical tuple on local preview.
    - [ ] Author/tag pages with avatars or other media follow the selected image strategy and no longer stand out as raw, undimensioned media outliers.
    - [ ] Unknown author/tag URLs resolve cleanly as non-indexable missing pages rather than masquerading as valid content routes.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Route-family metadata verification
      Tool: Playwright
      Steps: Open `/author/`, click the first author link; open `/tags/`, click the first tag link; then visit `/about/`, `/contact/`, `/privacy/`, `/terms/`, and `/sitemap/`; inspect title/description/canonical counts on each page.
      Expected: Every route family emits one complete metadata tuple and uses the shared canonical rules.
      Evidence: .sisyphus/evidence/task-7-routes/route-metadata-check.json

    Scenario: Unknown dynamic route handling
      Tool: Playwright
      Steps: Open `/author/__missing__/` and `/tags/__missing__/` in preview.
      Expected: Both URLs resolve as missing pages/404 behavior and do not expose a valid-content canonical.
      Evidence: .sisyphus/evidence/task-7-routes/missing-route-check.png
    ```

    **Commit**: YES | Message: `fix(routes): normalize author tag and static metadata` | Files: [`src/pages/author/index.astro`, `src/pages/author/[author].astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag].astro`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/sitemap.astro`]

- [ ]   8. Resolve Accessibility, Heading-Order, Contrast, and Form-Control Gaps

    **What to do**: Fix the audit issues tied to accessible naming, heading order, and contrast across the shared UI and form surfaces. Prioritize `Hero.astro`, `DocLayout.astro`, category archive pages, `Navbar.astro`, `Testimonials.astro`, and `contact.astro`; preserve the current WhatsApp form flow while ensuring labels, control names, keyboard focus visibility, and heading progression remain valid. Treat the `form-captcha` finding as non-actionable unless the site actually accepts server-side submissions; if it is non-actionable, document the rationale in evidence rather than adding a third-party CAPTCHA.
    **Must NOT do**: Do not perform a full-site design-token redesign. Do not add external CAPTCHA services unless the task proves a real form-processing requirement. Do not break keyboard navigation while chasing visual contrast fixes.

    **Recommended Agent Profile**:
    - Category: `visual-engineering` — Reason: This work crosses semantics, styling, and interaction states.
    - Skills: []
    - Omitted: [`audit-website`] — This task is local UI remediation first.

    **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [9] | Blocked By: [1, 2]

    **References** (executor has NO interview context — be exhaustive):
    - Contact form labels and WhatsApp flow: `src/pages/contact.astro:167-274`
    - Hero heading structure: `src/components/Hero.astro:86-94`
    - Category archive hero/content headings: `src/pages/[category]/index.astro:84-156`
    - Detail page heading structure and interactive widgets: `src/layouts/DocLayout.astro:140-326`, `src/layouts/DocLayout.astro:500-607`
    - Navbar controls and labels: `src/components/Navbar.astro:114`, `src/components/Navbar.astro:207-211`
    - Testimonial controls: `src/components/Testimonials.astro:164`, `src/components/Testimonials.astro:182`, `src/components/Testimonials.astro:204`
    - Global focus/contrast styles: `src/styles/global.css`

    **Acceptance Criteria** (agent-executable only):
    - [ ] Contact-form fields and shared interactive controls expose accessible names and remain keyboard-operable.
    - [ ] Representative routes (`/`, `/article/`, first article detail, `/contact/`) no longer skip heading levels within the page shell/content structure.
    - [ ] Contrast-sensitive UI states used for primary text, buttons, and interactive controls are updated consistently and evidenced with screenshots or computed-style checks.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Accessible-name and heading-order verification
      Tool: Playwright
      Steps: Open `/`, `/contact/`, `/article/`, and the first article detail page; inspect form labels, button names, and the sequence of rendered H1/H2/H3 elements.
      Expected: Form controls and shared buttons have accessible names; heading progression is intentional and no page exhibits an unexplained skipped-level structure.
      Evidence: .sisyphus/evidence/task-8-a11y/semantic-check.json

    Scenario: Keyboard and contrast regression check
      Tool: Playwright
      Steps: Use keyboard navigation on the navbar toggle, testimonial controls, contact form fields, and the copy-link button on a detail page; capture screenshots of focused and default states.
      Expected: Focus remains visible, controls are operable by keyboard, and updated contrast is visually evident in the captured screenshots.
      Evidence: .sisyphus/evidence/task-8-a11y/focus-contrast-check.png
    ```

    **Commit**: YES | Message: `fix(a11y): resolve headings contrast and control naming` | Files: [`src/pages/contact.astro`, `src/components/Hero.astro`, `src/components/Navbar.astro`, `src/components/Testimonials.astro`, `src/pages/[category]/index.astro`, `src/layouts/DocLayout.astro`, `src/styles/global.css`]

- [ ]   9. Run Full Regression Sweep and Consolidate Evidence

    **What to do**: Re-run the full verification sweep after tasks 2-8 land: npm lint/build, local route-matrix checks, browser QA on representative routes, origin-header verification, and—if the existing audit workflow is available in the execution environment—an HTML audit rerun using the same class of report as `report.html`. Consolidate all evidence in one directory and summarize any remaining non-fixed findings with explicit rationale.
    **Must NOT do**: Do not declare success from source diffs alone. Do not skip origin-header verification. Do not introduce new remediation work in this step unless a regression blocks the stated success criteria.

    **Recommended Agent Profile**:
    - Category: `testing` — Reason: This is the terminal verification and evidence-consolidation pass.
    - Skills: [`audit-website`] — Use if squirrelscan/the prior audit workflow is available so the before/after comparison stays comparable.
    - Omitted: []

    **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [] | Blocked By: [1, 2, 3, 4, 5, 6, 7, 8]

    **References** (executor has NO interview context — be exhaustive):
    - Baseline evidence contract: `.sisyphus/evidence/task-1-baseline/*`
    - Original audit artifact: `report.html`
    - Shared verification commands: `package.json` scripts `lint`, `build`, `preview`
    - All prior remediation files changed by tasks 2-8

    **Acceptance Criteria** (agent-executable only):
    - [ ] `npm run lint` and `npm run build` both pass on the final branch state.
    - [ ] `.sisyphus/evidence/task-9-regression/final-route-checks.json` proves metadata, canonical, heading, image, and utility-route indexability checks pass on the representative route matrix.
    - [ ] `.sisyphus/evidence/task-9-regression/origin-headers.txt` proves the agreed production-like headers are present on HTML responses.
    - [ ] If the same audit workflow is available, `.sisyphus/evidence/task-9-regression/audit-rerun.html` exists and the summary notes which originally flagged rule families materially improved.

    **QA Scenarios** (MANDATORY — task incomplete without these):

    ```
    Scenario: Final local regression sweep
      Tool: Bash
      Steps: Run `npm run lint`; run `npm run build`; start preview; repeat the route-matrix checks from Task 1 and save final structured results.
      Expected: Lint/build pass and the representative route matrix no longer shows the original metadata/canonical/indexability regressions.
      Evidence: .sisyphus/evidence/task-9-regression/final-route-checks.json

    Scenario: Final browser and origin verification
      Tool: Playwright
      Steps: Revisit `/`, `/contact/`, `/sitemap/`, the first article detail page, the first author detail page, and the first tag detail page; then capture origin headers from the preview/staging/deployed URL; if available, execute the same audit workflow class that generated `report.html` and archive the HTML report.
      Expected: Representative routes behave correctly in-browser, origin headers match the agreed policy, and an after-report exists when the audit workflow is available.
      Evidence: .sisyphus/evidence/task-9-regression/browser-and-origin-checks.json
    ```

    **Commit**: NO | Message: `n/a` | Files: [`.sisyphus/evidence/task-9-regression/*`]

## Final Verification Wave (4 parallel agents, ALL must APPROVE)

- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy

- Keep commits scoped by remediation surface so regressions are easy to isolate: metadata/crawl, headers/cache, templates/components, accessibility, final verification.
- Do not commit generated evidence files unless the execution workflow explicitly tracks them; prefer keeping `.sisyphus/evidence/` as execution artifacts.

## Success Criteria

- Audit-derived failures tied to metadata, canonical chains, sitemap/robots drift, X-Frame/CSP/cache behavior, image sizing/loading, heading order, contrast, and form/ARIA naming are either resolved or intentionally documented with repo-backed rationale.
- All representative route families in scope have reproducible evidence proving compliant head tags, indexability intent, image markup, and interactive accessibility behavior.
- The remediation remains within current architecture (Astro + Cloudflare adapter + Partytown) and can be executed without additional planning decisions.
