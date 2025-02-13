/*
  # Recipe Management Schema

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `prep_time` (integer)
      - `cook_time` (integer)
      - `difficulty` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recipe_ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `ingredient` (text)
      - `amount` (text)
      - `unit` (text)

    - `recipe_instructions`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `step_number` (integer)
      - `instruction` (text)

    - `recipe_ratings`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  prep_time integer NOT NULL,
  cook_time integer NOT NULL,
  difficulty text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  amount text,
  unit text
);

-- Create recipe_instructions table
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL
);

-- Create recipe_ratings table
CREATE TABLE recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Policies for recipes
CREATE POLICY "Anyone can read recipes"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recipe_ingredients
CREATE POLICY "Anyone can read recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage ingredients for their recipes"
  ON recipe_ingredients FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Policies for recipe_instructions
CREATE POLICY "Anyone can read recipe instructions"
  ON recipe_instructions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage instructions for their recipes"
  ON recipe_instructions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Policies for recipe_ratings
CREATE POLICY "Anyone can read recipe ratings"
  ON recipe_ratings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can rate recipes"
  ON recipe_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON recipe_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON recipe_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);