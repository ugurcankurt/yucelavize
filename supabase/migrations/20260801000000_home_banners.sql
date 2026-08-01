-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create home_banners table
DROP TABLE IF EXISTS public.home_banners CASCADE;
CREATE TABLE IF NOT EXISTS public.home_banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pre_title TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    button_text TEXT,
    link_url TEXT,
    image_url TEXT NOT NULL,
    is_large BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.home_banners ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Everyone can read active banners
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.home_banners 
FOR SELECT 
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to home_banners." 
ON public.home_banners 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert default banners
INSERT INTO public.home_banners (pre_title, title, subtitle, button_text, link_url, image_url, is_large, sort_order)
VALUES 
(
    NULL,
    'Tarzınızı<br />Yansıtın,<br />İnternete Özel.',
    'Yücel Avize ile tanışın.',
    NULL,
    '/products',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop',
    true,
    1
),
(
    'Modern Koleksiyon',
    'Aksesuar koleksiyonumuzu keşfedin',
    NULL,
    'İncele',
    '/products',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=400&auto=format&fit=crop',
    false,
    2
),
(
    'Lüks Aydınlatma',
    'Özel tasarım serimizi inceleyin',
    NULL,
    'Alışverişe Başla',
    '/products',
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=400&auto=format&fit=crop',
    false,
    3
);
