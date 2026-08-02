"use client";
import { useEffect } from "react";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesInitializer() {
  const initialize = useFavorites(state => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return null;
}
