-- Houston 2025 College Expo Seed Data
-- This script populates the database with realistic data for testing

-- Insert NRG Center venue
INSERT INTO venues (name, address, city, state, zip_code, latitude, longitude, capacity, amenities, parking_info, accessibility_info, website_url, contact_email, contact_phone, timezone)
VALUES (
  'NRG Center',
  'One NRG Parkway',
  'Houston',
  'TX',
  '77054',
  29.6847,
  -95.4107,
  72000,
  '{"wifi": true, "restaurants": true, "parking": "On-site", "restrooms": true, "accessibility": "Full ADA compliance"}'::jsonb,
  'Multiple parking lots available. $20 per vehicle. Premium parking $40.',
  'Full ADA compliance with wheelchair accessible entrances, elevators, and restrooms throughout the facility.',
  'https://www.nrgpark.com',
  'info@nrgpark.com',
  '(832) 667-1400',
  'America/Chicago'
)
ON CONFLICT DO NOTHING;

-- Insert Houston 2025 College Expo event
INSERT INTO events (title, description, event_type, start_at, end_at, venue_id, status, registration_required, capacity, max_attendees, is_virtual, event_flyer_url, contact_email, contact_phone, category, audience)
SELECT 
  'Houston College & Career Expo 2025',
  'Join us for the largest college fair in Texas! Meet representatives from over 100 colleges, universities, HBCUs, and trade schools. Attend free SAT prep workshops, scholarship seminars, and on-the-spot admissions.',
  'college_fair',
  '2025-03-15 09:00:00-06'::timestamptz,
  '2025-03-15 17:00:00-06'::timestamptz,
  v.id,
  'upcoming',
  true,
  5000,
  5000,
  false,
  '/images/houston-expo-flyer.png',
  'houston@ncrf.org',
  '(832) 555-0100',
  ARRAY['college_fair', 'career_expo', 'hbcu_focus'],
  ARRAY['high_school', 'parents', 'educators']
FROM venues v WHERE v.name = 'NRG Center'
ON CONFLICT DO NOTHING;

