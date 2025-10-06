-- Extend expo_events table for STEAM events
ALTER TABLE public.expo_events 
ADD COLUMN IF NOT EXISTS prize_pool TEXT,
ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS event_flyer_url TEXT,
ADD COLUMN IF NOT EXISTS registration_link TEXT,
ADD COLUMN IF NOT EXISTS discord_link TEXT,
ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admission_fee TEXT;

-- Insert Super Smash Bros Tournament
INSERT INTO public.expo_events (
  title,
  description,
  event_type,
  event_date,
  end_date,
  location_name,
  address,
  city,
  state,
  zip_code,
  prize_pool,
  activities,
  event_flyer_url,
  registration_link,
  admission_fee,
  schedule,
  is_featured,
  status,
  registration_required,
  max_attendees
) VALUES (
  'STEAM Annual Super Smash Bros Tournament',
  'Join us for an exciting Super Smash Bros tournament featuring competitive gaming, educational seminars, STEAM mobile lab experiences, and scholarship opportunities. Free admission with amazing prizes!',
  'tournament',
  '2025-10-10 10:00:00-07',
  '2025-10-10 14:00:00-07',
  'LA Trade Tech College',
  '400 W Washington Blvd',
  'Los Angeles',
  'CA',
  '90015',
  '$300 + 3 Bounty Quests',
  '["Esports Tournaments", "Educational Seminars", "STEAM Mobile Lab", "Scholarship Information", "Prize Pool & Rewards"]'::jsonb,
  '/src/assets/steam-smash-bros-tournament.jpg',
  'https://forms.gle/steam-smash-registration',
  'Free Admission',
  '[
    {"time": "10:00 AM", "activity": "Doors Open & Registration"},
    {"time": "10:30 AM", "activity": "Opening Ceremony & Welcome"},
    {"time": "11:00 AM", "activity": "Tournament Begins"},
    {"time": "12:00 PM", "activity": "Educational Seminars & Workshops"},
    {"time": "12:30 PM", "activity": "STEAM Mobile Lab Experience"},
    {"time": "01:30 PM", "activity": "Tournament Finals & Awards"},
    {"time": "02:00 PM", "activity": "Event Closes"}
  ]'::jsonb,
  true,
  'upcoming',
  true,
  200
);