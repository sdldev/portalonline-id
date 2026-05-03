# Checkout Redesign Design

Date: 2026-05-03

## Goal

Redesign the Checkout, Payment Start, and Payment Return pages so the flow is simple, fast, and professional. The main priority is speed to payment: the Buyer should quickly confirm the selected Service Package, enter required contact details, and continue to Payment without feeling like they are reading another landing page.

The visual direction is modern SaaS with restrained brand accents. Avoid generic AI-looking decoration, excessive gradients, vague marketing copy, and stacked cards that do not help the Buyer complete Checkout.

## Scope

In scope:

- `/checkout/[package]`
- `/payment/start`
- `/payment/return`
- Checkout form copy and hierarchy
- Checkout package summary copy and hierarchy
- Error, loading, and helper copy

Out of scope:

- Changing Duitku integration architecture
- Adding a payment method picker
- Persisting Payment status
- Changing Service Package pricing or Billing Period rules
- Redesigning the Pricing section beyond any links needed to preserve Checkout entry

## Recommended approach: Focused SaaS Checkout

Use a focused checkout layout rather than a mini landing page.

Desktop layout:

- Left: primary Checkout form, wider than the sidebar.
- Right: compact sticky Service Package summary.
- Top: small back link and a clear `Duitku Sandbox` badge.

Mobile layout:

- One column.
- Show concise package summary first, then the form.
- Keep CTA visible after the form; do not add large trust/flow sections before payment.

The current separate `CheckoutFlowSteps` and `CheckoutTrustNotes` cards should be removed from the main Checkout page. Their useful information becomes short microcopy near the CTA and in the compact package summary.

## Checkout page structure

The page should communicate three things only:

1. What the Buyer is checking out.
2. Which details are needed to continue.
3. What happens when they press the payment CTA.

Suggested top copy:

- Title: `Checkout Paket Pro` or `Checkout Paket Starter`
- Subtitle: `Isi data kontak, lalu lanjutkan pembayaran aman via Duitku.`
- Badge: `Duitku Sandbox`

Avoid UI terms that feel internal, such as `Data Buyer`. Domain language can remain in code and documentation, but Buyer-facing copy should use natural Indonesian such as `Data kontak`, `Nama media`, and `Pembayaran`.

## Checkout form

The form remains the primary element on the page.

Required fields stay unchanged:

1. Nama lengkap
2. Email
3. Nomor WhatsApp
4. Nama media / organisasi

Optional fields stay visible, but visually lighter:

5. Domain saat ini / domain pilihan
6. Catatan kebutuhan

The current fieldset-heavy structure should become one compact card with a clear title, for example `Data kontak`. Use short labels above inputs, small `Wajib`/`Opsional` indicators, and only one helper text where useful: WhatsApp can say `Gunakan nomor aktif.`

CTA copy:

- Default: `Lanjutkan ke Pembayaran`
- Loading: `Memproses…`

Microcopy below CTA:

- `Pembayaran diproses melalui Duitku Sandbox. Status akhir diverifikasi oleh Duitku.`
- `Butuh bantuan? Hubungi WhatsApp.`

Error copy:

- Invalid form: `Periksa kembali data wajib sebelum lanjut.`
- Payment failed: `Pembayaran belum dapat dibuat. Coba lagi atau hubungi WhatsApp.`

Browser validation and server validation remain unchanged.

## Checkout summary

`CheckoutSummary` should become a compact sidebar, not a hero card.

Recommended content:

- Badge: `Duitku Sandbox`
- Service Package name
- Billing Period label
- Price
- Yearly benefit when applicable: `Hemat 2 bulan + domain .id/.com`
- Up to 4 key included features
- Small link: `Ganti paket`

The price should remain prominent, but not oversized. The summary confirms the selected Service Package; it does not need to resell every feature from the Pricing section. If the package contains many features, show only the first 3–4 or use smaller typography so the sidebar does not compete with the form.

Remove large glow effects and decorative backgrounds from the summary. Use a clean border, subtle background, and modest brand accent.

## Payment Start page

Use the same restrained card language as Checkout.

Recommended structure:

- Badge: `Duitku Sandbox`
- Title: `Lanjutkan pembayaran`
- Copy: `Kami sedang membuka halaman pembayaran. Jika tidak otomatis, tekan tombol di bawah.`
- CTA when reference/paymentUrl exists: `Lanjutkan ke Pembayaran`
- Fallback CTA: `Kembali ke Paket`

The page should feel like a transition state, not a landing page. Keep copy short and action-oriented.

## Payment Return page

The return page must stay neutral because Portal Online does not persist Payment status in the first implementation.

Recommended structure:

- Badge: `Pembayaran Duitku`
- Title: `Pembayaran sedang diproses`
- Copy: `Kami akan menghubungi Anda setelah status pembayaran terverifikasi.`
- Small note: `Halaman ini bukan konfirmasi final pembayaran.`
- Primary CTA: `Kembali ke Beranda`
- Secondary CTA: `Hubungi WhatsApp`

Do not claim payment success on this page. Final status follows Duitku callback verification.

## Data flow

No architecture change is required.

Existing flow remains:

1. Buyer opens `/checkout/[package]?period=[monthly|yearly]`.
2. Page resolves the Service Package and Billing Period from `src/data/servicePackages.ts`.
3. Buyer submits contact and media details to `/api/duitku/create-payment`.
4. Server validates input and creates a Duitku POP Payment.
5. Client redirects to `/payment/start` with the Duitku reference/payment URL.
6. Duitku handles Payment UI.
7. Return page uses neutral processing language.
8. Payment Callback verifies official Duitku status server-side.

## Error handling

Keep current behavior:

- Invalid package or disabled checkout redirects to Pricing.
- Invalid form redirects back with `error=invalid_form`.
- Payment creation failure redirects back with `error=payment_failed`.
- Client-side submit disables the button to avoid duplicate submissions.
- If fetch or JSON handling fails, redirect back to Checkout with payment error.

Only the visible copy and hierarchy should change.

## Testing and verification

Run:

```bash
npm run build
```

Manual verification:

- `/checkout/starter?period=monthly`
- `/checkout/pro?period=yearly`
- `/checkout/starter?period=monthly&error=invalid_form`
- `/checkout/pro?period=yearly&error=payment_failed`
- `/payment/start`
- `/payment/return`

Check:

- Mobile one-column order is clear.
- Desktop form/sidebar proportions feel balanced.
- `Duitku Sandbox` badge is visible but not loud.
- CTA says `Lanjutkan ke Pembayaran`.
- Required fields remain required.
- Optional fields remain visible but secondary.
- Return page does not claim final success.

## Implementation notes

Implemented in the first pass with the following files:

- `src/pages/checkout/[package].astro`
- `src/components/checkout/CheckoutBuyerForm.astro`
- `src/components/checkout/CheckoutSummary.astro`
- `src/pages/payment/start.astro`
- `src/pages/payment/return.astro`

The implementation keeps the Duitku payment architecture unchanged and only changes visible hierarchy, copy, and layout. The Checkout page no longer renders `CheckoutFlowSteps` or `CheckoutTrustNotes`; their essential reassurance copy is now reduced into CTA microcopy and the compact summary. The primary Checkout CTA is `Lanjutkan ke Pembayaran`, and the loading state is `Memproses…`.

Verification run after implementation:

```bash
npm run build
git diff --check
```
