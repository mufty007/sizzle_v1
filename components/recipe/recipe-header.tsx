"use client";

import { Utensils } from "lucide-react";

interface RecipeHeaderProps {
  title: string;
  description: string;
}

export function RecipeHeader({ title, description }: RecipeHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}