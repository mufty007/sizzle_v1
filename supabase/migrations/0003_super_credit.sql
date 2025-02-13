/*
  # Add User Profiles and Storage

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `storage.buckets` (for file storage)
      - `id` (text, primary key)
      - `name` (text)
      - `owner` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `storage.objects` (for stored files)
      - `id` (uuid, primary key)
      - `bucket_id` (text)
      - `name` (text)
      - `owner` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `last_accessed_at` (timestamptz)
      - `metadata` (jsonb)
      - `path_tokens` (text[])

  2. Security
    - Enable RLS on all tables
    - Add policies for profiles table
    - Add policies for storage buckets and objects
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create storage schema
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage tables
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  UNIQUE (bucket_id, name)
);

-- Enable RLS on storage tables
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Public buckets are viewable by everyone"
  ON storage.buckets
  FOR SELECT
  USING (public = true);

CREATE POLICY "Users can create buckets"
  ON storage.buckets
  FOR INSERT
  WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own buckets"
  ON storage.buckets
  FOR UPDATE
  USING (auth.uid() = owner);

CREATE POLICY "Public objects are viewable by everyone"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN (
      SELECT id FROM storage.buckets WHERE public = true
    )
  );

CREATE POLICY "Users can upload objects to their own buckets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner AND
    bucket_id IN (
      SELECT id FROM storage.buckets WHERE owner = auth.uid()
    )
  );

CREATE POLICY "Users can update their own objects"
  ON storage.objects
  FOR UPDATE
  USING (auth.uid() = owner);

-- Create recipe images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'Recipe Images', true)
ON CONFLICT DO NOTHING;

-- Create profile avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'User Avatars', true)
ON CONFLICT DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storage_buckets_updated_at
  BEFORE UPDATE ON storage.buckets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storage_objects_updated_at
  BEFORE UPDATE ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();