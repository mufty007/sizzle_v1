import { ChefHat, Search, Users } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Expert Recipes",
    description: "Curated recipes from professional chefs and home cooks."
  },
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Find recipes by ingredients, category, or cuisine type."
  },
  {
    icon: Users,
    title: "Community",
    description: "Share, rate, and discuss recipes with fellow food lovers."
  }
] as const;

export function Features() {
  return (
    <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative overflow-hidden rounded-xl border bg-card p-6"
          >
            <div className="flex flex-col gap-4">
              <feature.icon className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-primary">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}