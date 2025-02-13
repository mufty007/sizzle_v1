"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  query: z.string(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function RecipeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("q") || "",
    },
  });

  function onSubmit(data: SearchFormData) {
    const params = new URLSearchParams();
    if (data.query) {
      params.set("q", data.query);
    }
    router.push(`/discover?${params.toString()}`);
  }

  return (
    <div className="bg-card border rounded-lg p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search recipes..."
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
    </div>
  );
}