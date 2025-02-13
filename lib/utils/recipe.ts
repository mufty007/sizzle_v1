import { Recipe } from "@/lib/types/recipe";

export function getRecipeById(id: string, recipes: Recipe[]): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function formatCookingTime(prepTime: number, cookTime: number): string {
  const totalTime = prepTime + cookTime;
  return `${totalTime} mins`;
}

export function calculateAverageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / ratings.length).toFixed(1));
}

export function scaleIngredient(ingredient: string, scale: number): string {
  // Regular expression to match numbers (including decimals) at the start of the string
  const numberRegex = /^(\d*\.?\d+)\s*/;
  const match = ingredient.match(numberRegex);

  if (match) {
    const originalAmount = parseFloat(match[1]);
    const scaledAmount = (originalAmount * scale).toFixed(2).replace(/\.?0+$/, '');
    return ingredient.replace(numberRegex, `${scaledAmount} `);
  }

  return ingredient;
}

export function scaleInstructions(instruction: string, scale: number): string {
  // Regular expression to match numbers followed by units
  const numberRegex = /(\d*\.?\d+)\s*(cup|cups|tablespoon|tablespoons|teaspoon|teaspoons|pound|pounds|ounce|ounces|gram|grams|ml|g|oz|lb|tbsp|tsp)/gi;
  
  return instruction.replace(numberRegex, (match, number, unit) => {
    const scaledNumber = (parseFloat(number) * scale).toFixed(2).replace(/\.?0+$/, '');
    return `${scaledNumber} ${unit}`;
  });
}