"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function RecipeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-10 text-center space-y-4">
      <div className="flex justify-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        {error.message || "Failed to load recipes. Please try again."}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}