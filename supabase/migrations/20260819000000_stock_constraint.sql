-- Add check constraint to prevent stock from becoming negative
ALTER TABLE public.products
ADD CONSTRAINT stock_not_negative CHECK (stock >= 0);
