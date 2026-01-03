-- Create a table for user career shortlists
CREATE TABLE public.career_shortlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, career_name)
);

-- Enable Row Level Security
ALTER TABLE public.career_shortlist ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own shortlist" 
ON public.career_shortlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their shortlist" 
ON public.career_shortlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their shortlist" 
ON public.career_shortlist 
FOR DELETE 
USING (auth.uid() = user_id);