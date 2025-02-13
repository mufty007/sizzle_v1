"use client";

import { useEffect, useState, useMemo } from "react";
import { Recipe } from "@/lib/types/recipe";
import { fetchRecipes } from "@/lib/services/spoonacular";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { RecipeFilters } from "@/components/recipe/recipe-filters";
import { EmptyState } from "@/components/recipe/empty-state";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";

export default function DiscoverPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    async function loadRecipes() {
      try {
        setIsLoading(true);
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load recipes");
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || recipe.category === category;
      const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, search, category, difficulty]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading recipes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col items-center gap-6 text-center mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Recipes</h1>
              <p className="text-muted-foreground max-w-2xl">
                Explore our collection of delicious recipes from around the world. Use the filters to find your next favorite dish.
              </p>
            </div>
          </div>
          
          <RecipeFilters
            search={search}
            category={category}
            difficulty={difficulty}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onDifficultyChange={setDifficulty}
          />
          
          {error ? (
            <EmptyState
              title="Error loading recipes"
              description={error}
            />
          ) : filteredRecipes.length > 0 ? (
            <RecipeGrid recipes={filteredRecipes} />
          ) : (
            <EmptyState
              title="No recipes found"
              description={
                search || category !== "all" || difficulty !== "all"
                  ? "No recipes match your current filters. Try adjusting them."
                  : "No recipes available at the moment. Please try again later."
              }
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}