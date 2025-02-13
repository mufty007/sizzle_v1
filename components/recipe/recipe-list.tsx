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

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || recipe.category === category;
      const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [initialRecipes, search, category, difficulty]);

  return (
    <div className="space-y-8">
      <RecipeFilters
        search={search}
        category={category}
        difficulty={difficulty}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
      />
      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}