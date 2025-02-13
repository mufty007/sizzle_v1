import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeLoading() {
  return (
    <div className="min-h-screen">
      <div className="relative min-h-[600px] bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-4 max-w-3xl">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}