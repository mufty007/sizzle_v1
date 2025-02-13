"use client";

import { useState, useMemo } from "react";
import { RecipeFilters } from "./recipe-filters";
import { RecipeGrid } from "./recipe-grid";
import { Recipe } from "@/lib/types/recipe";

interface ClientRecipesProps {
  initialRecipes: readonly Recipe[];
}

export function ClientRecipes({ initialRecipes }: ClientRecipesProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const filteredRecipes = useMemo(() => {
    return Array.from(initialRecipes).filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || recipe.category === category;
      const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [initialRecipes, search, category, difficulty]);

  return (
    <>
      <RecipeFilters
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
      />
      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No recipes found matching your criteria.</p>
        </div>
      )}
    </>
  );
}