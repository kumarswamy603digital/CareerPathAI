-- Change personality column from TEXT to TEXT[]
ALTER TABLE public.profiles 
ALTER COLUMN personality TYPE TEXT[] USING CASE WHEN personality IS NULL THEN NULL ELSE ARRAY[personality] END;