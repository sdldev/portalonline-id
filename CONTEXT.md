# Portal Online

Portal Online sells managed CMS packages for Indonesian online media sites.

## Language

**Checkout**:
A buyer-facing flow where a prospective customer selects a service package and enters purchase details before payment.
_Avoid_: order form, registration form

**Payment**:
A Duitku-hosted transaction attempt for a selected package during checkout.
_Avoid_: checkout, invoice

**Payment Callback**:
A server-to-server notification from Duitku that reports the result of a Payment.
_Avoid_: return page, webhook when speaking to non-technical stakeholders

**Service Package**:
A purchasable CMS Portal Online plan such as Starter or Pro.
_Avoid_: product, plan when referring to a paid offering

**Billing Period**:
The duration a Buyer pays for when purchasing a Service Package, either monthly or yearly.
_Avoid_: subscription type, payment type

**Buyer**:
A prospective customer who enters contact and organization details during Checkout.
_Avoid_: user, account, client

## Relationships

- A **Checkout** is started from a dedicated checkout page for exactly one **Service Package** and one Billing Period.
- Checkout URLs use the Service Package in the path and the Billing Period in the query string, defaulting to monthly when omitted.
- A **Checkout** collects the **Buyer**'s name, email, WhatsApp number, and media or organization name before payment.
- Checkout form input is validated with browser HTML validation for usability and server-side validation for correctness.
- If payment creation fails, the Buyer is returned to the Checkout page with a general error message while technical details stay in server logs.
- Merchant order IDs include package, billing period, timestamp, and random suffix, but never personal Buyer data.
- Starter and Pro are **Service Packages** that can be paid through Checkout using monthly or yearly Billing Periods.
- Starter's monthly price is IDR 150,000 and Pro's monthly price is IDR 300,000.
- Yearly Billing Periods are priced at 10 months for 12 months of service: Starter yearly is IDR 1,500,000 and Pro yearly is IDR 3,000,000.
- Buyers choose monthly or yearly Billing Periods from a toggle in the Pricing section before starting Checkout.
- Starter and Pro use Checkout as their primary pricing call to action.
- Enterprise is a custom **Service Package** that remains consultation-led through WhatsApp rather than paid directly in the first implementation.
- A **Checkout** submits Buyer details to Portal Online's server-side payment creation endpoint.
- A **Checkout** creates one **Payment** attempt in Duitku Sandbox for the first implementation.
- Portal Online does not show a payment method picker in the first Checkout implementation.
- A default Duitku payment method is configured through deployment environment variables for the first implementation.
- Duitku configuration uses `DUITKU_ENV`, `DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY`, `DUITKU_DEFAULT_PAYMENT_METHOD`, and `PUBLIC_SITE_URL`.
- A **Payment** belongs to exactly one **Checkout**.
- A **Payment Callback** reports Duitku's payment result to Portal Online, but the first implementation does not persist order status.
- Because Portal Online does not persist payment status in the first implementation, the payment return page uses neutral "payment is being processed" language rather than claiming final success.
- The first Checkout implementation does not store Buyer data in Portal Online storage; Buyer details are only used to create the Duitku Payment.
- Duitku merchant credentials are deployment secrets read from the Cloudflare runtime environment and are never part of the public repository.

## Example dialogue

> **Dev:** "When a visitor clicks Starter or Pro, do we send them to WhatsApp or start a **Checkout**?"
> **Domain expert:** "For Duitku verification, start a **Checkout** so they can complete a Sandbox **Payment** for the selected **Service Package**. Enterprise stays consultation-led because its price is custom."

## Flagged ambiguities

- "checkout" and "payment" were initially used together; resolved: **Checkout** is the site flow, **Payment** is the Duitku transaction attempt inside that flow.
- "checkout page" was chosen over a homepage modal; resolved: **Checkout** happens on dedicated pages for Starter and Pro so Duitku can verify a clear purchase flow.
- "Buyer chooses the payment method on Duitku" conflicted with Duitku's `v2/inquiry` request requiring `paymentMethod`; resolved: Portal Online uses an environment-configured default Duitku payment method for the first implementation and does not expose a method picker.
- Package data was initially embedded in `Pricing.astro`; resolved: **Service Package** and **Billing Period** data should come from a shared source of truth so pricing, checkout pages, and payment creation cannot drift.
