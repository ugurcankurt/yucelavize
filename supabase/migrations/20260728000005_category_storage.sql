-- Insert bucket for category images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
-- Allow public access to read files
CREATE POLICY "Public Access Categories"
ON storage.objects FOR SELECT
USING ( bucket_id = 'category-images' );

-- Allow authenticated/public inserts
CREATE POLICY "Public Upload Categories"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'category-images' );

-- Allow public updates and deletes
CREATE POLICY "Public Update Categories"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'category-images' );

CREATE POLICY "Public Delete Categories"
ON storage.objects FOR DELETE
USING ( bucket_id = 'category-images' );
