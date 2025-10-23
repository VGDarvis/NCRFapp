-- Update Houston Black College Expo with event flyer
UPDATE events 
SET event_flyer_url = '/images/expo-houston-flyer.png'
WHERE title ILIKE '%Houston%' 
  AND (title ILIKE '%Black%College%Expo%' OR title ILIKE '%College%Expo%')
  AND start_at >= '2025-11-01'
  AND start_at < '2025-11-02';