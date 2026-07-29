import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  color?: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: any | null;
  addItem: (product: ProductType, quantity?: number, color?: string) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  applyCoupon: (coupon: any) => void;
  removeCoupon: () => void;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product, quantity = 1, color) => {
        const currentItems = get().items;
        // Same product ID AND same color (if any)
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.color === color
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, quantity, color }] });
        }
      },

      removeItem: (productId, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.color === color)
          ),
        });
      },

      updateQuantity: (productId, quantity, color) => {
        const newQuantity = Math.max(1, quantity);
        
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.color === color 
              ? { ...item, quantity: newQuantity } 
              : item
          ),
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      getDiscountAmount: () => {
        const total = get().getTotal();
        const coupon = get().appliedCoupon;
        
        if (!coupon) return 0;
        
        if (coupon.discount_type === "percentage") {
          return (total * coupon.discount_amount) / 100;
        } else {
          return Math.min(total, coupon.discount_amount);
        }
      },

      getFinalTotal: () => {
        const total = get().getTotal();
        const discount = get().getDiscountAmount();
        
        return Math.max(0, total - discount);
      }
    }),
    {
      name: 'yucel-avize-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
