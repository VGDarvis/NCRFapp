-- Create Seattle venue
INSERT INTO venues (
  id,
  name,
  address,
  city,
  state,
  zip_code,
  latitude,
  longitude,
  venue_type,
  capacity,
  parking_info,
  accessibility_info,
  amenities,
  is_active
)
VALUES (
  '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  'Rainier Beach High School',
  '8815 Seward Park Ave S',
  'Seattle',
  'WA',
  '98118',
  47.5220,
  -122.2573,
  'high_school',
  500,
  'Free parking available in school parking lot',
  'Accessible gymnasium and restrooms available',
  '["WiFi", "Parking", "Restrooms", "Air Conditioning"]'::jsonb,
  true
);

-- Create Seattle event
INSERT INTO events (
  id,
  title,
  description,
  event_type,
  start_at,
  end_at,
  venue_id,
  status,
  max_attendees,
  registration_required,
  registration_url,
  contact_email,
  event_flyer_url,
  highlights
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '8th Annual Seattle Black College Expo',
  'Meet with over 50 colleges, get accepted on the spot, millions in scholarships available, and life-changing seminars at Rainier Beach High School.',
  'college_fair',
  '2025-11-15 18:00:00+00',
  '2025-11-15 23:00:00+00',
  '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  'upcoming',
  500,
  true,
  'https://www.eventbrite.com/e/8th-annual-seattle-black-college-expo',
  'info@blackcollegeexpo.com',
  '/images/expo-seattle.png',
  '["Meet with over 50 colleges", "Get accepted on the spot", "Millions in scholarships available", "Some colleges waive application fees", "Certificate and trade schools", "Life changing seminars", "Celebrities and prizes"]'::jsonb
);

-- Create floor plan record for Seattle venue
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