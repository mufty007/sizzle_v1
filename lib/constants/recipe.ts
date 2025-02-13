export const CATEGORIES = [
  "Morning meal",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Category = typeof CATEGORIES[number];
export type Difficulty = typeof DIFFICULTIES[number];