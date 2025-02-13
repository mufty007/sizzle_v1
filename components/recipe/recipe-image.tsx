import Image from "next/image";
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
      <div className="relative w-full h-full">
        <Image
          src={image || DEFAULT_RECIPE_IMAGE}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <Badge variant="secondary" className="absolute top-4 right-4">
        {category}
      </Badge>
    </div>
  );
}