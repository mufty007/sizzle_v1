import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

export default function RecipeNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Recipe Not Found</h1>
          <p className="text-muted-foreground">
            The recipe you're looking for doesn't exist or has been removed
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes">Browse Recipes</Link>
        </Button>
      </div>
    </div>
  );
}