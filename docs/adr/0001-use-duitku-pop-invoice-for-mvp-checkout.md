# Use Duitku POP invoice for MVP checkout

For the first checkout implementation, Portal Online uses Duitku POP `createInvoice` instead of Duitku API V2 `v2/inquiry`. The API V2 flow requires a specific `paymentMethod`, which caused Sandbox failures when the configured channel was not active; POP allows `paymentMethod` to be omitted and opens Duitku's hosted payment UI from a returned `reference`. This keeps onboarding verification focused on a working checkout-to-payment flow without building a payment method picker.
