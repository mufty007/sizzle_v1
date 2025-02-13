"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { navigationLinks } from "./nav-links";
import { useAuth } from "@/lib/auth/hooks";
import { signOut } from "@/lib/auth/auth-service";

interface MobileNavProps {
  onClose?: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose?.();
  };

  return (
    <ScrollArea className="h-full pb-6">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col space-y-3">
          {navigationLinks.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onClose}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link href="/recipes/saved">Saved Recipes</Link>
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90" asChild onClick={onClose}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center mt-4 pt-4 border-t">
            <span className="text-sm font-medium mr-2">Theme:</span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}