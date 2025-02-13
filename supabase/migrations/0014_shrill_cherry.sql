-- Create function to ensure user profile exists
CREATE OR REPLACE FUNCTION ensure_user_profile(
  user_id uuid,
  user_email text,
  user_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (user_id, user_email, user_name)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    updated_at = now();
END;
$$;

-- Create trigger to automatically create profile on user creation
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'username')::text,
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();