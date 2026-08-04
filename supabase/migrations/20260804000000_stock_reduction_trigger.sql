-- Create a function to decrease stock when an order is placed
CREATE OR REPLACE FUNCTION public.decrease_stock_on_order()
RETURNS trigger AS $$
BEGIN
  -- Decrease the stock by the quantity ordered
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the order_items table
DROP TRIGGER IF EXISTS decrease_stock_trigger ON public.order_items;

CREATE TRIGGER decrease_stock_trigger
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrease_stock_on_order();
