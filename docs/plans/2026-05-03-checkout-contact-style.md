# Checkout Contact Style Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Make the checkout page container and buyer form styling align with the existing contact page form while preserving checkout/payment behavior.

**Architecture:** Keep the checkout page composed with Astro components. Reuse the established visual language from `src/pages/contact.astro` by matching container width, form field spacing, input/textarea styles, focus states, card radius/padding, and submit button treatment in the checkout-specific CSS. Avoid changing API payload names, Duitku submission logic, or validation semantics.

**Tech Stack:** Astro 6, component-scoped/global Astro styles, existing CSS variables from `src/styles/core.css`, existing utility classes from `src/styles/ui-utilities.css`, Duitku checkout endpoint.

---

## Context

Relevant current files:

- Contact reference page: `src/pages/contact.astro`
- Checkout page and checkout CSS: `src/pages/checkout/[package].astro`
- Checkout buyer form markup: `src/components/checkout/CheckoutBuyerForm.astro`
- Global layout/styles: `src/layouts/Layout.astro`, `src/styles/core.css`, `src/styles/ui-utilities.css`

Important reference values from contact form:

```css
.contact-form-wrapper {
    padding: 2rem;
    border-radius: 1.5rem;
}

@media (min-width: 768px) {
    .contact-form-wrapper {
        padding: 2.5rem;
    }
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-field label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
}

.form-field input,
.form-field textarea {
    padding: 0.875rem 1rem;
    font-family: inherit;
    font-size: 0.9375rem;
    color: var(--color-text);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    outline: none;
    transition:
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
    color: var(--color-text-subtle);
}

.form-field input:focus,
.form-field textarea:focus {
    border-color: rgb(var(--color-primary));
    box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}

.form-field textarea {
    resize: vertical;
    min-height: 120px;
}
```

Important global container value:

```css
:root {
    --container-max: 1280px;
}

.container {
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 1.25rem;
}
```

---

### Task 1: Verify checkout route renders before styling changes

**TDD scenario:** Modifying existing UI — run existing build first.

**Files:**
- Read: `src/pages/checkout/[package].astro`
- Read: `src/components/checkout/CheckoutBuyerForm.astro`

**Step 1: Run build before implementation**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- Astro build completes.
- Existing warnings such as Node `DEP0040 punycode` may appear; do not treat that as this task failing unless build exits non-zero.

**Step 2: Inspect current checkout CSS**

Open `src/pages/checkout/[package].astro` and locate:

- `.checkout-shell`
- `.checkout-grid`
- `.checkout-summary, .checkout-form`
- `.checkout-field`
- `.checkout-form input, .checkout-form textarea`
- `.checkout-submit`
- `@media (min-width: 980px)` checkout grid rule

Expected finding:

```css
.checkout-shell {
    max-width: 1040px;
    gap: 1rem;
}
```

This is narrower than other pages using `var(--container-max)`.

**Step 3: Do not commit**

No code changed in this task.

---

### Task 2: Widen checkout container to match other pages

**TDD scenario:** Trivial visual CSS change — use judgment; verify with build.

**Files:**
- Modify: `src/pages/checkout/[package].astro`

**Step 1: Update checkout shell width**

In `src/pages/checkout/[package].astro`, replace:

```css
.checkout-shell {
    max-width: 1040px;
    gap: 1rem;
}
```

with:

```css
.checkout-shell {
    max-width: var(--container-max);
    gap: 1.5rem;
}
```

**Step 2: Increase checkout grid gap**

Replace:

```css
.checkout-grid {
    display: grid;
    gap: 1rem;
}
```

with:

```css
.checkout-grid {
    display: grid;
    gap: 1.5rem;
}
```

**Step 3: Give form more desktop space than summary**

Inside `@media (min-width: 980px)`, replace:

```css
.checkout-grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.95fr);
    align-items: start;
}
```

with:

```css
.checkout-grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(20rem, 0.75fr);
    align-items: start;
}
```

**Step 4: Run build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- Checkout route compiles.

**Step 5: Commit**

```bash
git add src/pages/checkout/[package].astro
git commit -m "fix: widen checkout layout"
```

---

### Task 3: Match checkout input and textarea style to contact form

