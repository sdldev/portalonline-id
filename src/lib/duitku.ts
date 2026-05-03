import { createHash, randomBytes } from "node:crypto";

import {
    billingPeriods,
    type BillingPeriod,
    type ServicePackage,
} from "../data/servicePackages";

type DuitkuEnv = {
    DUITKU_ENV?: string;
    DUITKU_MERCHANT_CODE?: string;
    DUITKU_API_KEY?: string;
    DUITKU_DEFAULT_PAYMENT_METHOD?: string;
    PUBLIC_SITE_URL?: string;
};

export type BuyerDetails = {
    name: string;
    email: string;
    phoneNumber: string;
    organizationName: string;
    domain?: string;
    notes?: string;
};

export function getDuitkuConfig(env: DuitkuEnv) {
    const merchantCode = env.DUITKU_MERCHANT_CODE?.trim();
    const apiKey = env.DUITKU_API_KEY?.trim();
    const defaultPaymentMethod = env.DUITKU_DEFAULT_PAYMENT_METHOD?.trim();
    const siteUrl = env.PUBLIC_SITE_URL?.trim()?.replace(/\/$/, "");
    const duitkuEnv = env.DUITKU_ENV === "production" ? "production" : "sandbox";

    if (!merchantCode || !apiKey || !defaultPaymentMethod || !siteUrl) {
        throw new Error("Missing Duitku environment configuration");
    }

    return {
        merchantCode,
        apiKey,
        defaultPaymentMethod,
        siteUrl,
        invoiceUrl:
            duitkuEnv === "production"
                ? "https://api-prod.duitku.com/api/merchant/createInvoice"
                : "https://api-sandbox.duitku.com/api/merchant/createInvoice",
        popScriptUrl:
            duitkuEnv === "production"
                ? "https://app-prod.duitku.com/lib/js/duitku.js"
                : "https://app-sandbox.duitku.com/lib/js/duitku.js",
    };
}

export function createDuitkuSignature(
    merchantCode: string,
    merchantOrderId: string,
    paymentAmount: number,
    apiKey: string,
) {
    return md5(`${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`);
}

export function createDuitkuCallbackSignature(
    merchantCode: string,
    amount: string,
    merchantOrderId: string,
    apiKey: string,
) {
    return md5(`${merchantCode}${amount}${merchantOrderId}${apiKey}`);
}

export function createDuitkuPopSignature(merchantCode: string, timestamp: number, apiKey: string) {
    return createHash("sha256").update(`${merchantCode}${timestamp}${apiKey}`).digest("hex");
}

export function createMerchantOrderId(servicePackage: ServicePackage, period: BillingPeriod) {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replaceAll("-", "");
    const time = now.toISOString().slice(11, 19).replaceAll(":", "");
    const randomSuffix = randomBytes(3).toString("hex").toUpperCase();

    return `PO-${servicePackage.id.toUpperCase()}-${period.toUpperCase()}-${date}-${time}-${randomSuffix}`;
}

export function createProductDetails(servicePackage: ServicePackage, period: BillingPeriod) {
    return `Portal Online ${servicePackage.name} - ${billingPeriods[period].label}`;
}

export function splitName(name: string) {
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "Customer";
    const lastName = parts.slice(1).join(" ") || "Portal Online";

    return { firstName, lastName };
}

export function normalizePhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/[^\d+]/g, "");
}

function md5(value: string) {
    return createHash("md5").update(value).digest("hex");
}
