-- Fix analytics functions to include server-side admin authorization

-- Update get_user_stats to check admin role
CREATE OR REPLACE FUNCTION public.get_user_stats()
 RETURNS TABLE(total_users bigint, users_with_onboarding bigint, public_profiles bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the calling user has admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE onboarding_completed = true)::bigint as users_with_onboarding,
    COUNT(*) FILTER (WHERE is_public = true)::bigint as public_profiles
  FROM public.profiles;
END;
$function$;

-- Update get_assessment_analytics to check admin role
CREATE OR REPLACE FUNCTION public.get_assessment_analytics()
 RETURNS TABLE(recommended_career text, recommendation_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the calling user has admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    ah.recommended_career,
    COUNT(*)::bigint as recommendation_count
  FROM public.assessment_history ah
  GROUP BY ah.recommended_career
  ORDER BY recommendation_count DESC
  LIMIT 50;
END;
$function$;

-- Update get_shortlist_analytics to check admin role
CREATE OR REPLACE FUNCTION public.get_shortlist_analytics()
 RETURNS TABLE(career_name text, shortlist_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the calling user has admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    cs.career_name,
    COUNT(*)::bigint as shortlist_count
  FROM public.career_shortlist cs
  GROUP BY cs.career_name
  ORDER BY shortlist_count DESC
  LIMIT 20;
END;
$function$;

-- Update get_career_analytics to check admin role
CREATE OR REPLACE FUNCTION public.get_career_analytics()
 RETURNS TABLE(career_name text, view_count bigint, unique_users bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the calling user has admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    cvh.career_name,
    COUNT(*)::bigint as view_count,
    COUNT(DISTINCT cvh.user_id)::bigint as unique_users
  FROM public.career_view_history cvh
  GROUP BY cvh.career_name
  ORDER BY view_count DESC
  LIMIT 50;
END;
$function$;