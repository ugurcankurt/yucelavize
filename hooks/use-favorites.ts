import { create } from 'zustand';
import { getMyFavorites } from '@/app/actions/favorites';

interface FavoritesState {
  favorites: string[];
  initialized: boolean;
  initialize: () => Promise<void>;
  toggleFavoriteLocal: (productId: string) => void;
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  favorites: [],
  initialized: false,
  initialize: async () => {
    if (get().initialized) return;
    try {
      const favs = await getMyFavorites();
      set({ favorites: favs, initialized: true });
    } catch (e) {
      console.error(e);
      set({ initialized: true });
    }
  },
  toggleFavoriteLocal: (productId: string) => {
    const { favorites } = get();
    if (favorites.includes(productId)) {
      set({ favorites: favorites.filter(id => id !== productId) });
    } else {
      set({ favorites: [...favorites, productId] });
    }
  }
}));
