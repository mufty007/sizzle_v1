-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to handle new user registration with better error handling
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
      -- First check if profiles table exists
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      ) THEN
        -- Create profiles table if it doesn't exist
        CREATE TABLE profiles (
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

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Profiles are viewable by everyone"
          ON profiles FOR SELECT
          USING (true);

        CREATE POLICY "Users can insert their own profile"
          ON profiles FOR INSERT
          WITH CHECK (auth.uid() = id);

        CREATE POLICY "Users can update their own profile"
          ON profiles FOR UPDATE
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);
      END IF;

      -- Try to insert profile
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

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;