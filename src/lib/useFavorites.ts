import { useEffect, useState } from "react";
import { LocalStorage, showToast } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";

export function useFavorites(): [
  Set<string>,
  (favorites: Set<string>) => void,
  (id: string) => Promise<void>
] {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchFavorites() {
      const stored = await LocalStorage.getItem("favorites");
      const favoritesString = typeof stored === "string" ? stored : "[]";
      try {
        const parsed: string[] = JSON.parse(favoritesString);
        setFavorites(new Set(parsed));
      } catch (e) {
        setFavorites(new Set());
        console.error("Failed to parse favorites from local storage:", e);
        showFailureToast("Failed to load favorites");
      }
    }
    fetchFavorites();
  }, []);

  async function addFavorite(id: string) {
    if (!favorites.has(id)) {
      const updated = new Set(favorites);
      updated.add(id);
      await LocalStorage.setItem("favorites", JSON.stringify(Array.from(updated)));
      setFavorites(updated);
      showToast({ title: "Added to Favorites", message: "Cat image has been added to your favorites." });
    } else {
      showFailureToast("Cat image is already in favorites.");
    }
  }

  return [favorites, setFavorites, addFavorite];
}
