-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
    
    EXIT WHEN NOT username_exists;
    
    counter := counter + 1;
    new_username := base_username || counter::text;
  END LOOP;

  -- Insert new profile
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    new_username,
    NEW.email
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update profile policies
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.profiles;
CREATE POLICY "Service role can manage profiles"
  ON public.profiles
  USING (true)
  WITH CHECK (true);

-- Add unique constraint on username if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;