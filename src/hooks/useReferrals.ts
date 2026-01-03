import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  referral_code: string;
  referred_user_id: string | null;
  created_at: string;
  converted_at: string | null;
}

export const useReferrals = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const generateReferralCode = (userId: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomPart = Array.from({ length: 6 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    return `CP${randomPart}`;
  };

  const fetchOrCreateReferralCode = async (userId: string) => {
    try {
      // First check if user already has a referral code
      const { data: existing, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId)
        .is('referred_user_id', null)
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        setReferralCode(existing.referral_code);
        return existing.referral_code;
      }

      // Create a new referral code
      const newCode = generateReferralCode(userId);
      const { data: newReferral, error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: userId,
          referral_code: newCode,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setReferralCode(newReferral.referral_code);
      return newReferral.referral_code;
    } catch (error) {
      console.error('Error with referral code:', error);
      return null;
    }
  };

  const fetchReferrals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const initializeReferrals = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchOrCreateReferralCode(session.user.id);
        await fetchReferrals(session.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeReferrals();
  }, []);

  const getReferralLink = () => {
    if (!referralCode) return '';
    return `${window.location.origin}/auth?ref=${referralCode}`;
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Your referral link has been copied to clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const getConvertedCount = () => {
    return referrals.filter(r => r.converted_at !== null).length;
  };

  return {
    referralCode,
    referrals,
    loading,
    getReferralLink,
    copyReferralLink,
    getConvertedCount,
    refreshReferrals: initializeReferrals,
  };
};
