"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during initial mount or while loading
  if (!mounted || isLoading) {
    return null;
  }

  // If user is authenticated, render the children
  if (user) {
    return children;
  }

  // If fallback is provided, render it instead of the default login prompt
  if (fallback) {
    return fallback;
  }

  // Default login prompt
  return (
    <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Sign in to continue</h3>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view this content
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link href={`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`}>
                Sign In
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}