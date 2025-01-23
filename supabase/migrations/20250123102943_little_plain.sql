/*
  # Add User Details

  1. Changes
    - Add new columns to profiles table:
      - first_name (text)
      - last_name (text)
      - username (text, unique)
      - phone_number (text)
    - Update handle_new_user function to include new fields
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS phone_number text;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (
    id, 
    email,
    role,
    username,
    first_name,
    last_name,
    phone_number
  )
  VALUES (
    new.id,
    new.email,
    'user',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;