-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create a view for admin analytics (career popularity)
CREATE OR REPLACE VIEW public.career_analytics AS
SELECT 
  career_name,
  COUNT(*) as view_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.career_view_history
GROUP BY career_name
ORDER BY view_count DESC;

-- Create a view for assessment analytics
CREATE OR REPLACE VIEW public.assessment_analytics AS
SELECT 
  recommended_career,
  COUNT(*) as recommendation_count
FROM public.assessment_history
GROUP BY recommended_career
ORDER BY recommendation_count DESC;

-- Grant access to views for authenticated users (will be filtered by app logic)
GRANT SELECT ON public.career_analytics TO authenticated;
GRANT SELECT ON public.assessment_analytics TO authenticated;