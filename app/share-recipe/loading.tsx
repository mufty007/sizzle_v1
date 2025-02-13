import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShareRecipeLoading() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-primary/10">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}