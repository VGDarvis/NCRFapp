-- Fix aspect ratio mismatch: Update floor plan canvas dimensions to match grid system (1200x800)
UPDATE floor_plans 
SET canvas_width = 1200, canvas_height = 800 
WHERE canvas_width = 1920 AND canvas_height = 1080;