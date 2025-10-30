-- Update NRG venue with correct address and coordinates for 1 Fannin St location
UPDATE venues 
SET 
  address = 'NRG Park, 1 Fannin St',
  latitude = 29.684819,
  longitude = -95.410767
WHERE id = '40355f5a-4326-42ed-a084-6e1bf4b6d0cd';