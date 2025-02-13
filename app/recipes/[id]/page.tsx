import { Suspense } from "react";
import { notFound } from "next/navigation";
import { RecipeDetail } from "@/components/recipe/recipe-detail";
import { mockRecipes } from "@/lib/data/mock-recipes";
import { fetchRecipeById } from "@/lib/services/spoonacular";
import RecipeLoading from "./loading";
import { PageLayout } from "@/components/layout/page-layout";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  try {
    // First try to find the recipe in mock data
    let recipe = mockRecipes.find(r => r.id === params.id);

    // If not in mock data, try to fetch from API
    if (!recipe) {
      recipe = await fetchRecipeById(params.id);
    }

    // If still no recipe found, show 404
    if (!recipe) {
      notFound();
    }

    return (
      <PageLayout>
        <Suspense fallback={<RecipeLoading />}>
          <RecipeDetail recipe={recipe} />
        </Suspense>
      </PageLayout>
    );
  } catch (error) {
    console.error('Error loading recipe:', error);
    notFound();
  }
}

// Generate static params for mock recipes
export function generateStaticParams() {
  return mockRecipes.map((recipe) => ({
    id: recipe.id,
  }));
}