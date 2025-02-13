// Simulated API function - would be replaced with real API calls
export async function getRecipes() {
  return Promise.resolve([
    {
      id: "1",
      title: "Classic Pancakes",
      description: "Fluffy and delicious breakfast pancakes",
      category: "Breakfast",
      prepTime: 10,
      cookTime: 20,
      difficulty: "Easy",
      rating: 4.5,
    },
    {
      id: "2",
      title: "Spaghetti Carbonara",
      description: "Traditional Italian pasta dish",
      category: "Dinner",
      prepTime: 15,
      cookTime: 25,
      difficulty: "Medium",
      rating: 4.8,
    },
  ]);
}