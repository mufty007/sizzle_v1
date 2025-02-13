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
    cuisine: "Italian",
    servings: 4,
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
      }
    ],
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Jollof Rice",
    description: "A flavorful Nigerian rice dish cooked in a rich tomato sauce with aromatic spices. A staple at celebrations and gatherings.",
    category: "Dinner",
    prepTime: 30,
    cookTime: 45,
    difficulty: "Medium",
    rating: 4.9,
    cuisine: "Nigerian",
    servings: 6,
    ingredients: [
      "3 cups long-grain rice",
      "6 large tomatoes",
      "2 red bell peppers",
      "3 scotch bonnet peppers",
      "2 large onions",
      "4 tablespoons tomato paste",
      "3 cloves garlic",
      "2-inch ginger piece",
      "1/2 cup vegetable oil",
      "2 bay leaves",
      "1 tablespoon curry powder",
      "1 tablespoon thyme",
      "3 stock cubes",
      "Salt to taste"
    ],
    instructions: [
      "Blend tomatoes, peppers, onions, garlic, and ginger until smooth",
      "Heat oil and fry blended mixture for 15-20 minutes",
      "Add tomato paste and spices, cook for 5 minutes",
      "Add washed rice and stock, stir well",
      "Cover and cook on low heat for 30 minutes",
      "Stir occasionally to prevent burning",
      "Steam for final 5 minutes and fluff with fork"
    ],
    comments: [
      {
        id: "c5",
        userId: "u5",
        username: "NigerianFoodie",
        content: "Authentic recipe! Tastes just like my mom's.",
        rating: 5,
        createdAt: "2024-03-18T16:45:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Egusi Soup",
    description: "Traditional Nigerian soup made with ground melon seeds, leafy vegetables, and assorted meat. Best served with pounded yam or fufu.",
    category: "Dinner",
    prepTime: 40,
    cookTime: 90,
    difficulty: "Medium",
    rating: 4.8,
    cuisine: "Nigerian",
    servings: 8,
    ingredients: [
      "2 cups ground egusi (melon seeds)",
      "2 pounds assorted meat (goat, beef, tripe)",
      "1 pound stockfish",
      "2 cups pumpkin leaves (ugu)",
      "1 cup waterleaf",
      "2 onions",
      "3 scotch bonnet peppers",
      "Palm oil",
      "Stock cubes",
      "Salt to taste",
      "Locust beans (optional)"
    ],
    instructions: [
      "Cook assorted meat and stockfish until tender",
      "Heat palm oil in pot until hot",
      "Add chopped onions and ground peppers",
      "Mix egusi with water to form paste",
      "Add egusi mixture in chunks",
      "Add meat stock and cook for 20 minutes",
      "Add vegetables and simmer for 10 minutes",
      "Season to taste"
    ],
    comments: [
      {
        id: "c6",
        userId: "u6",
        username: "AfricanChef",
        content: "The perfect egusi soup recipe! Don't skip the locust beans.",
        rating: 5,
        createdAt: "2024-03-19T13:20:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Suya",
    description: "Spicy grilled beef skewers coated in a unique blend of ground peanuts and spices. A popular Nigerian street food.",
    category: "Appetizer",
    prepTime: 30,
    cookTime: 15,
    difficulty: "Medium",
    rating: 4.9,
    cuisine: "Nigerian",
    servings: 4,
    ingredients: [
      "1 pound beef sirloin",
      "1 cup ground peanuts",
      "1 tablespoon cayenne pepper",
      "1 tablespoon paprika",
      "1 tablespoon garlic powder",
      "1 tablespoon ginger powder",
      "1 tablespoon onion powder",
      "Salt to taste",
      "Vegetable oil for basting",
      "Red onions and tomatoes for serving"
    ],
    instructions: [
      "Slice beef thinly against the grain",
      "Mix ground peanuts with all spices to make yaji",
      "Thread beef onto skewers",
      "Coat generously with suya spice mixture",
      "Let marinate for 30 minutes",
      "Grill on high heat, basting with oil",
      "Serve with sliced onions and tomatoes"
    ],
    comments: [
      {
        id: "c7",
        userId: "u7",
        username: "SuyaKing",
        content: "Perfect blend of spices! Tastes like Lagos street suya.",
        rating: 5,
        createdAt: "2024-03-20T19:30:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Moi Moi",
    description: "Steamed bean pudding made from peeled black-eyed peas, onions, and peppers. A nutritious Nigerian delicacy.",
    category: "Snack",
    prepTime: 60,
    cookTime: 45,
    difficulty: "Medium",
    rating: 4.7,
    cuisine: "Nigerian",
    servings: 8,
    ingredients: [
      "2 cups peeled black-eyed peas",
      "2 red bell peppers",
      "2 onions",
      "2 scotch bonnet peppers",
      "1/2 cup vegetable oil",
      "3 stock cubes",
      "Salt to taste",
      "Boiled eggs (optional)",
      "Canned sardines (optional)",
      "Banana leaves or aluminum foil"
    ],
    instructions: [
      "Soak and peel beans",
      "Blend beans with peppers and onions until smooth",
      "Add oil and seasonings",
      "Grease moi moi molds",
      "Pour mixture into molds",
      "Add boiled eggs or fish if desired",
      "Steam for 45 minutes",
      "Let cool slightly before serving"
    ],
    comments: [
      {
        id: "c8",
        userId: "u8",
        username: "MoiMoiLover",
        content: "So soft and fluffy! The banana leaves add great flavor.",
        rating: 5,
        createdAt: "2024-03-21T12:15:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Chicken Shawarma",
    description: "Middle Eastern-style wrap with marinated chicken, fresh vegetables, and garlic sauce.",
    category: "Lunch",
    prepTime: 30,
    cookTime: 25,
    difficulty: "Medium",
    rating: 4.8,
    cuisine: "Middle Eastern",
    servings: 4,
    ingredients: [
      "4 chicken breasts",
      "4 large pita breads",
      "2 tablespoons shawarma spice mix",
      "1 cup garlic sauce",
      "Lettuce",
      "Tomatoes",
      "Onions",
      "Pickles"
    ],
    instructions: [
      "Marinate chicken with spices for 2 hours",
      "Grill chicken until cooked through",
      "Slice chicken thinly",
      "Warm pita breads",
      "Assemble with vegetables and sauce"
    ],
    comments: [
      {
        id: "c9",
        userId: "u9",
        username: "ShawarmaFan",
        content: "Better than my local shawarma spot!",
        rating: 5,
        createdAt: "2024-03-22T18:40:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Pounded Yam and Egusi Soup",
    description: "Smooth, stretchy pounded yam served with rich egusi soup. A classic Nigerian combination.",
    category: "Dinner",
    prepTime: 45,
    cookTime: 100,
    difficulty: "Hard",
    rating: 4.9,
    cuisine: "Nigerian",
    servings: 6,
    ingredients: [
      "2 large yams",
      "Water for boiling",
      "Egusi soup ingredients (see separate recipe)",
      "Salt to taste"
    ],
    instructions: [
      "Peel and cut yam into chunks",
      "Boil until very soft",
      "Pound in a mortar until smooth",
      "Continue pounding until stretchy",
      "Shape into balls",
      "Serve hot with egusi soup"
    ],
    comments: [
      {
        id: "c10",
        userId: "u10",
        username: "YamLover",
        content: "Perfect texture! Just like at home.",
        rating: 5,
        createdAt: "2024-03-23T20:10:00Z"
      }
    ],
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop"
  }
];