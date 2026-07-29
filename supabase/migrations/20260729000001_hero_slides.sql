-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    button_text TEXT,
    link_url TEXT,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Everyone can read active slides
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.hero_slides 
FOR SELECT 
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to hero_slides." 
ON public.hero_slides 
FOR ALL 
USING (auth.role() = 'authenticated');
