import { User } from "@/lib/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UtensilsCrossed } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/5" />
      
      {/* Content */}
      <div className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="p-3 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
            </div>
            
            {/* Avatar */}
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl ring-2 ring-primary/10">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
                className="bg-background"
              />
              <AvatarFallback className="text-4xl">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {user.username}
              </h1>
              <p className="text-muted-foreground text-lg">
                {user.email}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Member since {new Date().getFullYear()}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>0 recipes shared</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>0 recipes saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}