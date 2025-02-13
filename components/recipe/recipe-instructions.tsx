"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { CookingMode } from "./cooking-mode";
import { scaleInstructions } from "@/lib/utils/recipe";

interface RecipeInstructionsProps {
  instructions: string[];
  servings: number;
  defaultServings?: number;
}

export function RecipeInstructions({ 
  instructions, 
  servings,
  defaultServings = 4 
}: RecipeInstructionsProps) {
  const [showCookingMode, setShowCookingMode] = useState(false);
  const scale = servings / defaultServings;

  const scaledInstructions = instructions.map(instruction => 
    scaleInstructions(instruction, scale)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <Button
          onClick={() => setShowCookingMode(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Cooking Mode
        </Button>
      </div>

      <ol className="space-y-6">
        {scaledInstructions.map((instruction, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {index + 1}
            </span>
            <p className="text-sm sm:text-base leading-relaxed flex-1 pt-1">
              {instruction}
            </p>
          </li>
        ))}
      </ol>

      <CookingMode
        instructions={scaledInstructions}
        open={showCookingMode}
        onOpenChange={setShowCookingMode}
      />
    </div>
  );
}