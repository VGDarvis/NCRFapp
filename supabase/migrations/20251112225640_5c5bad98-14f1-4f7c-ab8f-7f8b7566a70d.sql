-- Create seminar rooms for Seattle Expo
INSERT INTO seminar_rooms (venue_id, room_name, capacity) VALUES
  ('3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'ROOM 2502', 50),
  ('3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'ROOM 2510', 50),
  ('3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'AUXILARY GYM', 200)
ON CONFLICT DO NOTHING;

-- Insert seminar sessions for Seattle Expo (November 15, 2025)
INSERT INTO seminar_sessions (
  event_id,
  room_id,
  title,
  description,
  presenter_name,
  presenter_title,
  presenter_organization,
  start_time,
  end_time,
  category,
  registration_required
) VALUES
  -- ROOM 2502 Sessions
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2502'),
    'How to Think & Grow Rich: The ABCs of $$$',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-15T10:45:00',
    '2025-11-15T11:30:00',
    'financial_aid',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2502'),
    'Booming Careers: How to Find your Dream Job',
    NULL,
    'Denise Parker',
    'NCRF Manager',
    'Internships & Careers',
    '2025-11-15T11:30:00',
    '2025-11-15T12:15:00',
    'career',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2502'),
    'How to Start a Business & Maintain It',
    NULL,
    'Denise Parker',
    'NCRF Director',
    'Entrepreneurship Academy',
    '2025-11-15T12:30:00',
    '2025-11-15T13:15:00',
    'career',
    false
  ),
  -- ROOM 2510 Sessions
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2510'),
    'Why Attend an HBCU',
    NULL,
    'Ameer Walton',
    'Author',
    'My Historically Black Purpose',
    '2025-11-15T10:45:00',
    '2025-11-15T11:30:00',
    'college_selection',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2510'),
    'How to Find Money for College: Financial Aid, Scholarships',
    NULL,
    NULL,
    NULL,
    'NCRF College & Careers Team',
    '2025-11-15T11:30:00',
    '2025-11-15T12:15:00',
    'financial_aid',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2510'),
    '411 for the Student Athlete',
    NULL,
    NULL,
    NULL,
    'NCRF Student Athlete Program Team',
    '2025-11-15T12:15:00',
    '2025-11-15T13:00:00',
    'general',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'ROOM 2510'),
    'Real Talk: College vs High School',
    NULL,
    NULL,
    NULL,
    'NCRF Team',
    '2025-11-15T13:00:00',
    '2025-11-15T13:45:00',
    'college_selection',
    false
  ),
  -- AUXILARY GYM Sessions
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'AUXILARY GYM'),
    'Why Attend an HBCU',
    NULL,
    'Ameer Walton',
    'Author',
    'My Historically Black Purpose',
    '2025-11-15T11:45:00',
    '2025-11-15T12:30:00',
    'college_selection',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'AUXILARY GYM'),
    'Hip Hop Legend YoYo teaches you ''How to Get A''s in English''',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-15T12:30:00',
    '2025-11-15T13:15:00',
    'general',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'AUXILARY GYM'),
    'From Dreams to Realities',
    NULL,
    'London Brown',
    'Celebrity Actor/Comedian',
    'Ballers & Raising Kanan',
    '2025-11-15T13:15:00',
    '2025-11-15T14:00:00',
    'general',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM seminar_rooms WHERE venue_id = '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' AND room_name = 'AUXILARY GYM'),
    'Entertainment Hour: Money Giveaways, Scholarship Giveaways',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-15T13:45:00',
    '2025-11-15T15:00:00',
    'general',
    false
  );