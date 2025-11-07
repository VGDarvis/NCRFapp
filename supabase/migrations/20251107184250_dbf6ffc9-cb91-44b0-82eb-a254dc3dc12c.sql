-- Standardize ALL booths to 30×30 pixels to match grid cell system
-- This ensures all 81 booths are the correct size regardless of current dimensions

UPDATE public.booths
SET 
  booth_width = 30,
  booth_depth = 30;

-- Verify the update (should show all booths are now 30×30)
-- To check: SELECT booth_width, booth_depth, COUNT(*) FROM public.booths GROUP BY booth_width, booth_depth;