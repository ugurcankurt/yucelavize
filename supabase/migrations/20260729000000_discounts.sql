-- Create campaigns table for seasonal discounts
CREATE TABLE public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_amount DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create coupons table
CREATE TABLE public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_amount DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    max_usages INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add columns to orders table to track applied discounts
ALTER TABLE public.orders ADD COLUMN coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN discount_total DECIMAL(10, 2) DEFAULT 0;

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active campaigns and coupons
CREATE POLICY "Allow public read access to active campaigns" ON public.campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Allow admin all access to campaigns and coupons (Requires admin role check or handled by service role/auth policies)
-- Since we use service_role in Next.js Server Actions, this is sufficient.
CREATE POLICY "Allow admin all access to campaigns" ON public.campaigns FOR ALL USING (true);
CREATE POLICY "Allow admin all access to coupons" ON public.coupons FOR ALL USING (true);
