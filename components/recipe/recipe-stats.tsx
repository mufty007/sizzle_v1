import { Clock, ChefHat, Star } from "lucide-react";
import { formatCookingTime } from "@/lib/utils/recipe";

interface RecipeStatsProps {
  prepTime: number;
  cookTime: number;
  difficulty: string;
  rating: number;
}

export function RecipeStats({ prepTime, cookTime, difficulty, rating }: RecipeStatsProps) {
  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        {formatCookingTime(prepTime, cookTime)}
      </span>
      <span className="flex items-center gap-1.5">
        <ChefHat className="h-4 w-4" />
        {difficulty}
      </span>
      {rating > 0 && (
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}