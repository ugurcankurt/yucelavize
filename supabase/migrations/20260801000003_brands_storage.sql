-- Create brands storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brands', 'brands', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for brands
DROP POLICY IF EXISTS "Brand images are publicly accessible" ON storage.objects;
CREATE POLICY "Brand images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'brands');

DROP POLICY IF EXISTS "Anyone can upload brand images" ON storage.objects;
CREATE POLICY "Anyone can upload brand images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brands' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can update their brand images" ON storage.objects;
CREATE POLICY "Anyone can update their brand images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brands' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can delete their brand images" ON storage.objects;
CREATE POLICY "Anyone can delete their brand images"
ON storage.objects FOR DELETE
USING (bucket_id = 'brands' AND auth.role() = 'authenticated');