**TDD scenario:** Trivial visual CSS change — use judgment; verify with build.

**Files:**
- Modify: `src/pages/checkout/[package].astro`
- Reference: `src/pages/contact.astro`

**Step 1: Update checkout field controls**

In `src/pages/checkout/[package].astro`, replace the `.checkout-form input, .checkout-form textarea` block with this contact-aligned version:

```css
.checkout-form input,
.checkout-form textarea {
    box-sizing: border-box;
    width: 100%;
    color: var(--color-text);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 0.875rem 1rem;
    font: inherit;
    font-size: 0.9375rem;
    line-height: 1.35;
    outline: none;
    transition:
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);
}
```

**Step 2: Preserve stable input height**

Add or keep:

```css
.checkout-form input {
    min-height: 3rem;
}
```

Do not force a fixed `height` unless visual testing shows fields collapse; contact page relies primarily on padding.

**Step 3: Match textarea behavior**

Replace the checkout textarea block with:

```css
.checkout-form textarea {
    min-height: 120px;
    resize: vertical;
}
```

If the checkout notes field should remain visually shorter than contact message, use `min-height: 96px` instead, but prefer `120px` for exact contact parity.

**Step 4: Match placeholder color**

Replace:

```css
.checkout-form input::placeholder,
.checkout-form textarea::placeholder {
    color: rgba(167, 159, 145, 0.68);
}
```

with:

```css
.checkout-form input::placeholder,
.checkout-form textarea::placeholder {
    color: var(--color-text-subtle);
}
```

**Step 5: Match focus state**

Replace the checkout focus block with:

```css
.checkout-form input:focus,
.checkout-form textarea:focus {
    border-color: rgb(var(--color-primary));
    box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}
```

Do not add extra glow or background changes beyond contact form unless explicitly requested.

**Step 6: Run build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- No Astro/CSS syntax errors.

**Step 7: Commit**

```bash
git add src/pages/checkout/[package].astro
git commit -m "fix: match checkout form fields to contact"
```

---

### Task 4: Match checkout form card feel to contact form without breaking checkout structure

**TDD scenario:** Trivial visual CSS change — use judgment; verify with build.

**Files:**
- Modify: `src/pages/checkout/[package].astro`
- Optional modify: `src/components/checkout/CheckoutBuyerForm.astro`
- Reference: `src/pages/contact.astro`

**Step 1: Update checkout form card padding/radius**

In `src/pages/checkout/[package].astro`, split `.checkout-summary` and `.checkout-form` if needed so checkout summary can stay compact while checkout form follows contact.

Keep shared card styling if it still looks good:

```css
.checkout-summary,
.checkout-form {
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    background: var(--color-surface);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
    padding: clamp(1rem, 2vw, 1.25rem);
}
```

Then add a more contact-like override for the form:

```css
.checkout-form {
    gap: 1.25rem;
    border-radius: 1.5rem;
    padding: 2rem;
}

@media (min-width: 768px) {
    .checkout-form {
        padding: 2.5rem;
    }
}
```

**Step 2: Keep optional section restrained**

Keep `.checkout-optional-fields` visible and readable, but avoid making it look like a separate heavy card. Recommended:

```css
.checkout-optional-fields {
    margin-top: 0;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border-light);
}
```

**Step 3: Consider hover logo overlay only if product direction wants exact parity**

Contact uses:

```astro
<div class="contact-form-wrapper hover-logo-overlay-target glass">
    <HoverLogoOverlay preset="informational" logoTop="calc(var(--hlo-logo-size) * -0.14)" logoSize="5.8rem" hoverOpacity={0.16} />
    <div class="hover-logo-overlay-content">
        ...
    </div>
</div>
```

Recommendation: do **not** add `HoverLogoOverlay` to checkout initially. Checkout is a task-focused payment page; decorative hover behavior can distract from conversion and may add layout risk. If exact parity is required, add it in a separate task after visual review.

**Step 4: Run build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.

**Step 5: Commit**

```bash
git add src/pages/checkout/[package].astro src/components/checkout/CheckoutBuyerForm.astro
git commit -m "fix: align checkout form card with contact"
```

If `CheckoutBuyerForm.astro` was not modified, omit it from `git add`.

