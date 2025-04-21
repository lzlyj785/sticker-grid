import { Ai } from "@cloudflare/ai"
export const runtime = "edge"  // Vercel Edge Function, 0 冷启动

export async function POST(req: Request) {
  const { imageUrl, style } = await req.json()

  const ai = new Ai(process.env.CF_API_TOKEN!, {
    accountId: process.env.CF_ACCOUNT_ID!
  })

  const { image } = await ai.run("@cf/runwayml/stable-diffusion-v1-5-img2img", {
    image: imageUrl,
    prompt: `${style}, flat cute sticker style, transparent background`,
    num_steps: 8, width: 1024, height: 1024
  })               // 每次≈250 steps → 免费日配额~40 图  :contentReference[oaicite:11]{index=11}

  return Response.json({ url: image })
}
