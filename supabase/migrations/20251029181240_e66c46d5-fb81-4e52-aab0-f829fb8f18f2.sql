-- Add grid positioning columns to booths table
ALTER TABLE public.booths 
ADD COLUMN IF NOT EXISTS grid_row INTEGER,
ADD COLUMN IF NOT EXISTS grid_col INTEGER;

-- Add check constraints for grid bounds (12 columns x 8 rows)
ALTER TABLE public.booths 
ADD CONSTRAINT grid_row_bounds CHECK (grid_row >= 0 AND grid_row <= 7),
ADD CONSTRAINT grid_col_bounds CHECK (grid_col >= 0 AND grid_col <= 11);

-- Create index for faster grid position queries
CREATE INDEX IF NOT EXISTS idx_booths_grid_position ON public.booths(event_id, grid_row, grid_col);

-- Update existing booths to have grid positions based on their X/Y coordinates
UPDATE public.booths
SET 
  grid_row = FLOOR(COALESCE(y_position, 0) / 100.0)::INTEGER,
  grid_col = FLOOR(COALESCE(x_position, 0) / 100.0)::INTEGER
WHERE grid_row IS NULL OR grid_col IS NULL;