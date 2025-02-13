-- Drop existing function
DROP FUNCTION IF EXISTS is_username_available(text);

-- Create improved username availability check function
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
  
  -- Then check if username exists
  RETURN NOT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.username = input_username
  );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_username_available(text) TO authenticated;