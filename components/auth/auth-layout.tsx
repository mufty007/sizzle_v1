import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-muted/20 py-12 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/5 pointer-events-none" />
      <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative w-full max-w-md mx-auto p-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Sizzle
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="relative">
          {/* Card background with blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/2.5 rounded-2xl backdrop-blur-xl" />
          
          {/* Card content */}
          <div className="relative bg-white/80 dark:bg-gray-950/80 rounded-2xl shadow-2xl shadow-black/5 border border-white/20 dark:border-white/10 p-8">
            <div className="flex flex-col space-y-2 text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}