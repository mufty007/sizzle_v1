"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/lib/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-video">
          {recipe.image && (
            <div className="relative w-full h-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                unoptimized
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge variant="secondary" className="absolute top-4 right-4">
            {recipe.category}
          </Badge>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {recipe.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {recipe.prepTime + recipe.cookTime} mins
              </span>
              <span className="flex items-center gap-1.5">
                <ChefHat className="h-4 w-4" />
                {recipe.difficulty}
              </span>
            </div>
            {recipe.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {recipe.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}