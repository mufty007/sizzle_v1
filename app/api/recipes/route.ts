import { NextResponse } from 'next/server';

// Mock data for recipes
const mockRecipes = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh basil, mozzarella, and tomatoes',
    category: 'Dinner',
    prepTime: 20,
    cookTime: 15,
    difficulty: 'Medium',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&auto=format&fit=crop',
  },
  // Add more mock recipes as needed
];

export async function GET() {
  return NextResponse.json(mockRecipes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Mock creating a new recipe
    const newRecipe = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}