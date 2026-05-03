import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import { createDuitkuCallbackSignature, getDuitkuConfig } from "../../../lib/duitku";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    try {
        const duitku = getDuitkuConfig(env);
        const formData = await context.request.formData();
        const merchantCode = getFormValue(formData, "merchantCode");
        const amount = getFormValue(formData, "amount");
        const merchantOrderId = getFormValue(formData, "merchantOrderId");
        const signature = getFormValue(formData, "signature");
        const resultCode = getFormValue(formData, "resultCode");
        const reference = getFormValue(formData, "reference");

        if (!merchantCode || !amount || !merchantOrderId || !signature) {
            console.error("Duitku callback missing required parameters");
            return new Response("Bad Parameter", { status: 400 });
        }

        if (merchantCode !== duitku.merchantCode) {
            console.error("Duitku callback merchant code mismatch", { merchantCode });
            return new Response("Bad Merchant", { status: 400 });
        }

        const expectedSignature = createDuitkuCallbackSignature(
            merchantCode,
            amount,
            merchantOrderId,
            duitku.apiKey,
        );

        if (signature !== expectedSignature) {
            console.error("Duitku callback bad signature", { merchantOrderId, reference });
            return new Response("Bad Signature", { status: 400 });
        }

        console.info("Duitku callback verified", {
            merchantOrderId,
            amount,
            resultCode,
            reference,
        });

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Unable to process Duitku callback", error);
        return new Response("Callback Error", { status: 500 });
    }
};

function getFormValue(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}
