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
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich, creamy tomato-based curry sauce',
    category: 'Dinner',
    prepTime: 30,
    cookTime: 45,
    difficulty: 'Medium',
    rating: 4.9,
    image: '/api/placeholder/800/600',
  },
  {
    id: '3',
    title: 'Overnight Oats',
    description: 'Healthy breakfast oats with chia seeds, berries, and honey',
    category: 'Breakfast',
    prepTime: 10,
    cookTime: 0,
    difficulty: 'Easy',
    rating: 4.5,
    image: '/api/placeholder/800/600',
  },
  {
    id: '4',
    title: 'Beef Wellington',
    description: 'Tender beef fillet wrapped in mushroom duxelles and flaky puff pastry',
    category: 'Dinner',
    prepTime: 60,
    cookTime: 45,
    difficulty: 'Hard',
    rating: 4.7,
    image: '/api/placeholder/800/600',
  },
  {
    id: '5',
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta, olives, and olive oil dressing',
    category: 'Lunch',
    prepTime: 15,
    cookTime: 0,
    difficulty: 'Easy',
    rating: 4.6,
    image: '/api/placeholder/800/600',
  },
  {
    id: '6',
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate dessert with a gooey molten center',
    category: 'Dessert',
    prepTime: 20,
    cookTime: 12,
    difficulty: 'Medium',
    rating: 4.9,
    image: '/api/placeholder/800/600',
  },
  {
    id: '7',
    title: 'Sushi Roll Platter',
    description: 'Assorted sushi rolls with fresh fish, vegetables, and sushi rice',
    category: 'Dinner',
    prepTime: 45,
    cookTime: 30,
    difficulty: 'Hard',
    rating: 4.8,
    image: '/api/placeholder/800/600',
  },
  {
    id: '8',
    title: 'Breakfast Burrito',
    description: 'Hearty morning wrap with eggs, cheese, potatoes, and salsa',
    category: 'Breakfast',
    prepTime: 15,
    cookTime: 15,
    difficulty: 'Medium',
    rating: 4.7,
    image: '/api/placeholder/800/600',
  },
  {
    id: '9',
    title: 'Vietnamese Pho',
    description: 'Traditional beef noodle soup with herbs and rice noodles',
    category: 'Dinner',
    prepTime: 40,
    cookTime: 180,
    difficulty: 'Medium',
    rating: 4.9,
    image: '/api/placeholder/800/600',
  },
  {
    id: '10',
    title: 'Quinoa Buddha Bowl',
    description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing',
    category: 'Lunch',
    prepTime: 25,
    cookTime: 20,
    difficulty: 'Easy',
    rating: 4.6,
    image: '/api/placeholder/800/600',
  },
  {
    id: '11',
    title: 'Apple Pie',
    description: 'Classic American dessert with spiced apples in a flaky crust',
    category: 'Dessert',
    prepTime: 45,
    cookTime: 50,
    difficulty: 'Medium',
    rating: 4.8,
    image: '/api/placeholder/800/600',
  }
];


export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/login');
  }

  try {
    // Handle auth callback
    return NextResponse.redirect('/');
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect('/login?error=callback_failed');
  }
}
