-- 1. Collections Table
CREATE TABLE public.collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Collection Products Table (Many-to-Many)
CREATE TABLE public.collection_products (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (collection_id, product_id)
);

-- 3. Set RLS policies
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow public read access to collection_products" ON public.collection_products FOR SELECT USING (true);

-- Allow authenticated users to manage collections and products
CREATE POLICY "Allow authenticated to insert collections" ON public.collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to update collections" ON public.collections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to delete collections" ON public.collections FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert collection_products" ON public.collection_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to update collection_products" ON public.collection_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated to delete collection_products" ON public.collection_products FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Storage for Collections
INSERT INTO storage.buckets (id, name, public) VALUES ('collections', 'collections', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Give public access to collections images" ON storage.objects FOR SELECT USING (bucket_id = 'collections');
CREATE POLICY "Allow authenticated to insert collections images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'collections');
CREATE POLICY "Allow authenticated to update collections images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'collections');
CREATE POLICY "Allow authenticated to delete collections images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'collections');
