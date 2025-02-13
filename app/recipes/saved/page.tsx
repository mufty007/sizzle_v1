"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { fetchRecipes } from "@/lib/services/spoonacular";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { EmptyState } from "@/components/recipe/empty-state";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { useRecipe } from "@/lib/hooks/use-recipe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedRecipes } = useRecipe();

  useEffect(() => {
    async function loadSavedRecipes() {
      try {
        const allRecipes = await fetchRecipes();
        const savedRecipesList = allRecipes.filter(recipe => 
          savedRecipes.some(saved => saved.id === recipe.id)
        );
        setRecipes(savedRecipesList);
      } catch (error) {
        console.error('Error loading saved recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedRecipes();
  }, [savedRecipes]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading saved recipes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold">Saved Recipes</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Your collection of favorite recipes saved for later
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {recipes.length > 0 ? (
            <RecipeGrid recipes={recipes} />
          ) : (
            <EmptyState
              title="No saved recipes"
              description="You haven't saved any recipes yet. Browse our collection and save your favorites!"
              action={
                <Button asChild>
                  <Link href="/discover">Discover Recipes</Link>
                </Button>
              }
            />
          )}
        </main>
      </div>
    </PageLayout>
  );
}