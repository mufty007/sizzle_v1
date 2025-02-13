"use client";

import { Recipe } from "@/lib/types/recipe";
import { Badge } from "@/components/ui/badge";
import { RecipeActions } from "./recipe-actions";
import { RecipeStats } from "./recipe-stats";

interface RecipeHeroProps {
  recipe: Recipe;
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      {recipe.image && (
        <div className="absolute inset-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="object-cover w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-6 max-w-3xl relative">
            <div className="flex items-center justify-between gap-4">
              <Badge
                variant="outline"
                className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 backdrop-blur-sm"
              >
                {recipe.category}
              </Badge>
              <RecipeActions recipeId={recipe.id} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {recipe.title}
              </h1>
              <p className="text-lg text-muted-foreground">{recipe.description}</p>
            </div>
            <div className="text-muted-foreground">
              <RecipeStats
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                difficulty={recipe.difficulty}
                rating={recipe.rating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}