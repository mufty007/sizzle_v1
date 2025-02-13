"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SavedRecipes } from "@/components/profile/saved-recipes";
import { SharedRecipes } from "@/components/profile/shared-recipes";
import { AccountSettings } from "@/components/profile/account-settings";
import { useAuth } from "@/lib/auth/context";
import { BookmarkIcon, ChefHat, Settings } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirectTo=/profile');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-muted/30">
        <ProfileHeader user={user} />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
          <div className="bg-card rounded-xl border shadow-lg">
            <Tabs defaultValue="saved" className="w-full">
              <div className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container flex-1 overflow-auto">
                  <TabsList className="inline-flex h-16 items-center justify-center gap-6 rounded-none border-b border-b-transparent bg-transparent p-0">
                    <TabsTrigger 
                      value="saved"
                      className="group inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 border-b-transparent px-4 py-4 text-sm font-medium ring-offset-background transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary data-[state=active]:text-primary"
                    >
                      <BookmarkIcon className="h-4 w-4 opacity-50 group-data-[state=active]:opacity-100" />
                      Saved Recipes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shared"
                      className="group inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 border-b-transparent px-4 py-4 text-sm font-medium ring-offset-background transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary data-[state=active]:text-primary"
                    >
                      <ChefHat className="h-4 w-4 opacity-50 group-data-[state=active]:opacity-100" />
                      My Recipes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings"
                      className="group inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 border-b-transparent px-4 py-4 text-sm font-medium ring-offset-background transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary data-[state=active]:text-primary"
                    >
                      <Settings className="h-4 w-4 opacity-50 group-data-[state=active]:opacity-100" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <TabsContent value="saved" className="mt-0 space-y-8">
                  <SavedRecipes />
                </TabsContent>

                <TabsContent value="shared" className="mt-0 space-y-8">
                  <SharedRecipes />
                </TabsContent>

                <TabsContent value="settings" className="mt-0 space-y-8">
                  <AccountSettings user={user} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}