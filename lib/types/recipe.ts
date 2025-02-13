import { Category, Difficulty } from "@/lib/constants/recipe";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: Category;
  prepTime: number;
  cookTime: number;
  difficulty: Difficulty;
  rating: number;
  ingredients: string[];
  instructions: string[];
  comments: Comment[];
  image?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}