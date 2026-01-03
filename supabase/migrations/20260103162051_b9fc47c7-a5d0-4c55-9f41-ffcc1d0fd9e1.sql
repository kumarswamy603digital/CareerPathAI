-- Create table for tracking career view history
CREATE TABLE public.career_view_history (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    career_name text NOT NULL,
    viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_view_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own history" 
ON public.career_view_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their history" 
ON public.career_view_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" 
ON public.career_view_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_career_view_history_user_id ON public.career_view_history(user_id);
CREATE INDEX idx_career_view_history_viewed_at ON public.career_view_history(viewed_at DESC);