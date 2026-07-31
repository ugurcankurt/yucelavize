-- Migration: Add billing_address and user_id to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Kullanıcının kendi siparişlerini görebilmesi için Policy (Eğer daha önce oluşturulmadıysa)
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
