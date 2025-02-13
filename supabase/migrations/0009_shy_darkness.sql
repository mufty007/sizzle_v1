/*
  # Update Recipe Policies and Functions
  
  1. Updates
    - Add missing policies for recipe management
    - Add trigger for updated_at timestamp
    - Add function for average rating calculation
  
  2. Security
    - Strengthen RLS policies
    - Add helper functions for permission checks
*/

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for recipes table
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate average rating
CREATE OR REPLACE FUNCTION get_recipe_average_rating(recipe_id uuid)
RETURNS numeric AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(rating)::numeric(3,2), 0)
    FROM recipe_ratings
    WHERE recipe_ratings.recipe_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has rated recipe
CREATE OR REPLACE FUNCTION has_user_rated_recipe(recipe_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM recipe_ratings
    WHERE recipe_ratings.recipe_id = $1
    AND recipe_ratings.user_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has saved recipe
CREATE OR REPLACE FUNCTION has_user_saved_recipe(recipe_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM recipe_saves
    WHERE recipe_saves.recipe_id = $1
    AND recipe_saves.user_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy to prevent users from rating their own recipes
DROP POLICY IF EXISTS "Users cannot rate their own recipes" ON recipe_ratings;
CREATE POLICY "Users cannot rate their own recipes"
  ON recipe_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

-- Add policy to prevent multiple ratings from same user
DROP POLICY IF EXISTS "Users can only rate a recipe once" ON recipe_ratings;
CREATE POLICY "Users can only rate a recipe once"
  ON recipe_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipe_ratings
      WHERE recipe_ratings.recipe_id = recipe_id
      AND recipe_ratings.user_id = auth.uid()
    )
  );

-- Add policy to prevent multiple saves of the same recipe
DROP POLICY IF EXISTS "Users can only save a recipe once" ON recipe_saves;
CREATE POLICY "Users can only save a recipe once"
  ON recipe_saves
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipe_saves
      WHERE recipe_saves.recipe_id = recipe_id
      AND recipe_saves.user_id = auth.uid()
    )
  );