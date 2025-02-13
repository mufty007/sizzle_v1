import Link from "next/link";
import { Button } from "../ui/button";
import { ChefHat } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ChefHat className="h-12 w-12 mx-auto mb-6 opacity-90" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Join our community of food enthusiasts and share your favorite recipes with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link href="/register">Join Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}