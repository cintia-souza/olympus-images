import { createClient } from "@/lib/supabase-server";
import { translateToEnglish } from "@/lib/prompt-builder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, category } = await request.json();

    if (!prompt || !category) {
      return NextResponse.json({ error: "Prompt e categoria são obrigatórios" }, { status: 400 });
    }

    // Translate prompt to English for better AI results
    const englishPrompt = await translateToEnglish(prompt);

    // Call Hugging Face Inference API (Stable Diffusion XL)
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: englishPrompt }),
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
    const fileName = `generated/${Date.now()}.png`;

    // Upload to Supabase Storage
    const supabase = await createClient();
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
      prompt,
      image_url,
      category,
    });

    return NextResponse.json({ image_url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