-- Insert sponsors (colleges and organizations)
INSERT INTO sponsors (name, organization_type, sponsor_tier, logo_url, website_url, contact_email, contact_phone, address, city, state, zip_code, description)
VALUES
  -- Platinum Sponsors
  ('Texas Southern University', 'HBCU', 'platinum', 'https://www.tsu.edu/logo.png', 'https://www.tsu.edu', 'admissions@tsu.edu', '(713) 313-7420', '3100 Cleburne Street', 'Houston', 'TX', '77004', 'Premier HBCU in Houston offering 100+ degree programs'),
  ('Prairie View A&M University', 'HBCU', 'platinum', 'https://www.pvamu.edu/logo.png', 'https://www.pvamu.edu', 'admissions@pvamu.edu', '(936) 261-1000', 'PO Box 519', 'Prairie View', 'TX', '77446', 'The second-oldest public institution of higher education in Texas'),
  ('University of Houston', 'University', 'platinum', 'https://www.uh.edu/logo.png', 'https://www.uh.edu', 'admissions@uh.edu', '(713) 743-1010', '4800 Calhoun Road', 'Houston', 'TX', '77004', 'Tier One research university in the heart of Houston'),
  
  -- Gold Sponsors
  ('Rice University', 'University', 'gold', 'https://www.rice.edu/logo.png', 'https://www.rice.edu', 'admission@rice.edu', '(713) 348-0000', '6100 Main Street', 'Houston', 'TX', '77005', 'Top-ranked private research university'),
  ('Texas A&M University', 'University', 'gold', 'https://www.tamu.edu/logo.png', 'https://www.tamu.edu', 'admissions@tamu.edu', '(979) 845-3741', 'College Station', 'College Station', 'TX', '77843', 'Flagship institution of the Texas A&M University System'),
  ('University of Texas at Austin', 'University', 'gold', 'https://www.utexas.edu/logo.png', 'https://www.utexas.edu', 'admissions@utexas.edu', '(512) 475-7348', '110 Inner Campus Drive', 'Austin', 'TX', '78712', 'The flagship university of the University of Texas System'),
  ('Howard University', 'HBCU', 'gold', 'https://www.howard.edu/logo.png', 'https://www.howard.edu', 'admission@howard.edu', '(202) 806-2763', '2400 Sixth Street NW', 'Washington', 'DC', '20059', 'Private HBCU in the nation''s capital'),
  
  -- Silver Sponsors
  ('Spelman College', 'HBCU', 'silver', 'https://www.spelman.edu/logo.png', 'https://www.spelman.edu', 'admiss@spelman.edu', '(404) 681-3643', '350 Spelman Lane SW', 'Atlanta', 'GA', '30314', 'Leading liberal arts college for Black women'),
  ('Morehouse College', 'HBCU', 'silver', 'https://www.morehouse.edu/logo.png', 'https://www.morehouse.edu', 'admissions@morehouse.edu', '(404) 681-2800', '830 Westview Drive SW', 'Atlanta', 'GA', '30314', 'Private HBCU for men in Atlanta'),
  ('Florida A&M University', 'HBCU', 'silver', 'https://www.famu.edu/logo.png', 'https://www.famu.edu', 'admissions@famu.edu', '(850) 599-3796', '1601 S Martin Luther King Jr Blvd', 'Tallahassee', 'FL', '32307', 'Top-ranked public HBCU in Florida'),
  ('Houston Community College', 'Community College', 'silver', 'https://www.hccs.edu/logo.png', 'https://www.hccs.edu', 'admissions@hccs.edu', '(713) 718-2000', '3100 Main Street', 'Houston', 'TX', '77002', 'Largest community college system in Texas'),
  ('Lone Star College', 'Community College', 'silver', 'https://www.lonestar.edu/logo.png', 'https://www.lonestar.edu', 'admissions@lonestar.edu', '(832) 813-6500', '5000 Research Forest Drive', 'The Woodlands', 'TX', '77381', 'Multi-campus community college system'),
  
  -- Bronze Sponsors
  ('San Jacinto College', 'Community College', 'bronze', 'https://www.sanjac.edu/logo.png', 'https://www.sanjac.edu', 'info@sanjac.edu', '(281) 998-6150', '8060 Spencer Highway', 'Pasadena', 'TX', '77505', 'Serving Houston-area students since 1961'),
  ('Texas State Technical College', 'Trade School', 'bronze', 'https://www.tstc.edu/logo.png', 'https://www.tstc.edu', 'info@tstc.edu', '(800) 792-8784', '3801 Campus Drive', 'Waco', 'TX', '76705', 'Technical education statewide'),
  ('U.S. Army Recruiting', 'Military', 'bronze', 'https://www.goarmy.com/logo.png', 'https://www.goarmy.com', 'recruiting@army.mil', '(800) 872-8272', 'Various Locations', 'Houston', 'TX', '77001', 'Serve your country while earning education benefits'),
  ('U.S. Navy Recruiting', 'Military', 'bronze', 'https://www.navy.com/logo.png', 'https://www.navy.com', 'recruiting@navy.mil', '(800) 872-6289', 'Various Locations', 'Houston', 'TX', '77001', 'Join the world''s most powerful navy'),
  ('Gates Millennium Scholars Program', 'Scholarship Org', 'bronze', 'https://www.gmsp.org/logo.png', 'https://www.gmsp.org', 'info@gmsp.org', '(877) 690-4677', 'PO Box 10500', 'Fairfax', 'VA', '22031', 'Full scholarship for outstanding minority students')
ON CONFLICT DO NOTHING;

-- Insert floor plan for NRG Center
INSERT INTO floor_plans (venue_id, floor_number, floor_name, image_url, width_meters, height_meters, scale_factor)
SELECT 
  v.id,
  1,
  'Main Exhibition Hall',
  '/floor-plans/nrg-center-main-hall.svg',
  200,
  150,
  0.1
FROM venues v WHERE v.name = 'NRG Center'
ON CONFLICT DO NOTHING;

-- Insert booths with coordinates
-- This creates a grid layout with 100+ booths
WITH event_data AS (
  SELECT e.id as event_id, v.id as venue_id, f.id as floor_plan_id
  FROM events e
  JOIN venues v ON e.venue_id = v.id
  JOIN floor_plans f ON f.venue_id = v.id
  WHERE e.title = 'Houston College & Career Expo 2025'
  LIMIT 1
)
INSERT INTO booths (event_id, venue_id, floor_plan_id, sponsor_id, org_name, org_type, table_no, x_position, y_position, booth_width, booth_depth, sponsor_tier, offers_on_spot_admission, waives_application_fee, scholarship_info, description, contact_email, contact_phone, website_url, logo_url)
SELECT 
  ed.event_id,
  ed.venue_id,
  ed.floor_plan_id,
  s.id,
  s.name,
  s.organization_type,
  'A' || LPAD((ROW_NUMBER() OVER ())::text, 3, '0'),
  ((ROW_NUMBER() OVER () - 1) % 10) * 20 + 10,
  ((ROW_NUMBER() OVER () - 1) / 10) * 15 + 10,
  8,
  6,
  s.sponsor_tier,
  CASE WHEN s.organization_type IN ('HBCU', 'University') THEN random() > 0.7 ELSE false END,
  CASE WHEN s.organization_type IN ('HBCU', 'Community College') THEN random() > 0.5 ELSE false END,
  CASE WHEN random() > 0.4 THEN 'Scholarships available - inquire at booth' ELSE NULL END,
  s.description,
  s.contact_email,
  s.contact_phone,
  s.website_url,
  s.logo_url
