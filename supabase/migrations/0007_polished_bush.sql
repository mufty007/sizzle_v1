/*
  # Update RecipeVerse Security Policies

  This migration adds or updates security policies without recreating existing tables.
  
  1. Updates
    - Additional security policies
    - Missing indexes
    - Helper functions
  
  2. Changes
    - Only modifies policies and functions
    - No table creation/modification
*/

-- Update or add missing policies for recipes if they don't exist
DO $$ BEGIN
  -- Recipes policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recipes' AND policyname = 'Only authenticated users can view recipes'
  ) THEN
    CREATE POLICY "Only authenticated users can view recipes"
      ON recipes FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Recipe ingredients policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recipe_ingredients' AND policyname = 'Only authenticated users can view ingredients'
  ) THEN
    CREATE POLICY "Only authenticated users can view ingredients"
      ON recipe_ingredients FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Recipe instructions policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recipe_instructions' AND policyname = 'Only authenticated users can view instructions'
  ) THEN
    CREATE POLICY "Only authenticated users can view instructions"
      ON recipe_instructions FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Recipe ratings policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recipe_ratings' AND policyname = 'Only authenticated users can view ratings'
  ) THEN
    CREATE POLICY "Only authenticated users can view ratings"
      ON recipe_ratings FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Add helper function if it doesn't exist
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

-- Create missing indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_user_id'
  ) THEN
    CREATE INDEX idx_recipes_user_id ON recipes(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_category'
  ) THEN
    CREATE INDEX idx_recipes_category ON recipes(category);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipe_ratings_recipe_id'
  ) THEN
    CREATE INDEX idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipe_saves_user_id'
  ) THEN
    CREATE INDEX idx_recipe_saves_user_id ON recipe_saves(user_id);
  END IF;
END $$;