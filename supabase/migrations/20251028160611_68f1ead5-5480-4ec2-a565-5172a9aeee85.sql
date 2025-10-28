-- Add stage_description field to booths table for seminar/stage information
ALTER TABLE public.booths
ADD COLUMN IF NOT EXISTS stage_description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.booths.stage_description IS 'Stage or seminar information for the booth (e.g., "Seminar at 2pm in Room A")';