FROM sponsors s
CROSS JOIN event_data ed
ON CONFLICT DO NOTHING;

-- Insert seminar rooms
WITH venue_data AS (
  SELECT v.id as venue_id, f.id as floor_plan_id
  FROM venues v
  JOIN floor_plans f ON f.venue_id = v.id
  WHERE v.name = 'NRG Center'
  LIMIT 1
)
INSERT INTO seminar_rooms (venue_id, floor_plan_id, room_name, room_number, capacity, x_position, y_position, amenities)
SELECT 
  vd.venue_id,
  vd.floor_plan_id,
  'Conference Room ' || series,
  'CR-' || series,
  CASE series
    WHEN 'A' THEN 200
    WHEN 'B' THEN 150
    ELSE 100
  END,
  180,
  series_num * 30 + 20,
  ARRAY['projector', 'microphone', 'wifi', 'whiteboard']
FROM venue_data vd
CROSS JOIN (
  SELECT chr(65 + generate_series) as series, generate_series as series_num
  FROM generate_series(0, 2)
) rooms
ON CONFLICT DO NOTHING;

-- Insert seminar sessions
WITH event_data AS (
  SELECT e.id as event_id
  FROM events e
  WHERE e.title = 'Houston College & Career Expo 2025'
  LIMIT 1
),
room_data AS (
  SELECT id, room_name FROM seminar_rooms LIMIT 3
)
INSERT INTO seminar_sessions (event_id, room_id, title, description, presenter_name, presenter_title, presenter_organization, start_time, end_time, category, target_audience, max_capacity, registration_required)
SELECT 
  ed.event_id,
  rd.id,
  session.title,
  session.description,
  session.presenter_name,
  session.presenter_title,
  session.presenter_org,
  '2025-03-15 ' || session.start_time || '-06'::timestamptz,
  '2025-03-15 ' || session.end_time || '-06'::timestamptz,
  session.category,
  session.target_audience,
  200,
  true
FROM event_data ed
CROSS JOIN room_data rd
CROSS JOIN (
  VALUES
    ('SAT Prep Strategies', 'Learn proven strategies to boost your SAT score by 200+ points', 'Dr. Michael Chen', 'Test Prep Director', 'Princeton Review', '10:00:00', '11:00:00', 'test_prep', ARRAY['high_school']),
    ('FAFSA Workshop', 'Step-by-step guidance on completing the FAFSA form', 'Jennifer Rodriguez', 'Financial Aid Counselor', 'Texas Education Agency', '11:30:00', '12:30:00', 'financial_aid', ARRAY['high_school', 'parents']),
    ('HBCU Excellence Panel', 'Why choose an HBCU? Hear from current students and alumni', 'Panel Discussion', 'Various', 'HBCU Network', '13:00:00', '14:00:00', 'hbcu_focus', ARRAY['high_school']),
    ('Scholarship Secrets', 'How to find and win scholarships worth thousands', 'Sarah Johnson', 'Scholarship Coach', 'ScholarshipOwl', '14:30:00', '15:30:00', 'scholarships', ARRAY['high_school']),
    ('Career Pathways in STEM', 'Explore exciting careers in science, technology, engineering, and math', 'Dr. James Williams', 'STEM Director', 'NASA Houston', '16:00:00', '17:00:00', 'career_prep', ARRAY['high_school'])
) AS session(title, description, presenter_name, presenter_title, presenter_org, start_time, end_time, category, target_audience)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Houston 2025 College Expo seed data loaded successfully!';
  RAISE NOTICE 'Event: Houston College & Career Expo 2025 at NRG Center';
  RAISE NOTICE 'Date: March 15, 2025, 9:00 AM - 5:00 PM';
  RAISE NOTICE 'Booths: Check booths table for 100+ exhibitors';
  RAISE NOTICE 'Seminars: 5 sessions across 3 conference rooms';
END $$;
