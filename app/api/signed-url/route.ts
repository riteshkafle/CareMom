import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const response = await fetch(
        "https://inartistic-cristopher-certifiable.ngrok-free.dev/api/signed-url",
        {
            headers: {
                "ngrok-skip-browser-warning": "69420",
                "User-Agent": "NurtureNest-App",
                "Accept": "application/json",
            },
        }
    )

    const text = await response.text()

    // Guard against ngrok returning its HTML interstitial
    if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
        return new Response(JSON.stringify({ error: "ngrok returned interstitial page" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        })
    }

    return new Response(text, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}
