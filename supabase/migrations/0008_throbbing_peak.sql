/*
  # Create RecipeVerse Schema
  
  1. Tables
    - recipes (main recipe information)
    - recipe_ingredients (ingredients for each recipe)
    - recipe_instructions (step-by-step instructions)
    - recipe_ratings (user ratings and comments)
    - recipe_saves (saved recipes by users)
  
  2. Security
    - RLS enabled on all tables
    - Policies for authenticated access
    - Owner-based permissions
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
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
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  amount numeric,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_instructions table
CREATE TABLE IF NOT EXISTS recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, step_number)
);

-- Create recipe_ratings table
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- Create recipe_saves table
CREATE TABLE IF NOT EXISTS recipe_saves (
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

-- Create policies for recipes
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

-- Create policies for recipe_ingredients
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

-- Create policies for recipe_instructions
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

-- Create policies for recipe_ratings
CREATE POLICY "Only authenticated users can view ratings"
  ON recipe_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can rate recipes"
  ON recipe_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON recipe_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON recipe_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for recipe_saves
CREATE POLICY "Users can view own saved recipes"
  ON recipe_saves FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can save recipes"
  ON recipe_saves FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave recipes"
  ON recipe_saves FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create helper function
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_recipe_id ON recipe_instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_user_id ON recipe_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_saves_recipe_id ON recipe_saves(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_saves_user_id ON recipe_saves(user_id);