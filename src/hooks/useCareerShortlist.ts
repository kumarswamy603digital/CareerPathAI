import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCareerShortlist() {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

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
      setShortlist([]);
      setLoading(false);
      return;
    }

    const fetchShortlist = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('career_shortlist')
        .select('career_name')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching shortlist:', error);
      } else {
        setShortlist(data.map(item => item.career_name));
      }
      setLoading(false);
    };

    fetchShortlist();
  }, [userId]);

  const addToShortlist = useCallback(async (careerName: string) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save careers to your shortlist.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('career_shortlist')
      .insert({ user_id: userId, career_name: careerName });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already saved",
          description: "This career is already in your shortlist.",
        });
      } else {
        console.error('Error adding to shortlist:', error);
        toast({
          title: "Error",
          description: "Failed to add career to shortlist.",
          variant: "destructive",
        });
      }
      return false;
    }

    setShortlist(prev => [...prev, careerName]);
    toast({
      title: "Added to shortlist",
      description: `${careerName} has been saved to your shortlist.`,
    });
    return true;
  }, [userId, toast]);

  const removeFromShortlist = useCallback(async (careerName: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('career_shortlist')
      .delete()
      .eq('user_id', userId)
      .eq('career_name', careerName);

    if (error) {
      console.error('Error removing from shortlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove career from shortlist.",
        variant: "destructive",
      });
      return false;
    }

    setShortlist(prev => prev.filter(name => name !== careerName));
    toast({
      title: "Removed from shortlist",
      description: `${careerName} has been removed from your shortlist.`,
    });
    return true;
  }, [userId, toast]);

  const isInShortlist = useCallback((careerName: string) => {
    return shortlist.includes(careerName);
  }, [shortlist]);

  const toggleShortlist = useCallback(async (careerName: string) => {
    if (isInShortlist(careerName)) {
      return removeFromShortlist(careerName);
    } else {
      return addToShortlist(careerName);
    }
  }, [isInShortlist, addToShortlist, removeFromShortlist]);

  return {
    shortlist,
    loading,
    addToShortlist,
    removeFromShortlist,
    isInShortlist,
    toggleShortlist,
    isAuthenticated: !!userId,
  };
}
