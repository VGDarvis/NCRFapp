-- Fix seminar time for "From Dreams to Realities" in Room 103
-- Change from 1:00pm to 12:00pm (as per flyer)
UPDATE seminar_sessions 
SET 
  start_time = '2025-11-01 12:00:00+00',
  end_time = '2025-11-01 13:00:00+00'
WHERE id = 'fdbaf2d8-4bd5-49b4-9eb4-380b99a39351';

-- Expand booth numbers from 100-900 (both evens and odds)
-- First, delete existing booth number presets for Houston event
DELETE FROM booth_presets 
WHERE preset_type = 'booth_number' 
AND event_id = '82380224-9e0b-45fc-a395-61117e0af6a5';

-- Generate booth numbers 100-900 (801 booth numbers total)
INSERT INTO booth_presets (
  event_id,
  preset_type,
  preset_value,
  display_order,
  is_active
)
SELECT 
  '82380224-9e0b-45fc-a395-61117e0af6a5'::uuid,
  'booth_number'::text,
  num::text,
  num,
  true
FROM generate_series(100, 900) AS num;