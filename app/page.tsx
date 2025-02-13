import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Features } from "@/components/home/features";
import { FeaturedRecipes } from "@/components/home/featured-recipes";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { FAQ } from "@/components/home/faq";
import { Footer } from "@/components/footer";
import { mockRecipes } from "@/lib/data/mock-recipes";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 py-16 lg:py-24">
        <div className="container max-w-[64rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Discover & Share Your{" "}
              <span className="text-primary">Favorite Recipes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem]">
              Join our community of food enthusiasts. Find inspiration, share your culinary creations, and connect with fellow cooking lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/recipes">Browse Recipes</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/submit">Share Recipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <FeaturedRecipes recipes={mockRecipes} />
      <Testimonials />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
}