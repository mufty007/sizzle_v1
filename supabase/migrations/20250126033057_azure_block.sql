/*
  # Fix Trigger and Update Schema

  1. Changes
    - Safely drop and recreate trigger
    - Update handle_new_user function with better error handling
    - Add username validation improvements
    - Add missing indexes

  2. Security
    - Maintain existing RLS policies
    - Ensure secure function execution
*/

-- Safely drop and recreate trigger
DO $$ 
BEGIN
  -- Drop trigger if it exists
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
END $$;

-- Update handle_new_user function with improved error handling
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
      EXIT; -- If insert succeeds, exit loop
    EXCEPTION 
      WHEN unique_violation THEN
        counter := counter + 1;
        IF counter >= 100 THEN
          -- If we've tried 100 times, use UUID-based username
          final_username := 'user_' || substr(gen_random_uuid()::text, 1, 8);
        ELSE
          final_username := base_username || counter::text;
        END IF;
      WHEN OTHERS THEN
        -- Log error and use fallback username
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        INSERT INTO public.profiles (id, username, email)
        VALUES (
          NEW.id,
          'user_' || substr(NEW.id::text, 1, 8),
          NEW.email
        );
        EXIT;
    END;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update username validation function
CREATE OR REPLACE FUNCTION validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$' AND
    length(username) >= 3 AND
    length(username) <= 30
  );
END;
$$;

-- Ensure all necessary indexes exist
DO $$ 
BEGIN
  -- Create indexes if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_username') THEN
    CREATE INDEX idx_profiles_username ON profiles(username);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_email') THEN
    CREATE INDEX idx_profiles_email ON profiles(email);
  END IF;
END $$;

-- Add constraint for username format if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_format_check'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_username_format_check 
    CHECK (username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*$');
  END IF;
END $$;