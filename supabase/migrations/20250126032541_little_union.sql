/*
  # Fix Signup Process

  1. Changes
    - Drop and recreate profiles table with correct structure
    - Add proper constraints and indexes
    - Update profile creation trigger with better error handling
    - Add RLS policies with proper permissions

  2. Security
    - Set search_path explicitly
    - Add SECURITY DEFINER to functions
    - Proper error handling and logging
*/

-- Drop existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS is_username_available();

-- Recreate profiles table
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Create indexes
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_email_idx ON profiles(email);

-- Function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cleaned_username text;
BEGIN
  -- Clean and validate username
  cleaned_username := regexp_replace(username, '[^a-zA-Z0-9_-]', '', 'g');
  
  -- Check if username exists
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.username = cleaned_username
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
    regexp_replace((NEW.raw_user_meta_data->>'username')::text, '[^a-zA-Z0-9_-]', '', 'g'),
    regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g')
  );

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

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
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

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;