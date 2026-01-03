-- Create assessment_history table to track past recommendations
CREATE TABLE public.assessment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  personality TEXT[] NOT NULL,
  interests TEXT[] NOT NULL,
  recommended_career TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own assessment history" 
ON public.assessment_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their assessment history" 
ON public.assessment_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessment history" 
ON public.assessment_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_assessment_history_user_id ON public.assessment_history(user_id);
CREATE INDEX idx_assessment_history_completed_at ON public.assessment_history(completed_at DESC);