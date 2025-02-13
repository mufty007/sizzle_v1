import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer"]),
  prepTime: z.number().min(1, "Preparation time is required"),
  cookTime: z.number().min(1, "Cooking time is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
  instructions: z.array(z.string()).min(1, "At least one instruction is required"),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;