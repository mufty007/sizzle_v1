import { Recipe } from "@/lib/types/recipe";

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    description: "A traditional Italian pizza with fresh basil, mozzarella, and tomatoes. Perfect for a family dinner.",
    category: "Dinner",
    prepTime: 20,
    cookTime: 15,
    difficulty: "Medium",
    rating: 4.8,
    ingredients: [
      "1 pizza dough ball",
      "200g fresh mozzarella",
      "Fresh basil leaves",
      "2 tablespoons olive oil",
      "3 ripe tomatoes",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 450°F with pizza stone inside",
      "Roll out pizza dough on floured surface",
      "Top with sliced tomatoes and mozzarella",
      "Bake for 12-15 minutes until crust is golden",
      "Add fresh basil leaves and drizzle with olive oil"
    ],
    comments: [
      {
        id: "c1",
        userId: "u1",
        username: "PizzaLover",
        content: "Perfect recipe! The crust came out amazing.",
        rating: 5,
        createdAt: "2024-03-15T10:30:00Z"
      },
      {
        id: "c2",
        userId: "u2",
        username: "ChefMaria",
        content: "Simple and delicious. I added some garlic powder too.",
        rating: 4,
        createdAt: "2024-03-14T15:45:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy cookies loaded with melted chocolate chips. A classic favorite that's perfect for any occasion.",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    difficulty: "Easy",
    rating: 4.9,
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 cup butter, softened",
      "3/4 cup sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 cups chocolate chips",
      "1 tsp vanilla extract",
      "1 tsp baking soda"
    ],
    instructions: [
      "Cream butter and sugars until fluffy",
      "Beat in eggs and vanilla",
      "Mix in dry ingredients",
      "Fold in chocolate chips",
      "Drop spoonfuls onto baking sheet",
      "Bake at 375°F for 10-12 minutes"
    ],
    comments: [
      {
        id: "c3",
        userId: "u3",
        username: "CookieMaster",
        content: "Best cookie recipe ever! So easy to make.",
        rating: 5,
        createdAt: "2024-03-16T14:20:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Fresh Summer Salad",
    description: "A light and refreshing salad with mixed greens, seasonal fruits, and a homemade vinaigrette.",
    category: "Lunch",
    prepTime: 15,
    cookTime: 0,
    difficulty: "Easy",
    rating: 4.7,
    ingredients: [
      "Mixed salad greens",
      "Cherry tomatoes",
      "Cucumber",
      "Avocado",
      "Red onion",
      "Balsamic vinaigrette",
      "Feta cheese",
      "Pine nuts"
    ],
    instructions: [
      "Wash and dry all produce",
      "Slice vegetables",
      "Combine ingredients in a large bowl",
      "Toss with vinaigrette",
      "Top with cheese and nuts"
    ],
    comments: [
      {
        id: "c4",
        userId: "u4",
        username: "HealthyEats",
        content: "So fresh and delicious! Perfect for summer.",
        rating: 5,
        createdAt: "2024-03-17T09:15:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop"
  }
];