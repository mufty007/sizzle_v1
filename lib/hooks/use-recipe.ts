"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedRecipe {
  id: string;
  savedAt: string;
}

interface RecipeState {
  savedRecipes: SavedRecipe[];
  toggleSave: (recipeId: string) => void;
  isSaved: (recipeId: string) => boolean;
}

export const useRecipe = create<RecipeState>()(
  persist(
    (set, get) => ({
      savedRecipes: [],
      toggleSave: (recipeId: string) => {
        const { savedRecipes } = get();
        const isCurrentlySaved = savedRecipes.some((r) => r.id === recipeId);

        if (isCurrentlySaved) {
          set({
            savedRecipes: savedRecipes.filter((r) => r.id !== recipeId),
          });
        } else {
          set({
            savedRecipes: [...savedRecipes, { id: recipeId, savedAt: new Date().toISOString() }],
          });
        }
      },
      isSaved: (recipeId: string) => {
        return get().savedRecipes.some((r) => r.id === recipeId);
      },
    }),
    {
      name: "recipe-storage",
    }
  )
);