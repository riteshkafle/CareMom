import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Server-side fetch bypasses all browser CORS restrictions
        const response = await fetch("https://f4bc-138-238-254-103.ngrok-free.app/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Tells ngrok to not serve the HTML warning page
                "ngrok-skip-browser-warning": "69420",
                "User-Agent": "NurtureNest-App",
                "Accept": "application/json, text/event-stream",
            },
            body: JSON.stringify(body),
        });

        // We stream the exact response back (including SSE if applicable)
        return new Response(response.body, {
            status: response.status,
            headers: response.headers,
        });

    } catch (error) {
        console.error("API Proxy Error:", error);
        return NextResponse.json(
            { error: "Failed to connect to backend AI" },
            { status: 500 }
        );
    }
}
