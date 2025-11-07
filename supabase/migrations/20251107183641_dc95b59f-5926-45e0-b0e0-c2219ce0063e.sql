-- Update existing booths to use 30×30 pixel dimensions
-- This fixes booths that were created with the old 80×80 default

UPDATE public.booths
SET 
  booth_width = 30,
  booth_depth = 30
WHERE booth_width = 80 OR booth_depth = 80 OR booth_width IS NULL OR booth_depth IS NULL;

-- Add helpful comment
COMMENT ON COLUMN public.booths.booth_width IS 
'Width of booth in pixels (default: 30px to match 30×30 grid cells)';

COMMENT ON COLUMN public.booths.booth_depth IS 
'Depth/height of booth in pixels (default: 30px to match 30×30 grid cells)';