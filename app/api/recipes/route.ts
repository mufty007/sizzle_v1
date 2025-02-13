import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { recipeSchema } from '@/lib/validation/recipe';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = recipeSchema.parse(body);

    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert({
        user_id: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        prep_time: validatedData.prepTime,
        cook_time: validatedData.cookTime,
        difficulty: validatedData.difficulty,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert ingredients
    if (validatedData.ingredients.length > 0) {
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(
          validatedData.ingredients.map(ingredient => ({
            recipe_id: recipe.id,
            ingredient,
          }))
        );

      if (ingredientsError) throw ingredientsError;
    }

    // Insert instructions
    if (validatedData.instructions.length > 0) {
      const { error: instructionsError } = await supabase
        .from('recipe_instructions')
        .insert(
          validatedData.instructions.map((instruction, index) => ({
            recipe_id: recipe.id,
            step_number: index + 1,
            instruction,
          }))
        );

      if (instructionsError) throw instructionsError;
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}