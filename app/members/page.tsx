"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { mockRecipes } from "@/lib/data/mock-recipes";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { RecipeFilters } from "@/components/recipe/recipe-filters";
import { EmptyState } from "@/components/recipe/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, UtensilsCrossed, Users, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import Link from "next/link";

export default function MembersRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    // Simulate API call to get community recipes
    const fetchCommunityRecipes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecipes(mockRecipes);
      setIsLoading(false);
    };

    fetchCommunityRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || recipe.category === category;
    const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading community recipes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative border-b">
          <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/5" />
          
          <div className="relative container max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Community Recipes</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Explore delicious recipes shared by our talented community members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              title="Total Recipes"
              value={recipes.length.toString()}
              icon={<UtensilsCrossed className="h-5 w-5 text-primary" />}
            />
            <StatsCard
              title="Community Members"
              value="50+"
              icon={<Users className="h-5 w-5 text-primary" />}
            />
            <StatsCard
              title="Average Rating"
              value="4.8"
              icon={<Star className="h-5 w-5 text-primary" />}
            />
          </div>

          {/* Filters */}
          <RecipeFilters
            search={search}
            category={category}
            difficulty={difficulty}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onDifficultyChange={setDifficulty}
          />

          {/* Recipe Grid */}
          {filteredRecipes.length > 0 ? (
            <RecipeGrid recipes={filteredRecipes} />
          ) : (
            <EmptyState
              title="No recipes found"
              description={
                search || category !== "all" || difficulty !== "all"
                  ? "No recipes match your current filters. Try adjusting them."
                  : "No community recipes available yet. Be the first to share!"
              }
              action={
                <Button asChild>
                  <Link href="/share-recipe">Share Recipe</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-xl border bg-card text-card-foreground">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}