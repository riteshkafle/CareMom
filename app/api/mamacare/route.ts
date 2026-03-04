import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const response = await fetch(
    "https://inartistic-cristopher-certifiable.ngrok-free.dev/conversation",
    {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        "User-Agent": "NurtureNest-App",
      },
    }
  )

  const html = await response.text()

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}