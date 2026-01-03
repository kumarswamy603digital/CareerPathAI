-- Create referrals table to track invites
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referral_code text NOT NULL UNIQUE,
  referred_user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  converted_at timestamp with time zone
);

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referral_code ON public.referrals(referral_code);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals (ones they sent)
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id);

-- Users can create referral codes
CREATE POLICY "Users can create referral codes"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = referrer_id);

-- Allow updating referrals when someone uses the code (for conversion tracking)
CREATE POLICY "Users can update their own referrals"
ON public.referrals
FOR UPDATE
USING (auth.uid() = referrer_id);