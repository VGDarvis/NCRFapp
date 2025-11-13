-- Update Seattle event title to include "8th Annual"
UPDATE events 
SET title = '8th Annual Seattle Black College Expo'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND title = 'Seattle Black College Expo';