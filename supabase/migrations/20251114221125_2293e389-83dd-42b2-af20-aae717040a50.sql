-- Remove duplicate booths created during second import for Seattle event
-- This removes 42 duplicate booths that were created at 2025-11-14 21:58:06.329174+00
-- Keeping only the original 42 booths from the first import at 2025-11-14 21:57:39.975561+00

DELETE FROM booths 
WHERE event_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' 
AND created_at = '2025-11-14 21:58:06.329174+00';