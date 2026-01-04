-- Drop the security definer views
DROP VIEW IF EXISTS public.career_analytics;
DROP VIEW IF EXISTS public.assessment_analytics;

-- Create secure functions instead to get analytics (admin only)
CREATE OR REPLACE FUNCTION public.get_career_analytics()
RETURNS TABLE(career_name text, view_count bigint, unique_users bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    career_name,
    COUNT(*)::bigint as view_count,
    COUNT(DISTINCT user_id)::bigint as unique_users
  FROM public.career_view_history
  GROUP BY career_name
  ORDER BY view_count DESC
  LIMIT 50
$$;

CREATE OR REPLACE FUNCTION public.get_assessment_analytics()
RETURNS TABLE(recommended_career text, recommendation_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    recommended_career,
    COUNT(*)::bigint as recommendation_count
  FROM public.assessment_history
  GROUP BY recommended_career
  ORDER BY recommendation_count DESC
  LIMIT 50
$$;

-- Function to get total user count (admin only)
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(total_users bigint, users_with_onboarding bigint, public_profiles bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE onboarding_completed = true)::bigint as users_with_onboarding,
    COUNT(*) FILTER (WHERE is_public = true)::bigint as public_profiles
  FROM public.profiles
$$;

-- Function to get shortlist analytics
CREATE OR REPLACE FUNCTION public.get_shortlist_analytics()
RETURNS TABLE(career_name text, shortlist_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    career_name,
    COUNT(*)::bigint as shortlist_count
  FROM public.career_shortlist
  GROUP BY career_name
  ORDER BY shortlist_count DESC
  LIMIT 20
$$;