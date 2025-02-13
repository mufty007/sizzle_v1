"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { RecipeForm } from "@/components/recipe/recipe-form";
import { RecipeFormHeader } from "@/components/recipe/recipe-form-header";
import { useAuth } from "@/lib/auth/context";

export default function ShareRecipePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirectTo=/share-recipe');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-primary/10">
          <RecipeFormHeader />
          <div className="p-6">
            <RecipeForm />
          </div>
        </Card>
      </div>
    </div>
  );
}