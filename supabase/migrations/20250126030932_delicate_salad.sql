/*
  # Fix Signup Flow

  1. Changes
    - Add function to check username availability
    - Add trigger to handle new user registration
    - Update profile policies

  2. Security
    - Add SECURITY DEFINER to functions
    - Add proper error handling
*/

-- Add function to check if username is available
CREATE OR REPLACE FUNCTION public.is_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.username = $1
  );
END;
$$;

-- Update handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
  -- Get base username from metadata or email
  base_username := COALESCE(
    (NEW.raw_user_meta_data->>'username')::text,
    split_part(NEW.email, '@', 1)
  );
  
  -- Initialize new_username
  new_username := base_username;
  
  -- Check if username exists and generate unique one if needed
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM profiles
      WHERE username = new_username
    ) INTO username_exists;
    
    EXIT WHEN NOT username_exists OR counter > 100;
    
    counter := counter + 1;
    new_username := base_username || counter::text;
  END LOOP;

  -- If we couldn't find a unique username, use a UUID-based one
  IF username_exists THEN
    new_username := base_username || '_' || substr(gen_random_uuid()::text, 1, 8);
  END IF;

  -- Insert new profile
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    new_username,
    NEW.email
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    -- Create a fallback username if anything goes wrong
    INSERT INTO public.profiles (id, username, email)
    VALUES (
      NEW.id,
      'user_' || substr(NEW.id::text, 1, 8),
      NEW.email
    );
    RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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