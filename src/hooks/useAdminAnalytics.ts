import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CareerAnalytics {
  career_name: string;
  view_count: number;
  unique_users: number;
}

interface AssessmentAnalytics {
  recommended_career: string;
  recommendation_count: number;
}

interface ShortlistAnalytics {
  career_name: string;
  shortlist_count: number;
}

interface UserStats {
  total_users: number;
  users_with_onboarding: number;
  public_profiles: number;
}

export function useAdminAnalytics() {
  const [careerAnalytics, setCareerAnalytics] = useState<CareerAnalytics[]>([]);
  const [assessmentAnalytics, setAssessmentAnalytics] = useState<AssessmentAnalytics[]>([]);
  const [shortlistAnalytics, setShortlistAnalytics] = useState<ShortlistAnalytics[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all analytics in parallel
      const [careerRes, assessmentRes, shortlistRes, userStatsRes] = await Promise.all([
        supabase.rpc('get_career_analytics'),
        supabase.rpc('get_assessment_analytics'),
        supabase.rpc('get_shortlist_analytics'),
        supabase.rpc('get_user_stats'),
      ]);

      if (careerRes.error) throw careerRes.error;
      if (assessmentRes.error) throw assessmentRes.error;
      if (shortlistRes.error) throw shortlistRes.error;
      if (userStatsRes.error) throw userStatsRes.error;

      setCareerAnalytics(careerRes.data || []);
      setAssessmentAnalytics(assessmentRes.data || []);
      setShortlistAnalytics(shortlistRes.data || []);
      setUserStats(userStatsRes.data?.[0] || null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    careerAnalytics,
    assessmentAnalytics,
    shortlistAnalytics,
    userStats,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
