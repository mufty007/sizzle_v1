/*
  # Fix Signup Process

  1. Changes
    - Add function to handle profile creation
    - Add trigger for automatic profile creation
    - Update profile policies
    - Add error handling

  2. Security
    - Add SECURITY DEFINER to functions
    - Set search_path explicitly
    - Add proper error handling
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username_exists boolean;
  base_username text;
  new_username text;
  counter integer := 0;
BEGIN
  -- Get username from metadata or email
  base_username := COALESCE(
    (NEW.raw_user_meta_data->>'username')::text,
    split_part(NEW.email, '@', 1)
  );
  
  -- Clean and validate username
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g');
  IF length(base_username) < 3 THEN
    base_username := 'user_' || substr(NEW.id::text, 1, 8);
  END IF;
  
  -- Find unique username
  new_username := base_username;
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM profiles
      WHERE username = new_username
    ) INTO username_exists;
    
    EXIT WHEN NOT username_exists OR counter >= 100;
    
    counter := counter + 1;
    new_username := base_username || counter::text;
  END LOOP;

  -- If still not unique, use UUID
  IF username_exists THEN
    new_username := 'user_' || substr(gen_random_uuid()::text, 1, 8);
  END IF;

  -- Create profile
  BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (NEW.id, new_username, NEW.email);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    -- Fallback to UUID-based username
    INSERT INTO public.profiles (id, username, email)
    VALUES (
      NEW.id,
      'user_' || substr(NEW.id::text, 1, 8),
      NEW.email
    );
  END;

  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update profile policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clean username for comparison
  username := regexp_replace(username, '[^a-zA-Z0-9_-]', '', 'g');
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.username = username
  );
END;
$$;