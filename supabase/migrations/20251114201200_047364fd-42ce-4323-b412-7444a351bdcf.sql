-- Update the first seminar session on November 15, 2025 to be 10:00 AM - 3:00 PM Central Time (16:00 - 21:00 UTC)
UPDATE seminar_sessions 
SET 
  start_time = '2025-11-15 16:00:00+00',
  end_time = '2025-11-15 21:00:00+00',
  updated_at = NOW()
WHERE id = '8fe41f97-dd12-4276-bfd3-30fbfa80c3eb';