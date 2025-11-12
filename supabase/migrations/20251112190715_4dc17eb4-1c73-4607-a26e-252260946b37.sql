-- Create floor plan record for Seattle venue (venue and event already exist)
INSERT INTO floor_plans (
  venue_id,
  floor_number,
  floor_name,
  image_url,
  scale_factor
)
VALUES (
  '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  1,
  'Gymnasium',
  '/floor-plans/seattle-rainier-beach-gym.png',
  1.0
);