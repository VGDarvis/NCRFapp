-- Add necessary fields to floor_plans table
ALTER TABLE floor_plans 
  ADD COLUMN IF NOT EXISTS background_image_url TEXT,
  ADD COLUMN IF NOT EXISTS canvas_width INTEGER DEFAULT 1200,
  ADD COLUMN IF NOT EXISTS canvas_height INTEGER DEFAULT 800;

-- Enable realtime for instant updates on booths table
ALTER TABLE booths REPLICA IDENTITY FULL;

-- Enable realtime for floor_plans table
ALTER TABLE floor_plans REPLICA IDENTITY FULL;