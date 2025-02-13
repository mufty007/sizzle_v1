"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ServingSize } from "./serving-size";
import { scaleIngredient } from "@/lib/utils/recipe";

interface RecipeIngredientsProps {
  ingredients: string[];
  defaultServings?: number;
}

export function RecipeIngredients({ ingredients, defaultServings = 4 }: RecipeIngredientsProps) {
  const [servings, setServings] = useState(defaultServings);
  const scale = servings / defaultServings;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ServingSize servings={servings} onServingsChange={setServings} />
        </div>
        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0 translate-y-2" />
              <span className="text-sm sm:text-base leading-relaxed">
                {scaleIngredient(ingredient, scale)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}