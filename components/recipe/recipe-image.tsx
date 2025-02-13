import { DEFAULT_RECIPE_IMAGE } from "@/lib/constants/images";
import { Badge } from "@/components/ui/badge";

interface RecipeImageProps {
  image?: string;
  title: string;
  category: string;
}

export function RecipeImage({ image, title, category }: RecipeImageProps) {
  return (
    <div className="relative aspect-video">
      <img
        src={image || DEFAULT_RECIPE_IMAGE}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <Badge variant="secondary" className="absolute top-4 right-4">
        {category}
      </Badge>
    </div>
  );
}