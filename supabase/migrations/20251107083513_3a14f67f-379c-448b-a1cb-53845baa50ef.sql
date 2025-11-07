-- Seed booth number presets 0-1000 for Dallas Fort Worth event
-- This allows admins to quickly assign booth numbers from a dropdown

INSERT INTO booth_presets (event_id, preset_type, preset_value, display_order, is_active)
SELECT 
  'df8a7c6b-5e4d-3c2b-1a0f-9e8d7c6b5a4f'::uuid as event_id,
  'booth_number'::text as preset_type,
  generate_series::text as preset_value,
  generate_series as display_order,
  true as is_active
FROM generate_series(0, 1000)
ON CONFLICT (event_id, preset_type, preset_value) DO NOTHING;

-- Add comment
COMMENT ON TABLE booth_presets IS 'Pre-configured booth numbers and organization names for quick booth assignment per event';