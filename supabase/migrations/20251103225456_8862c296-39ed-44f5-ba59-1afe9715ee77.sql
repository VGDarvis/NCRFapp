-- Update the Dallas/Fort Worth floor plan to use the correct background image
UPDATE floor_plans
SET 
  background_image_url = '/floor-plans/dallas-fort-worth-floor-plan.png',
  canvas_width = 1920,
  canvas_height = 1080
WHERE venue_id = (
  SELECT venue_id 
  FROM events 
  WHERE title = '8th Annual Dallas/Fort Worth Black College Expo'
  LIMIT 1
);