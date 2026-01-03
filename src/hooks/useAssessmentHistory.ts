import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AssessmentHistoryItem {
  id: string;
  personality: string[];
  interests: string[];
  recommended_career: string;
  completed_at: string;
}

export function useAssessmentHistory() {
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessment history:', error);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [userId]);

  const addToHistory = useCallback(async (assessment: {
    personality: string[];
    interests: string[];
    recommended_career: string;
  }) => {
    if (!userId) return false;

    const { data, error } = await supabase
      .from('assessment_history')
      .insert({
        user_id: userId,
        personality: assessment.personality,
        interests: assessment.interests,
        recommended_career: assessment.recommended_career,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to assessment history:', error);
      return false;
    }

    if (data) {
      setHistory(prev => [data, ...prev]);
    }
    return true;
  }, [userId]);

  const deleteFromHistory = useCallback(async (id: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('assessment_history')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting from history:', error);
      return false;
    }

    setHistory(prev => prev.filter(item => item.id !== id));
    return true;
  }, [userId]);

  return {
    history,
    loading,
    addToHistory,
    deleteFromHistory,
    totalAssessments: history.length,
    isAuthenticated: !!userId,
  };
}
