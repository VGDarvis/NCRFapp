-- Add zones JSONB column to floor_plans for zone-based positioning
ALTER TABLE public.floor_plans
ADD COLUMN IF NOT EXISTS zones JSONB DEFAULT '[]'::jsonb;

-- Add grid_opacity column for customizable grid overlay
ALTER TABLE public.floor_plans
ADD COLUMN IF NOT EXISTS grid_opacity DECIMAL(3,2) DEFAULT 0.60 CHECK (grid_opacity >= 0 AND grid_opacity <= 1);

COMMENT ON COLUMN public.floor_plans.zones IS 'Array of zone definitions: [{"name": "North Hall", "startRow": 0, "startCol": 0, "rows": 4, "cols": 6, "color": "#3b82f6"}]';
COMMENT ON COLUMN public.floor_plans.grid_opacity IS 'Opacity of grid overlay (0.0 to 1.0) for better background image visibility';