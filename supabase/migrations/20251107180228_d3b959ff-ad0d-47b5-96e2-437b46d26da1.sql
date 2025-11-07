-- Drop outdated grid constraints from old 12×8 grid
ALTER TABLE public.booths DROP CONSTRAINT IF EXISTS grid_row_bounds;
ALTER TABLE public.booths DROP CONSTRAINT IF EXISTS grid_col_bounds;

-- Add updated constraints for 40×26 grid (30×30 pixel cells)
-- Rows: 0-25 (26 total rows)
-- Cols: 0-39 (40 total columns)
ALTER TABLE public.booths 
ADD CONSTRAINT grid_row_bounds CHECK (grid_row >= 0 AND grid_row <= 25);

ALTER TABLE public.booths 
ADD CONSTRAINT grid_col_bounds CHECK (grid_col >= 0 AND grid_col <= 39);

-- Add helpful comments
COMMENT ON CONSTRAINT grid_row_bounds ON public.booths IS 
'Ensures grid_row is within bounds for 26-row grid (0-25) with 30×30 pixel cells';

COMMENT ON CONSTRAINT grid_col_bounds ON public.booths IS 
'Ensures grid_col is within bounds for 40-column grid (0-39) with 30×30 pixel cells';