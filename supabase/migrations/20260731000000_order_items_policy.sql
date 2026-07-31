-- Add SELECT policy for order_items so users and admins can view their ordered items
CREATE POLICY "Users and Admins can view order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE public.orders.id = public.order_items.order_id 
    AND (public.orders.user_id = auth.uid() OR public.is_admin())
  )
);
