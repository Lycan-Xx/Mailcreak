/*
  # Mailcreak Database Schema

  1. Tables
    - users (extends auth.users)
      - id (uuid, primary key)
      - email (text, unique)
      - username (text, unique)
      - first_name (text)
      - last_name (text)
      - phone_number (text)
      - role (enum: user, admin, superuser)
      - created_at (timestamp)
      - updated_at (timestamp)

    - newsletters
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - status (enum: draft, scheduled, sent)
      - scheduled_for (timestamp)
      - created_at (timestamp)
      - created_by (uuid, references users)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Create policies for user access
    - Set up authentication triggers
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superuser');
CREATE TYPE newsletter_status AS ENUM ('draft', 'scheduled', 'sent');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone_number text,
  role user_role DEFAULT 'user'::user_role,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  status newsletter_status DEFAULT 'draft'::newsletter_status,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Newsletters policies
CREATE POLICY "Published newsletters are viewable by everyone"
  ON newsletters FOR SELECT
  USING (status = 'sent');

CREATE POLICY "Users can view own draft newsletters"
  ON newsletters FOR SELECT
  USING (status = 'draft' AND created_by = auth.uid());

CREATE POLICY "Users can create newsletters"
  ON newsletters FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own newsletters"
  ON newsletters FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all newsletters"
  ON newsletters FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'superuser')
  ));

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (
    id,
    email,
    username,
    first_name,
    last_name,
    phone_number,
    role
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone_number',
    (new.raw_user_meta_data->>'role')::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();