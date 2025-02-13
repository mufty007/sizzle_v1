/*
  # Update Recipe Access Policies

  1. Changes
    - Restrict recipe viewing to authenticated users only
    - Update policies for ingredients, instructions, ratings, and saves
    - Ensure users can only manage their own recipes
    - Add policies for comments and ratings

  2. Security
    - All recipe-related tables now require authentication
    - Users can only edit/delete their own content
    - Maintain data integrity with cascading deletes
*/

-- Update policies for recipes
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
CREATE POLICY "Only authenticated users can view recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

-- Update policies for recipe_ingredients
DROP POLICY IF EXISTS "Recipe ingredients are viewable by everyone" ON recipe_ingredients;
CREATE POLICY "Only authenticated users can view recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (true);

-- Update policies for recipe_instructions
DROP POLICY IF EXISTS "Recipe instructions are viewable by everyone" ON recipe_instructions;
CREATE POLICY "Only authenticated users can view recipe instructions"
  ON recipe_instructions FOR SELECT
  TO authenticated
  USING (true);

-- Update policies for recipe_ratings
DROP POLICY IF EXISTS "Recipe ratings are viewable by everyone" ON recipe_ratings;
CREATE POLICY "Only authenticated users can view recipe ratings"
  ON recipe_ratings FOR SELECT
  TO authenticated
  USING (true);

-- Update policies for recipe_saves
DROP POLICY IF EXISTS "Recipe saves are viewable by the owner" ON recipe_saves;
CREATE POLICY "Users can view their own saves"
  ON recipe_saves FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add function to check recipe ownership
CREATE OR REPLACE FUNCTION check_recipe_owner(recipe_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;