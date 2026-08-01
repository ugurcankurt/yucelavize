-- Insert bucket for blog images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
-- Allow public access to read files
CREATE POLICY "Blog Images Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Allow authenticated uploads
CREATE POLICY "Blog Images Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );

-- Allow authenticated updates
CREATE POLICY "Blog Images Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );

-- Allow authenticated deletes
CREATE POLICY "Blog Images Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );
