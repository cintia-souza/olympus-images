import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
      return NextResponse.json({ error: "Limite gratuito atingido" }, { status: 403 });
    }

    const { prompt, category } = await request.json();

    if (!prompt || !category) {
      return NextResponse.json({ error: "Prompt e categoria são obrigatórios" }, { status: 400 });
    }

    // Call OpenAI DALL-E 3
    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
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
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json();
      return NextResponse.json(
        { error: "OpenAI error", details: err },
        { status: openaiRes.status }
      );
    }

    const openaiData = await openaiRes.json();
    const image_url = openaiData.data?.[0]?.url;

    if (!image_url) {
      return NextResponse.json({ error: "Nenhuma imagem retornada" }, { status: 500 });
    }

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
