import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CareerHistoryItem {
  id: string;
  career_name: string;
  viewed_at: string;
}

export function useCareerHistory() {
  const [history, setHistory] = useState<CareerHistoryItem[]>([]);
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
        .from('career_view_history')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [userId]);

  const addToHistory = useCallback(async (careerName: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('career_view_history')
      .insert({ user_id: userId, career_name: careerName });

    if (error) {
      console.error('Error adding to history:', error);
      return false;
    }

    // Add to local state
    const newItem: CareerHistoryItem = {
      id: crypto.randomUUID(),
      career_name: careerName,
      viewed_at: new Date().toISOString(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
    return true;
  }, [userId]);

  const clearHistory = useCallback(async () => {
    if (!userId) return false;

    const { error } = await supabase
      .from('career_view_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing history:', error);
      return false;
    }

    setHistory([]);
    return true;
  }, [userId]);

  // Get unique careers viewed
  const uniqueCareersViewed = [...new Set(history.map(h => h.career_name))];

  return {
    history,
    loading,
    addToHistory,
    clearHistory,
    uniqueCareersViewed,
    totalViews: history.length,
    isAuthenticated: !!userId,
  };
}
