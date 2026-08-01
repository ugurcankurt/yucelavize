-- Blog Categories Table
CREATE TABLE public.blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Posts Table
CREATE TABLE public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set RLS policies
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blog_categories
CREATE POLICY "Allow public read access to blog_categories" ON public.blog_categories FOR SELECT USING (true);

-- Allow public read access to ONLY published blog_posts
CREATE POLICY "Allow public read access to published blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Allow authenticated admins to view all posts (including drafts)
CREATE POLICY "Allow authenticated admins to read all blog_posts" ON public.blog_posts FOR SELECT USING (
  (SELECT (auth.jwt() ->> 'role')) = 'authenticated'
);

-- Allow authenticated users to manage blog categories and posts
CREATE POLICY "Allow authenticated to insert blog_categories" ON public.blog_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to update blog_categories" ON public.blog_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to delete blog_categories" ON public.blog_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert blog_posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to update blog_posts" ON public.blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to delete blog_posts" ON public.blog_posts FOR DELETE USING (auth.role() = 'authenticated');
