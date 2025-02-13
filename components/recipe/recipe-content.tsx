"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types/recipe";
import { Card } from "@/components/ui/card";
import { RecipeStats } from "./recipe-stats";
import { RecipeInstructions } from "./recipe-instructions";
import { RecipeComments } from "./recipe-comments";
import { RecipeIngredients } from "./recipe-ingredients";
import { Footer } from "@/components/footer";

interface RecipeContentProps {
  recipe: Recipe;
}

export function RecipeContent({ recipe }: RecipeContentProps) {
  const [servings, setServings] = useState(4);

  return (
    <div className="flex-1 py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8">

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
            {/* Ingredients - Sticky on desktop */}
            <div className="order-1 lg:order-none">
              <div className="lg:sticky lg:top-20">
                <RecipeIngredients 
                  ingredients={recipe.ingredients} 
                  defaultServings={4}
                />
              </div>
            </div>

            {/* Instructions */}
            <Card className="order-2 lg:order-none p-6 border-primary/10">
              <RecipeInstructions 
                instructions={recipe.instructions} 
                servings={servings}
                defaultServings={4}
              />
            </Card>
          </div>

          {/* Comments */}
          <Card className="p-6 border-primary/10">
            <RecipeComments 
              comments={recipe.comments} 
              recipeId={recipe.id} 
            />
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}