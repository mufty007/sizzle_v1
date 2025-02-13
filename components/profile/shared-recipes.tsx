"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { mockRecipes } from "@/lib/data/mock-recipes";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { EmptyState } from "@/components/recipe/empty-state";
import { Button } from "@/components/ui/button";
import { ChefHat, Loader2, PlusCircle, Star, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SharedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    // Simulate API call to get user's shared recipes
    const fetchSharedRecipes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo, return last two mock recipes
      setRecipes(mockRecipes.slice(-2));
      setIsLoading(false);
    };

    fetchSharedRecipes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="No recipes shared yet"
        description="Share your favorite recipes with the community and inspire others to cook!"
        action={
          <Button asChild>
            <Link href="/share-recipe">
              <PlusCircle className="mr-2 h-4 w-4" />
              Share Your First Recipe
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">My Recipes</h2>
          <p className="text-sm text-muted-foreground">
            Manage and share your culinary creations with the world
          </p>
        </div>
        <Button asChild className="sm:w-auto">
          <Link href="/share-recipe">
            <PlusCircle className="mr-2 h-4 w-4" />
            Share New Recipe
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Recipes</p>
            <p className="text-2xl font-bold">{recipes.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <p className="text-2xl font-bold">
              {(recipes.reduce((acc, r) => acc + r.rating, 0) / recipes.length).toFixed(1)}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Saves</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>
      </div>

      {/* Recipe Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow transition-colors hover:bg-accent/10",
        className
      )}
      {...props}
    />
  );
}