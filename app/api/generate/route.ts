import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check premium / rate limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, generation_count")
    .eq("id", user.id)
    .single();

  const FREE_LIMIT = 10;
  if (!profile?.is_premium && (profile?.generation_count ?? 0) >= FREE_LIMIT) {
    return NextResponse.json(
      { error: "Limite gratuito atingido" },
      { status: 403 },
    );
  }

  const { prompt, category } = await request.json();

  // Call OpenAI DALL-E 3
  const openaiRes = await fetch(
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    },
  );

  // Call huggingface

  // const hfRes = await fetch(
  //   "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  //   {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  //     body: JSON.stringify({ inputs: prompt }),
  //   },
  // );

  // const blob = await hfRes.blob();
  // Upload do blob para Supabase Storage e retorne a URL pública

  const openaiData = await openaiRes.json();

  if (!openaiData.data?.[0]?.url) {
    return NextResponse.json({ error: "Falha na geração" }, { status: 500 });
  }

  const image_url = openaiData.data[0].url;

  // Save to database
  await supabase.from("generated_images").insert({
    user_id: user.id,
    prompt,
    image_url,
    category,
  });

  // Increment generation count
  await supabase
    .from("profiles")
    .update({ generation_count: (profile?.generation_count ?? 0) + 1 })
    .eq("id", user.id);

  return NextResponse.json({ image_url });
}
