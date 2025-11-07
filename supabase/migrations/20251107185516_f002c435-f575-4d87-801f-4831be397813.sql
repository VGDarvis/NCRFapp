-- Fix booths that were added after initial standardization
-- Update any booths that still have incorrect dimensions
UPDATE public.booths
SET 
  booth_width = 30,
  booth_depth = 30
WHERE booth_width != 30 OR booth_depth != 30;