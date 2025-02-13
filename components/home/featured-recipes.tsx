"use client";

import { Recipe } from "@/lib/types/recipe";
import { RecipeCard } from "../recipe/recipe-card";

interface FeaturedRecipesProps {
  recipes: Recipe[];
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Recipes</h2>
          <p className="text-muted-foreground">
            Discover our community's most loved recipes, from quick weekday meals to weekend specialties
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}