import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import {
    getPackagePrice,
    getServicePackage,
    normalizeBillingPeriod,
} from "../../../data/servicePackages";
import {
    createDuitkuPopSignature,
    createMerchantOrderId,
    createProductDetails,
    getDuitkuConfig,
    normalizePhoneNumber,
    splitName,
    type BuyerDetails,
} from "../../../lib/duitku";

export const prerender = false;

export const GET: APIRoute = () => {
    return new Response("Endpoint ini hanya menerima POST dari form checkout.", {
        status: 405,
        headers: {
            Allow: "POST",
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
};

export const POST: APIRoute = async (context) => {
    const formData = await context.request.formData();
    const packageId = getFormValue(formData, "packageId");
    const servicePackage = getServicePackage(packageId);
    const period = normalizeBillingPeriod(getFormValue(formData, "period"));

    if (!servicePackage || !servicePackage.checkoutEnabled) {
        return redirectToCheckout("starter", "monthly", "invalid_form");
    }

    const amount = getPackagePrice(servicePackage, period);
    if (amount === null) {
        return redirectToCheckout(servicePackage.id, period, "invalid_form");
    }

    const buyer = getBuyerDetails(formData);
    if (!isValidBuyerDetails(buyer)) {
        return redirectToCheckout(servicePackage.id, period, "invalid_form");
    }

    try {
        const duitku = getDuitkuConfig(env);
        const merchantOrderId = createMerchantOrderId(servicePackage, period);
        const productDetails = createProductDetails(servicePackage, period);
        const { firstName, lastName } = splitName(buyer.name);
        const phoneNumber = normalizePhoneNumber(buyer.phoneNumber);
        const timestamp = Date.now();
        const signature = createDuitkuPopSignature(duitku.merchantCode, timestamp, duitku.apiKey);

        const response = await fetch(duitku.invoiceUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=UTF-8",
                "x-duitku-signature": signature,
                "x-duitku-timestamp": String(timestamp),
                "x-duitku-merchantcode": duitku.merchantCode,
            },
            body: JSON.stringify({
                paymentAmount: amount,
                merchantOrderId,
                productDetails,
                email: buyer.email,
                additionalParam: JSON.stringify({
                    packageId: servicePackage.id,
                    period,
                    organizationName: buyer.organizationName,
                    domain: buyer.domain,
                }),
                merchantUserInfo: buyer.email,
                customerVaName: buyer.name,
                phoneNumber,
                itemDetails: [
                    {
                        name: productDetails,
                        price: amount,
                        quantity: 1,
                    },
                ],
                customerDetail: {
                    firstName,
                    lastName,
                    email: buyer.email,
                    phoneNumber,
                },
                callbackUrl: `${duitku.siteUrl}/api/duitku/callback`,
                returnUrl: `${duitku.siteUrl}/payment/return`,
                expiryPeriod: 60,
            }),
        });

        const result = (await response.json().catch(() => null)) as {
            reference?: string;
            paymentUrl?: string;
            Message?: string;
        } | null;

        if (!response.ok || !result?.reference) {
            console.error("Duitku invoice creation failed", {
                status: response.status,
                result,
            });
            return redirectToCheckout(servicePackage.id, period, "payment_failed");
        }

        const startParams = new URLSearchParams({ reference: result.reference });
        if (result.paymentUrl) startParams.set("paymentUrl", result.paymentUrl);

        return new Response(JSON.stringify({ redirectUrl: `/payment/start?${startParams.toString()}` }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Unable to create Duitku invoice", error);
        return redirectToCheckout(servicePackage.id, period, "payment_failed");
    }
};

function getBuyerDetails(formData: FormData): BuyerDetails {
    return {
        name: getFormValue(formData, "name"),
        email: getFormValue(formData, "email"),
        phoneNumber: getFormValue(formData, "phoneNumber"),
        organizationName: getFormValue(formData, "organizationName"),
        domain: getFormValue(formData, "domain"),
        notes: getFormValue(formData, "notes"),
    };
}

function isValidBuyerDetails(buyer: BuyerDetails) {
    return (
        buyer.name.length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email) &&
        normalizePhoneNumber(buyer.phoneNumber).length >= 8 &&
        buyer.organizationName.length >= 2
    );
}

function getFormValue(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

function redirectToCheckout(packageId: string, period: string, error: "invalid_form" | "payment_failed") {
    return new Response(null, {
        status: 303,
        headers: {
            Location: `/checkout/${packageId}?period=${period}&error=${error}`,
        },
    });
}
