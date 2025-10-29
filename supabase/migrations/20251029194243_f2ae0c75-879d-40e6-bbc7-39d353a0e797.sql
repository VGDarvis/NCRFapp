-- Seed actual Houston BCE 2025 seminar data
DO $$
DECLARE
  v_event_id UUID;
  v_venue_id UUID;
  v_room_100a UUID;
  v_room_102 UUID;
  v_room_103 UUID;
  v_stage UUID;
BEGIN
  -- Get Houston event
  SELECT id, venue_id INTO v_event_id, v_venue_id
  FROM events 
  WHERE title ILIKE '%Houston%'
  AND status = 'upcoming'
  ORDER BY start_at DESC
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE NOTICE 'No Houston event found';
    RETURN;
  END IF;

  -- Check/create rooms
  SELECT id INTO v_room_100a FROM seminar_rooms WHERE venue_id = v_venue_id AND room_number = 'Room 100A/101A';
  IF v_room_100a IS NULL THEN
    INSERT INTO seminar_rooms (venue_id, room_name, room_number, capacity)
    VALUES (v_venue_id, 'Entrepreneurship Hall', 'Room 100A/101A', 200)
    RETURNING id INTO v_room_100a;
  END IF;

  SELECT id INTO v_room_102 FROM seminar_rooms WHERE venue_id = v_venue_id AND room_number = 'Room 102';
  IF v_room_102 IS NULL THEN
    INSERT INTO seminar_rooms (venue_id, room_name, room_number, capacity)
    VALUES (v_venue_id, 'College Prep Hall', 'Room 102', 150)
    RETURNING id INTO v_room_102;
  END IF;

  SELECT id INTO v_room_103 FROM seminar_rooms WHERE venue_id = v_venue_id AND room_number = 'Room 103';
  IF v_room_103 IS NULL THEN
    INSERT INTO seminar_rooms (venue_id, room_name, room_number, capacity)
    VALUES (v_venue_id, 'HBCU Focus Hall', 'Room 103', 150)
    RETURNING id INTO v_room_103;
  END IF;

  SELECT id INTO v_stage FROM seminar_rooms WHERE venue_id = v_venue_id AND room_number = 'STAGE';
  IF v_stage IS NULL THEN
    INSERT INTO seminar_rooms (venue_id, room_name, room_number, capacity)
    VALUES (v_venue_id, 'Main Stage', 'STAGE', 500)
    RETURNING id INTO v_stage;
  END IF;

  -- Clear and insert seminars
  DELETE FROM seminar_sessions WHERE event_id = v_event_id;

  INSERT INTO seminar_sessions (event_id, room_id, title, description, category, start_time, end_time, presenter_name, presenter_organization, target_audience, max_capacity)
  VALUES
    (v_event_id, v_room_100a, 'How to Think & Grow Rich', 'An Experience & Opportunity to Build your Wealth Today! "Hands on Banking" powered by Wells Fargo', 'entrepreneurship', 
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '10:45:00', 
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '12:30:00',
     'Wells Fargo Staff', 'Wells Fargo', ARRAY['high_school', 'parents', 'adults'], 200),
    
    (v_event_id, v_room_100a, 'Booming Careers - How to Find your Dream Job', 'Discover strategies for landing your ideal career', 'career_prep',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '12:30:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:15:00',
     'Denise Parker', 'NCRF - Manager, Internships & Careers', ARRAY['high_school', 'college', 'adults'], 200),
    
    (v_event_id, v_room_100a, 'How to Start a Business & Maintain It', 'Learn the fundamentals of entrepreneurship and business sustainability', 'entrepreneurship',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:15:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '14:00:00',
     'Denise Parker', 'NCRF - Director of Entrepreneurship Academy', ARRAY['high_school', 'college', 'adults'], 200),
    
    (v_event_id, v_room_102, 'How to Find Money for College', 'Financial Aid, Scholarships, and Funding Opportunities', 'financial_aid',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '11:30:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '12:15:00',
     'NCRF College & Careers Team', 'NCRF', ARRAY['high_school', 'parents'], 150),
    
    (v_event_id, v_room_102, '411 for the Student Athlete', 'Everything student athletes need to know about college recruitment', 'athletics',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '12:15:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:00:00',
     'NCRF Student Athlete Program Staff', 'NCRF', ARRAY['high_school', 'athletes'], 150),
    
    (v_event_id, v_room_102, 'Real Talk - College vs High School', 'Honest conversation about transitioning from high school to college', 'college_readiness',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:00:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:45:00',
     'NCRF Staff', 'NCRF', ARRAY['high_school'], 150),
    
    (v_event_id, v_room_103, 'Why Attend an HBCU', 'Discover the unique benefits and legacy of Historically Black Colleges and Universities', 'hbcu_focus',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '11:00:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '12:00:00',
     'Ameer Walton', 'Author - "My Historically Black Purpose"', ARRAY['high_school', 'parents'], 150),
    
    (v_event_id, v_room_103, 'From Dreams to Realities', 'Inspirational talk with celebrity actor and comedian', 'motivation',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:00:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:45:00',
     'London Brown', 'Celebrity Actor/Comedian - "Ballers" & "Raising Kanan"', ARRAY['all'], 150),
    
    (v_event_id, v_stage, 'Entertainment Engagement', 'Scholarship Presentations, Performances, and Cash Giveaways', 'entertainment',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '13:45:00',
     (SELECT start_at::date FROM events WHERE id = v_event_id) + TIME '15:00:00',
     'NCRF Team', 'NCRF', ARRAY['all'], 500);

  RAISE NOTICE 'Seeded 9 seminars for Houston event';
END $$;