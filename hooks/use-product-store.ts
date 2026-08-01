import { create } from "zustand";
import { ProductType } from "./use-cart";

interface ProductStore {
  product: ProductType | null;
  variations: string[] | null;
  setProductContext: (product: ProductType, variations?: string[]) => void;
  clearProductContext: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  product: null,
  variations: null,
  setProductContext: (product, variations) => set({ product, variations }),
  clearProductContext: () => set({ product: null, variations: null }),
}));
