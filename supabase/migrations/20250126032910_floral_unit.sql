/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with username and email
    - recipes: Recipe details and metadata
    - recipe_ingredients: Recipe ingredients with amounts
    - recipe_instructions: Ordered recipe steps
    - recipe_ratings: User ratings and comments
    - recipe_saves: User recipe bookmarks

  2. Functions
    - validate_username: Validates username format
    - is_username_available: Checks username availability
    - handle_new_user: Creates profile on user signup
    - update_updated_at: Updates timestamp on record changes

  3. Security
    - Row Level Security (RLS) policies for all tables
    - Secure function execution context
    - Proper permission grants
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL CHECK (
    char_length(username) >= 3 AND 
    char_length(username) <= 30 AND
    username ~ '^[a-zA-Z0-9_-]+$'
  ),
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  amount numeric,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_instructions table
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, step_number)
);

-- Create recipe_ratings table
CREATE TABLE recipe_ratings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- Create recipe_saves table
CREATE TABLE recipe_saves (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- Function to validate username format
CREATE OR REPLACE FUNCTION validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    username ~ '^[a-zA-Z0-9_-]+$' AND
    length(username) >= 3 AND
    length(username) <= 30
  );
END;
$$;

-- Function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT validate_username(username) THEN
    RETURN false;
  END IF;
  
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.username = username
  );
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  -- Get base username from metadata or email
  base_username := COALESCE(
    (NEW.raw_user_meta_data->>'username')::text,
    split_part(NEW.email, '@', 1)
  );
  
  -- Clean username
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g');
  
  -- Ensure minimum length
  IF length(base_username) < 3 THEN
    base_username := 'user_' || substr(NEW.id::text, 1, 8);
  END IF;

  -- Find unique username
  final_username := base_username;
  WHILE EXISTS (
    SELECT 1 FROM profiles WHERE username = final_username
  ) AND counter < 100 LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  -- If still not unique, use UUID-based username
  IF EXISTS (SELECT 1 FROM profiles WHERE username = final_username) THEN
    final_username := 'user_' || substr(gen_random_uuid()::text, 1, 8);
  END IF;

  -- Create profile
  BEGIN
    INSERT INTO profiles (id, username, email)
    VALUES (NEW.id, final_username, NEW.email);
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    -- Final fallback with UUID
    INSERT INTO profiles (id, username, email)
    VALUES (
      NEW.id,
      'user_' || substr(NEW.id::text, 1, 8),
      NEW.email
    );
  END;

  RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_saves ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Recipes
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
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

-- Recipe Ingredients
CREATE POLICY "Recipe ingredients are viewable by everyone"
  ON recipe_ingredients FOR SELECT
  USING (true);

CREATE POLICY "Users can manage ingredients for own recipes"
  ON recipe_ingredients FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Recipe Instructions
CREATE POLICY "Recipe instructions are viewable by everyone"
  ON recipe_instructions FOR SELECT
  USING (true);

CREATE POLICY "Users can manage instructions for own recipes"
  ON recipe_instructions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_instructions.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Recipe Ratings
CREATE POLICY "Recipe ratings are viewable by everyone"
  ON recipe_ratings FOR SELECT
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

CREATE POLICY "Users can update own ratings"
  ON recipe_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON recipe_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recipe Saves
CREATE POLICY "Users can view own saved recipes"
  ON recipe_saves FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes"
  ON recipe_saves FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave recipes"
  ON recipe_saves FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_instructions_recipe_id ON recipe_instructions(recipe_id);
CREATE INDEX idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_ratings_user_id ON recipe_ratings(user_id);
CREATE INDEX idx_recipe_saves_recipe_id ON recipe_saves(recipe_id);
CREATE INDEX idx_recipe_saves_user_id ON recipe_saves(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;