---

### Task 5: Align checkout copy labels with broader business terminology

**TDD scenario:** Trivial content change — use judgment; verify with build.

**Files:**
- Modify: `src/components/checkout/CheckoutBuyerForm.astro`

**Step 1: Update company label**

Replace:

```astro
<span>Nama media / organisasi <strong>Wajib</strong></span>
<input name="organizationName" type="text" minlength="2" placeholder="Nama media Anda" required />
```

with:

```astro
<span>Nama perusahaan <strong>Wajib</strong></span>
<input name="organizationName" type="text" minlength="2" placeholder="Nama perusahaan Anda" required />
```

**Step 2: Update domain label**

Replace:

```astro
<span>Domain saat ini / domain pilihan <small>Opsional</small></span>
<input name="domain" type="text" placeholder="contoh: namamedia.id" />
```

with:

```astro
<span>Nama domain <small>Opsional</small></span>
<input name="domain" type="text" placeholder="contoh: namaperusahaan.id" />
```

**Step 3: Update notes label**

Replace:

```astro
<span>Catatan kebutuhan <small>Opsional</small></span>
```

with:

```astro
<span>Catatan <small>Opsional</small></span>
```

**Step 4: Run build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- Checkout buyer form compiles.

**Step 5: Commit**

```bash
git add src/components/checkout/CheckoutBuyerForm.astro
git commit -m "fix: update checkout form labels"
```

---

### Task 6: Manual visual verification

**TDD scenario:** Visual change — manual verification plus build.

**Files:**
- Verify in browser: `/contact`
- Verify in browser: `/checkout/<enabled-package>?period=monthly`
- Read if package route unknown: `src/data/servicePackages.*`

**Step 1: Identify enabled package slug**

Run:

```bash
rg "checkoutEnabled|id:" src/data -n
```

Expected:

- Find at least one package with `checkoutEnabled: true` and an `id` usable in `/checkout/[package]`.

**Step 2: Start dev server**

Run:

```bash
npm run dev
```

Expected:

- Astro dev server starts, usually on `http://localhost:4321`.

**Step 3: Compare contact and checkout pages**

Open:

```text
http://localhost:4321/contact
http://localhost:4321/checkout/<enabled-package-id>?period=monthly
```

Check:

- Checkout outer container width visually matches normal page width.
- Checkout form is not cramped on desktop.
- Form inputs match contact form padding, border radius, background, placeholder color, and focus ring.
- Checkout summary remains readable and does not become too narrow.
- Mobile layout remains single column and usable.
- Submit button remains clearly payment-oriented.
- Required fields still show browser validation.

**Step 4: Stop dev server**

Use `Ctrl+C`.

**Step 5: Final build verification**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.

**Step 6: Final commit if visual tweaks were needed**

```bash
git add src/pages/checkout/[package].astro src/components/checkout/CheckoutBuyerForm.astro
git commit -m "fix: polish checkout form layout"
```

Only commit files that changed.

---

## Acceptance Criteria

- Checkout page uses the same global container width as other pages via `var(--container-max)`.
- Checkout desktop grid gives more space to the buyer form than to the package summary.
- Checkout field styling matches contact form styling closely:
  - background `var(--color-bg-secondary)`
  - border `var(--color-border)`
  - radius `0.75rem`
  - padding `0.875rem 1rem`
  - placeholder `var(--color-text-subtle)`
  - focus ring `0 0 0 3px rgba(var(--color-primary), 0.1)`
- Checkout form keeps all current field names required by `/api/duitku/create-payment`.
- No changes to checkout submit JavaScript behavior unless explicitly required.
- `npm run build` exits `0` after changes.

---

## Notes for Implementer

- Avoid generic AI-slop UI: no extra glow stacks, no decorative cards inside cards, no vague copy.
- Prefer restrained SaaS UI and specific Indonesian labels.
- Do not change hidden inputs `packageId` or `period`.
- Do not rename form field names: `name`, `email`, `phoneNumber`, `organizationName`, `domain`, `notes`.
- Do not change payment endpoint `/api/duitku/create-payment`.
- If exact visual matching conflicts with checkout conversion clarity, prioritize checkout clarity and document the decision.
