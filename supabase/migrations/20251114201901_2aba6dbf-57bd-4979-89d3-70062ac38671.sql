-- Update Seattle Black College Expo event time to 10:00 AM - 3:00 PM Pacific Time (18:00 - 23:00 UTC)
UPDATE events 
SET 
  start_at = '2025-11-15 18:00:00+00',
  end_at = '2025-11-15 23:00:00+00',
  updated_at = NOW()
WHERE title ILIKE '%Seattle%' 
  AND start_at::date = '2025-11-15';