import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, generation_count")
      .eq("id", user.id)
      .single();

    const FREE_LIMIT = 50;
    if (!profile?.is_premium && (profile?.generation_count ?? 0) >= FREE_LIMIT) {
      return NextResponse.json({ error: "Limite gratuito atingido" }, { status: 403 });
    }

    const { prompt, category } = await request.json();

    if (!prompt || !category) {
      return NextResponse.json({ error: "Prompt e categoria são obrigatórios" }, { status: 400 });
    }

    // Call Hugging Face Inference API (Stable Diffusion XL)
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!hfRes.ok) {
      const err = await hfRes.json().catch(() => ({ error: hfRes.statusText }));
      return NextResponse.json(
        { error: "Hugging Face error", details: err },
        { status: hfRes.status }
      );
    }

    // HF returns the image as a blob
    const imageBlob = await hfRes.arrayBuffer();
    const fileName = `generated/${user.id}/${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, imageBlob, { contentType: "image/png" });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed", details: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(uploadData.path);
    const image_url = urlData.publicUrl;

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
