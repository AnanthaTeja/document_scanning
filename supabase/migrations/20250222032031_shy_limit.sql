/*
  # Initial Schema Setup

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - role (text)
      - credits (integer)
      - daily_scans (integer)
      - last_reset (timestamp)
      - created_at (timestamp)
    
    - documents
      - id (uuid)
      - user_id (uuid, references auth.users)
      - content (text)
      - created_at (timestamp)
    
    - credit_requests
      - id (uuid)
      - user_id (uuid, references auth.users)
      - amount (integer)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  credits integer NOT NULL DEFAULT 20,
  daily_scans integer NOT NULL DEFAULT 0,
  last_reset timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create credit_requests table
CREATE TABLE credit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Credit requests policies
CREATE POLICY "Users can read own credit requests"
  ON credit_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create credit requests"
  ON credit_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to reset daily credits
CREATE OR REPLACE FUNCTION reset_daily_credits()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET credits = 20,
      daily_scans = 0,
      last_reset = now()
  WHERE (now() - last_reset) >= interval '1 day';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create a profile after user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_profile_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();