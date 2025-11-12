-- Update Seattle floor plan with grid configuration and zones for gymnasium layout
UPDATE floor_plans
SET 
  canvas_width = 1200,
  canvas_height = 800,
  width_meters = 60,
  height_meters = 40,
  grid_opacity = 0.3,
  zones = '{
    "main_floor": {
      "name": "Main Gymnasium Floor",
      "color": "#3b82f6",
      "description": "Primary exhibition area with college booths"
    },
    "stage_area": {
      "name": "Stage Area",
      "color": "#8b5cf6", 
      "description": "Presentation and seminar space"
    },
    "entrance": {
      "name": "Entrance & Registration",
      "color": "#10b981",
      "description": "Check-in and welcome area"
    },
    "food_court": {
      "name": "Food & Refreshments",
      "color": "#f59e0b",
      "description": "Refreshment area"
    }
  }'::jsonb
WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c';

-- Create sample booth layout for Seattle (50 college booths in organized grid)
INSERT INTO booths (event_id, venue_id, floor_plan_id, org_name, org_type, zone, grid_row, grid_col, booth_width, booth_depth, display_order, table_no)
SELECT 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c'::uuid,
  fp.id,
  'Placeholder ' || row_num || '-' || col_num,
  'college',
  CASE 
    WHEN row_num <= 2 THEN 'entrance'
    WHEN row_num >= 9 THEN 'stage_area'
    ELSE 'main_floor'
  END,
  row_num,
  col_num,
  3,
  3,
  (row_num - 1) * 10 + col_num,
  'T-' || row_num || col_num
FROM floor_plans fp
CROSS JOIN generate_series(1, 10) AS row_num
CROSS JOIN generate_series(1, 5) AS col_num
WHERE fp.venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c'
AND row_num * col_num <= 50
ORDER BY row_num, col_num;