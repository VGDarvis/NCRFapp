-- Update NRG Center venue address to official location
UPDATE venues
SET 
  name = 'NRG Center',
  address = 'NRG Park, 1 Fannin St',
  city = 'Houston',
  state = 'TX',
  zip_code = '77054',
  latitude = 29.6847,
  longitude = -95.4107
WHERE 
  name ILIKE '%NRG%' 
  AND city = 'Houston';

-- Add comment for future reference
COMMENT ON COLUMN venues.address IS 'Official venue address - verified against venue website';