-- Create venue for Eastern Hills High School
INSERT INTO public.venues (
  id,
  name,
  address,
  city,
  state,
  zip_code,
  latitude,
  longitude,
  venue_type,
  accessibility_info,
  parking_info,
  is_active
) VALUES (
  'ea9f8b3c-4d2e-4f5a-9c7d-8e2f1a3b4c5d'::uuid,
  'Eastern Hills High School',
  '5701 Shelton St',
  'Fort Worth',
  'TX',
  '76112',
  32.7555,
  -97.2236,
  'high_school',
  'Accessible gymnasium and restrooms available',
  'Free parking available in school parking lot',
  true
);

-- Create Dallas/Fort Worth Black College Expo event
INSERT INTO public.events (
  id,
  title,
  description,
  event_type,
  start_at,
  end_at,
  venue_id,
  registration_url,
  registration_required,
  status,
  max_attendees,
  attendee_count,
  event_flyer_url,
  contact_email
) VALUES (
  'df8a7c6b-5e4d-3c2b-1a0f-9e8d7c6b5a4f'::uuid,
  '8th Annual Dallas/Fort Worth Black College Expo',
  'Join us for the 8th Annual Dallas/Fort Worth Black College Expo at Eastern Hills High School! Connect with college representatives, learn about scholarships, and discover your path to higher education.',
  'college_fair',
  '2025-11-08 10:00:00-06',
  '2025-11-08 15:00:00-06',
  'ea9f8b3c-4d2e-4f5a-9c7d-8e2f1a3b4c5d'::uuid,
  'https://www.eventbrite.com/e/8th-annual-dallas-fort-worth-black-college-expo-tickets-1350845919509',
  true,
  'upcoming',
  1500,
  0,
  '/images/dallas-fort-worth-flyer.png',
  'info@blackcollegeexpo.com'
);

-- Create floor plan for Eastern Hills High School
INSERT INTO public.floor_plans (
  id,
  venue_id,
  floor_number,
  floor_name,
  canvas_width,
  canvas_height,
  scale_factor,
  grid_opacity
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'ea9f8b3c-4d2e-4f5a-9c7d-8e2f1a3b4c5d'::uuid,
  1,
  'Gymnasium - Main Floor',
  1200,
  800,
  1.0,
  0.6
);