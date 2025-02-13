import { Recipe } from "@/lib/types/recipe";

const SPOONACULAR_API_KEY = "6495bda0671d4190a23aaafb736b9669";
const BASE_URL = "https://api.spoonacular.com/recipes";

// Add caching to prevent excessive API calls
const cache = new Map<string, { data: Recipe[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback data in case API fails
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    description: "A traditional Italian pizza with fresh basil, mozzarella, and tomatoes",
    category: "Dinner",
    prepTime: 20,
    cookTime: 15,
    difficulty: "Medium",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&auto=format&fit=crop",
    ingredients: [
      "1 pizza dough",
      "200g fresh mozzarella",
      "Fresh basil leaves",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Preheat oven to 450°F",
      "Roll out pizza dough",
      "Add toppings",
      "Bake for 12-15 minutes"
    ],
    comments: []
  },
  // ... (keep other fallback recipes)
];

export async function fetchRecipes(query: string = "", offset: number = 0): Promise<Recipe[]> {
  try {
    const cacheKey = `${query}-${offset}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query: query,
      offset: offset.toString(),
      number: "12",
      addRecipeInformation: "true",
      fillIngredients: "true",
      instructionsRequired: "true",
      sort: "popularity"
    });

    const response = await fetch(`${BASE_URL}/complexSearch?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 402) {
        console.warn('API quota exceeded, using fallback data');
        return filterFallbackRecipes(query);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results?.length) {
      return [];
    }

    const recipes = data.results.map(mapApiRecipeToRecipe);

    // Cache the results
    cache.set(cacheKey, { data: recipes, timestamp: Date.now() });
    
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return filterFallbackRecipes(query);
  }
}

export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      addRecipeInformation: "true",
      fillIngredients: "true",
    });

    const response = await fetch(`${BASE_URL}/${id}/information?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return mapApiRecipeToRecipe(data);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    return null;
  }
}

function mapApiRecipeToRecipe(apiRecipe: any): Recipe {
  return {
    id: apiRecipe.id.toString(),
    title: apiRecipe.title,
    description: apiRecipe.summary 
      ? apiRecipe.summary.replace(/<[^>]*>/g, '').slice(0, 200) + '...' 
      : 'No description available',
    category: apiRecipe.dishTypes?.[0]?.charAt(0).toUpperCase() + apiRecipe.dishTypes[0]?.slice(1) || 'Main Course',
    prepTime: apiRecipe.preparationMinutes || Math.floor(apiRecipe.readyInMinutes / 2) || 15,
    cookTime: apiRecipe.cookingMinutes || Math.floor(apiRecipe.readyInMinutes / 2) || 30,
    difficulty: getDifficulty(apiRecipe),
    rating: Math.min(5, Math.max(0, (apiRecipe.spoonacularScore / 20) || 4.5)),
    image: apiRecipe.image || `https://source.unsplash.com/800x600/?food,${encodeURIComponent(apiRecipe.title)}`,
    ingredients: apiRecipe.extendedIngredients?.map((ing: any) => 
      `${ing.amount} ${ing.unit} ${ing.name}`
    ) || [],
    instructions: apiRecipe.analyzedInstructions?.[0]?.steps?.map((step: any) => 
      step.step
    ) || [],
    comments: []
  };
}

function getDifficulty(recipe: any): "Easy" | "Medium" | "Hard" {
  const readyInMinutes = recipe.readyInMinutes || 0;
  const ingredients = recipe.extendedIngredients?.length || 0;
  const steps = recipe.analyzedInstructions?.[0]?.steps?.length || 0;
  
  if (readyInMinutes > 60 || ingredients > 10 || steps > 8) {
    return "Hard";
  } else if (readyInMinutes > 30 || ingredients > 5 || steps > 4) {
    return "Medium";
  }
  return "Easy";
}

function filterFallbackRecipes(query: string): Recipe[] {
  if (!query) return FALLBACK_RECIPES;
  
  const searchTerm = query.toLowerCase();
  return FALLBACK_RECIPES.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm) ||
    recipe.description.toLowerCase().includes(searchTerm) ||
    recipe.category.toLowerCase().includes(searchTerm)
  );
}