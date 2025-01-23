/*
  # Fix Newsletter Policies

  1. Changes
    - Update newsletter policies to allow proper access
    - Add policy for draft newsletters
  
  2. Security
    - Maintain RLS
    - Add more granular access control
*/

-- Drop existing newsletter policies
DROP POLICY IF EXISTS "Published newsletters are viewable by subscribers" ON newsletters;
DROP POLICY IF EXISTS "Admins can manage newsletters" ON newsletters;

-- Create new policies for newsletters
CREATE POLICY "Anyone can view sent newsletters"
  ON newsletters FOR SELECT
  USING (status = 'sent');

CREATE POLICY "Users can view their own draft newsletters"
  ON newsletters FOR SELECT
  USING (
    status = 'draft' 
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can create newsletters"
  ON newsletters FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own newsletters"
  ON newsletters FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all newsletters"
  ON newsletters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superuser')
    )
  );