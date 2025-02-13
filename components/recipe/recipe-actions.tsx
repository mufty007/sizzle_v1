"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark, Heart, Share } from "lucide-react";
import { useRecipe } from "@/lib/hooks/use-recipe";

interface RecipeActionsProps {
  recipeId: string;
}

export function RecipeActions({ recipeId }: RecipeActionsProps) {
  const { toast } = useToast();
  const { toggleSave, isSaved } = useRecipe();
  const [isLiked, setIsLiked] = useState(false);

  const handleSave = () => {
    toggleSave(recipeId);
    toast({
      title: isSaved(recipeId) ? "Recipe removed" : "Recipe saved",
      description: isSaved(recipeId)
        ? "Recipe removed from your collection"
        : "Recipe added to your collection",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Like removed" : "Recipe liked",
      description: isLiked
        ? "You've removed your like"
        : "Thanks for liking this recipe!",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check out this recipe!",
        url: window.location.href,
      });
    } catch {
      toast({
        title: "Link copied",
        description: "Recipe link copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isSaved(recipeId) ? "default" : "outline"}
        size="icon"
        onClick={handleSave}
        className={`
          backdrop-blur-sm transition-all duration-200
          ${isSaved(recipeId) 
            ? "bg-gradient-to-r from-primary/90 to-primary/70 hover:from-primary hover:to-primary/80 text-primary-foreground border-0" 
            : "bg-white/10 hover:bg-white/20 border-white/20"}
        `}
      >
        <Bookmark
          className={`h-5 w-5 ${isSaved(recipeId) ? "fill-current" : ""}`}
        />
      </Button>
      <Button
        variant={isLiked ? "default" : "outline"}
        size="icon"
        onClick={handleLike}
        className={`
          backdrop-blur-sm transition-all duration-200
          ${isLiked 
            ? "bg-gradient-to-r from-primary/90 to-primary/70 hover:from-primary hover:to-primary/80 text-primary-foreground border-0" 
            : "bg-white/10 hover:bg-white/20 border-white/20"}
        `}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleShare}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
      >
        <Share className="h-5 w-5" />
      </Button>
    </div>
  );
}