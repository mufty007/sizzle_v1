import { Suspense } from "react";
import { mockRecipes } from "@/lib/data/mock-recipes";
import { RecipeList } from "@/components/recipe/recipe-list";
import { UtensilsCrossed } from "lucide-react";
import LoadingRecipes from "./loading";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecipesPage() {
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
                <h1 className="text-3xl sm:text-4xl font-bold">Community Recipes</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Discover delicious recipes shared by our community members
                </p>
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link href="/share-recipe">Share Your Recipe</Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingRecipes />}>
            <RecipeList initialRecipes={mockRecipes} />
          </Suspense>
        </main>
      </div>
    </PageLayout>
  );
}