import { GenerationFormData } from "@/types";

const categoryMap = {
  realistic: "photorealistic photograph",
  "digital-art": "digital art illustration",
  "pixel-art": "pixel art",
  "3d-render": "3D rendered scene",
};

const lightingMap = {
  natural: "natural lighting",
  studio: "professional studio lighting",
  cinematic: "cinematic lighting with dramatic shadows",
  neon: "neon glow lighting with vibrant colors",
  dramatic: "dramatic chiaroscuro lighting",
  soft: "soft diffused lighting",
};

const detailMap = {
  low: "simple composition",
  medium: "detailed",
  high: "highly detailed, intricate",
  ultra: "ultra detailed, 8K resolution, intricate details",
};

export function buildPrompt(data: GenerationFormData): string {
  const parts = [
    `A ${categoryMap[data.category]} of ${data.subject}`,
    data.style && `in ${data.style} style`,
    lightingMap[data.lighting],
    detailMap[data.detailLevel],
    data.aspectRatio !== "1:1" && `aspect ratio ${data.aspectRatio}`,
    data.additionalDetails,
  ].filter(Boolean);

  return parts.join(", ") + ".";
}

export async function translateToEnglish(text: string): Promise<string> {
  // Skip if already in English (basic heuristic: no accents/special chars common in PT)
  if (/^[a-zA-Z0-9\s,.!?'"()\-:;/]+$/.test(text)) return text;

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-tc-big-en",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!res.ok) return text;
    const data = await res.json();
    return data[0]?.translation_text || text;
  } catch {
    return text;
  }
}
