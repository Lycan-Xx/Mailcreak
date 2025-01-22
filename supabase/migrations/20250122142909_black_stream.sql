/*
  # Initial Schema Setup for Techy 2 Email System

  1. New Tables
    - `profiles`
      - Extends auth.users with additional user information
      - Stores user role and preferences
    
    - `newsletters`
      - Stores newsletter content and metadata
      - Tracks status (draft, scheduled, sent)
    
    - `subscriptions`
      - Manages user newsletter subscriptions
      - Links users to newsletter categories
    
    - `resources`
      - Stores educational resources and documents
      - Controls access levels
    
    - `categories`
      - Newsletter and resource categories
      - Helps with content organization

  2. Security
    - Enable RLS on all tables
    - Set up policies for each user role
    - Ensure data isolation between users

  3. Functions
    - Handle user creation
    - Manage subscription status
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superuser');
CREATE TYPE newsletter_status AS ENUM ('draft', 'scheduled', 'sent');
CREATE TYPE access_level AS ENUM ('public', 'user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'user'::user_role,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES categories(id),
  status newsletter_status DEFAULT 'draft'::newsletter_status,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  category_id uuid REFERENCES categories(id),
  access_level access_level DEFAULT 'public'::access_level,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superuser')
  ));

-- Newsletters policies
CREATE POLICY "Published newsletters are viewable by subscribers"
  ON newsletters FOR SELECT
  USING (
    status = 'sent' AND EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.category_id = newsletters.category_id
      AND subscriptions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage newsletters"
  ON newsletters FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superuser')
  ));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions"
  ON subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- Resources policies
CREATE POLICY "Public resources are viewable by everyone"
  ON resources FOR SELECT
  USING (access_level = 'public');

CREATE POLICY "User resources are viewable by authenticated users"
  ON resources FOR SELECT
  USING (
    access_level = 'user' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin resources are viewable by admins"
  ON resources FOR SELECT
  USING (
    access_level = 'admin'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superuser')
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;