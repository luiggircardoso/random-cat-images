import { useEffect, useState } from "react";
import { LocalStorage } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";

export function useFavorites(): [string[], (favorites: string[]) => void] {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const stored = await LocalStorage.getItem("favorites");
      const favoritesString = typeof stored === "string" ? stored : "[]";
      try {
        setFavorites(JSON.parse(favoritesString));
      } catch (e) {
        setFavorites([]);
        console.error("Failed to parse favorites from local storage:", e);
        showFailureToast("Failed to load favorites");
      }
    }
    fetchFavorites();
  }, []);

  return [favorites, setFavorites];
}