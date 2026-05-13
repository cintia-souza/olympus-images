-- Generated images table (no auth required)
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('realistic', 'digital-art', 'pixel-art', '3d-render')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON public.generated_images(created_at DESC);

-- RLS: allow public access
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.generated_images;
DROP POLICY IF EXISTS "Public insert access" ON public.generated_images;

CREATE POLICY "Public read access"
  ON public.generated_images FOR SELECT USING (true);

CREATE POLICY "Public insert access"
  ON public.generated_images FOR INSERT WITH CHECK (true);

-- Storage policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

CREATE POLICY "Public upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
