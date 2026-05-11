export type ImageCategory = "realistic" | "digital-art" | "pixel-art" | "3d-render";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

export type LightingStyle =
  | "natural"
  | "studio"
  | "cinematic"
  | "neon"
  | "dramatic"
  | "soft";

export type DetailLevel = "low" | "medium" | "high" | "ultra";

export interface GenerationFormData {
  category: ImageCategory;
  subject: string;
  style: string;
  lighting: LightingStyle;
  aspectRatio: AspectRatio;
  detailLevel: DetailLevel;
  additionalDetails: string;
  referenceImageUrl?: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  category: ImageCategory;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_premium: boolean;
  generation_count: number;
  created_at: string;
}
