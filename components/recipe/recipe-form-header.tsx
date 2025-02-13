import { PenLine } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function RecipeFormHeader() {
  return (
    <CardHeader className="space-y-4 p-6 pb-0">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <PenLine className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl">Submit a Recipe</CardTitle>
          <CardDescription>
            Share your favorite recipe with the RecipeVerse community
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}