-- Add public profile fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_public boolean DEFAULT false,
ADD COLUMN display_name text,
ADD COLUMN bio text,
ADD COLUMN public_slug text UNIQUE;

-- Create index for public slug lookups
CREATE INDEX idx_profiles_public_slug ON public.profiles(public_slug) WHERE is_public = true;

-- Create policy for public profile viewing
CREATE POLICY "Anyone can view public profiles"
ON public.profiles
FOR SELECT
USING (is_public = true);