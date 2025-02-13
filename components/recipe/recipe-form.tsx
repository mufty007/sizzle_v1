"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RecipeFormData, recipeSchema } from "@/lib/validation/recipe";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants/recipe";

export function RecipeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: CATEGORIES[0],
      prepTime: 15,
      cookTime: 30,
      difficulty: DIFFICULTIES[0],
      ingredients: [""],
      instructions: [""],
    },
  });

  async function onSubmit(data: RecipeFormData) {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit recipe");
      }

      toast({
        title: "Recipe submitted successfully",
        description: "Your recipe has been added to our collection.",
      });
      
      router.push("/recipes");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit recipe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const addListItem = (fieldName: "ingredients" | "instructions") => {
    const currentValue = form.getValues(fieldName);
    form.setValue(fieldName, [...currentValue, ""]);
  };

  const removeListItem = (index: number, fieldName: "ingredients" | "instructions") => {
    const currentValue = form.getValues(fieldName);
    if (currentValue.length > 1) {
      setShowConfirmDialog(true);
      if (showConfirmDialog) {
        form.setValue(
          fieldName,
          currentValue.filter((_, i) => i !== index)
        );
        setShowConfirmDialog(false);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Title</FormLabel>
                <FormControl>
                  <Input placeholder="Delicious Chocolate Cake" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief description of your recipe..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIFFICULTIES.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prep Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cookTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cook Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Ingredients</FormLabel>
            {form.watch("ingredients").map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`ingredients.${index}`}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder={`Ingredient ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeListItem(index, "ingredients")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addListItem("ingredients")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </Button>
          </div>

          <div className="space-y-4">
            <FormLabel>Instructions</FormLabel>
            {form.watch("instructions").map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`instructions.${index}`}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea {...field} placeholder={`Step ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeListItem(index, "instructions")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addListItem("instructions")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Step
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Recipe"}
          </Button>
        </form>
      </Form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogTitle>Remove Item</DialogTitle>
          <p>Are you sure you want to remove this item?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowConfirmDialog(false)}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}