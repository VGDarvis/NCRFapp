-- Fix existing booths with tiny dimensions (< 20 pixels)
-- This addresses booth B001 and any other affected booths
-- Set all undersized booths to the standard 80x80 pixel dimensions

UPDATE booths
SET 
  booth_width = 80,
  booth_depth = 80
WHERE 
  booth_width < 20 OR booth_depth < 20 OR booth_width IS NULL OR booth_depth IS NULL;