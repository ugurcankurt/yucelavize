import { create } from "zustand";
import { ProductType } from "./use-cart";

interface ProductStore {
  product: ProductType | null;
  colors: string[] | null;
  setProductContext: (product: ProductType, colors?: string[]) => void;
  clearProductContext: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  product: null,
  colors: null,
  setProductContext: (product, colors) => set({ product, colors }),
  clearProductContext: () => set({ product: null, colors: null }),
}));
