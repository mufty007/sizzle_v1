"use client";

import { Recipe } from "@/lib/types/recipe";
import { RecipeHero } from "./recipe-hero";
import { RecipeContent } from "./recipe-content";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <RecipeHero recipe={recipe} />
      <RecipeContent recipe={recipe} />
    </div>
  );
}