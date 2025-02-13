export const CATEGORIES = [
  "Morning meal",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const CUISINES = [
  "Italian",
  "Nigerian",
  "Middle Eastern",
  "Chinese",
  "Japanese",
  "Indian",
  "Mexican",
  "Thai",
  "French",
  "Mediterranean",
] as const;

export type Category = typeof CATEGORIES[number];
export type Difficulty = typeof DIFFICULTIES[number];
export type Cuisine = typeof CUISINES[number];