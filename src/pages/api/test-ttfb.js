export const prerender = false;

export async function GET() {
    return new Response(JSON.stringify({ message: "Hello from API!" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
