-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS is_username_available(text);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL CHECK (
    char_length(username) >= 3 AND 
    char_length(username) <= 30 AND
    username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$'
  ),
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(input_username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First validate the username format
  IF NOT (
    input_username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$' AND
    length(input_username) >= 3 AND
    length(input_username) <= 30
  ) THEN
    RETURN false;
  END IF;
  
  -- Then check if username exists (case insensitive)
  RETURN NOT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE lower(profiles.username) = lower(input_username)
  );
END;
$$;

-- Create function to handle new user registration
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
  -- Get username from metadata or email
  base_username := COALESCE(
    NULLIF(TRIM((NEW.raw_user_meta_data->>'username')::text), ''),
    split_part(NEW.email, '@', 1)
  );
  
  -- Clean username
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g');
  
  -- Ensure minimum length and valid format
  IF length(base_username) < 3 OR NOT (base_username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$') THEN
    base_username := 'user_' || substr(NEW.id::text, 1, 8);
  END IF;

  -- Truncate if too long
  base_username := substr(base_username, 1, 30);

  -- Find unique username
  final_username := base_username;
  LOOP
    BEGIN
      INSERT INTO public.profiles (id, username, email)
      VALUES (NEW.id, final_username, NEW.email);
      EXIT;
    EXCEPTION 
      WHEN unique_violation THEN
        counter := counter + 1;
        IF counter >= 100 THEN
          final_username := 'user_' || substr(gen_random_uuid()::text, 1, 8);
        ELSE
          final_username := base_username || counter::text;
        END IF;
      WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        -- Final fallback
        final_username := 'user_' || substr(NEW.id::text, 1, 8);
        BEGIN
          INSERT INTO public.profiles (id, username, email)
          VALUES (NEW.id, final_username, NEW.email);
        EXCEPTION WHEN OTHERS THEN
          RAISE LOG 'Critical error in handle_new_user fallback: %', SQLERRM;
        END;
        EXIT;
    END;
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Critical error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION is_username_available(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated, anon;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;