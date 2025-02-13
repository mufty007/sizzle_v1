"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { mockRecipes } from "@/lib/data/mock-recipes";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { EmptyState } from "@/components/recipe/empty-state";

export function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get saved recipes
    const fetchSavedRecipes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo, return first two mock recipes
      setRecipes(mockRecipes.slice(0, 2));
      setIsLoading(false);
    };

    fetchSavedRecipes();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="No saved recipes"
        description="You haven't saved any recipes yet. Browse recipes and click the bookmark icon to save them for later."
      />
    );
  }

  return <RecipeGrid recipes={recipes} />;
}