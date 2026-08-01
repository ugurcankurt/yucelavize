-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
CREATE POLICY "Brands are viewable by everyone"
  ON public.brands FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Brands are insertable by authenticated users" ON public.brands;
CREATE POLICY "Brands are insertable by authenticated users"
  ON public.brands FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Brands are updatable by authenticated users" ON public.brands;
CREATE POLICY "Brands are updatable by authenticated users"
  ON public.brands FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Brands are deletable by authenticated users" ON public.brands;
CREATE POLICY "Brands are deletable by authenticated users"
  ON public.brands FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_brands_updated_at ON public.brands;
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION update_brands_updated_at();
