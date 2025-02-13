"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/lib/types/recipe";
import { RecipeFilters } from "./recipe-filters";
import { RecipeGrid } from "./recipe-grid";
import { EmptyState } from "./empty-state";

interface RecipeListProps {
  initialRecipes: Recipe[];
}

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [cuisine, setCuisine] = useState("all");

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || recipe.category === category;
      const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;
      const matchesCuisine = cuisine === "all" || recipe.cuisine === cuisine;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCuisine;
    });
  }, [initialRecipes, search, category, difficulty, cuisine]);

  return (
    <div className="space-y-8">
      <RecipeFilters
        search={search}
        category={category}
        difficulty={difficulty}
        cuisine={cuisine}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onCuisineChange={setCuisine}
      />
      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <EmptyState
          title="No recipes found"
          description="Try adjusting your filters to find more recipes"
        />
      )}
    </div>
  );
}