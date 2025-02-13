/*
  # Complete Recipe Application Schema
  
  1. Tables
    - recipes: Main recipe information
    - recipe_ingredients: Recipe ingredients
    - recipe_instructions: Recipe instructions
    - recipe_ratings: User ratings and comments
    - recipe_saves: User saved recipes
  
  2. Security
    - RLS policies for authenticated access
    - Prevent self-rating of recipes
    - Prevent duplicate ratings/saves
  
  3. Functions
    - Recipe ownership check
    - Rating calculations
    - User interaction checks
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS recipe_saves CASCADE;
DROP TABLE IF EXISTS recipe_ratings CASCADE;
DROP TABLE IF EXISTS recipe_instructions CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  prep_time integer NOT NULL CHECK (prep_time >= 0),
  cook_time integer NOT NULL CHECK (cook_time >= 0),
  difficulty text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  amount numeric,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_instructions table
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, step_number)
);

-- Create recipe_ratings table
CREATE TABLE recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- Create recipe_saves table
CREATE TABLE recipe_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_saves ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Triggers
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Policies for recipes
CREATE POLICY "Only authenticated users can view recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recipe_ingredients
CREATE POLICY "Only authenticated users can view ingredients"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage ingredients for own recipes"
  ON recipe_ingredients FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Policies for recipe_instructions
CREATE POLICY "Only authenticated users can view instructions"
  ON recipe_instructions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage instructions for own recipes"
  ON recipe_instructions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Policies for recipe_ratings
CREATE POLICY "Only authenticated users can view ratings"
  ON recipe_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users cannot rate their own recipes"
  ON recipe_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can only rate a recipe once"
  ON recipe_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipe_ratings
      WHERE recipe_ratings.recipe_id = recipe_id
      AND recipe_ratings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own ratings"
  ON recipe_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON recipe_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recipe_saves
CREATE POLICY "Users can view own saved recipes"
  ON recipe_saves FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only save a recipe once"
  ON recipe_saves FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM recipe_saves
      WHERE recipe_saves.recipe_id = recipe_id
      AND recipe_saves.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can unsave recipes"
  ON recipe_saves FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_instructions_recipe_id ON recipe_instructions(recipe_id);
CREATE INDEX idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_ratings_user_id ON recipe_ratings(user_id);
CREATE INDEX idx_recipe_saves_recipe_id ON recipe_saves(recipe_id);
CREATE INDEX idx_recipe_saves_user_id ON recipe_saves(user_id);