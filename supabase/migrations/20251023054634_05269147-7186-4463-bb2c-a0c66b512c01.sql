-- Part 1: Create venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  map_region TEXT,
  floor_plans JSONB DEFAULT '[]',
  capacity INTEGER,
  parking_info TEXT,
  accessibility_info TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  venue_type TEXT DEFAULT 'conference_center',
  amenities JSONB DEFAULT '[]',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_venues_city_state ON venues(city, state);
CREATE INDEX idx_venues_lat_lng ON venues(latitude, longitude);

-- Part 2: Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'college_fair',
  category TEXT[],
  audience TEXT[],
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  registration_url TEXT,
  registration_required BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  capacity INTEGER,
  max_attendees INTEGER,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  image_url TEXT,
  event_flyer_url TEXT,
  status TEXT DEFAULT 'upcoming',
  highlights JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '[]',
  activities JSONB DEFAULT '[]',
  contact_email TEXT,
  contact_phone TEXT,
  discord_link TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  attendee_count INTEGER DEFAULT 0,
  legacy_expo_event_id UUID REFERENCES expo_events(id) ON DELETE SET NULL,
  nft_contract_address TEXT,
  requires_wallet BOOLEAN DEFAULT false
);

CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events USING GIN(category);

-- Part 3: Create sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT DEFAULT 'bronze',
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  sponsorship_amount NUMERIC(10, 2),
  sponsorship_start_date DATE,
  sponsorship_end_date DATE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sponsors_tier ON sponsors(tier);
CREATE INDEX idx_sponsors_active ON sponsors(is_active);

-- Part 4: Create booths table
CREATE TABLE booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
  org_name TEXT NOT NULL,
  org_type TEXT DEFAULT 'college',
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  floor_number INTEGER DEFAULT 1,
  table_no TEXT,
  zone TEXT,
  sponsor_tier TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  offers_on_spot_admission BOOLEAN DEFAULT false,
  waives_application_fee BOOLEAN DEFAULT false,
  scholarship_info TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_booths_event_id ON booths(event_id);
CREATE INDEX idx_booths_org_name ON booths(org_name);
CREATE INDEX idx_booths_lat_lng ON booths(latitude, longitude);

-- Part 5: Create tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'general',
  color TEXT DEFAULT '#3b82f6',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Part 6: Create event_tags junction table
CREATE TABLE event_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, tag_id)
);

CREATE INDEX idx_event_tags_event_id ON event_tags(event_id);
CREATE INDEX idx_event_tags_tag_id ON event_tags(tag_id);

-- Part 7: Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student',
  grade_level TEXT,
  school_name TEXT,
  graduation_year INTEGER,
  status TEXT DEFAULT 'registered',
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID,
  qr_code TEXT NOT NULL UNIQUE,
  qr_code_image_url TEXT,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_text TEXT,
  colleges_visited TEXT[],
  wallet_address TEXT,
  nft_certificate_url TEXT,
  nft_minted_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT now(),
  confirmation_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_qr_code ON registrations(qr_code);
CREATE INDEX idx_registrations_status ON registrations(status);

-- Part 8: Create saved_events table
CREATE TABLE saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_saved_events_user_id ON saved_events(user_id);
CREATE INDEX idx_saved_events_event_id ON saved_events(event_id);

-- Part 9: Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

-- Part 10: RLS Policies - Public Read
CREATE POLICY "Public can view venues" ON venues FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view sponsors" ON sponsors FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view booths" ON booths FOR SELECT USING (true);
CREATE POLICY "Public can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can view event_tags" ON event_tags FOR SELECT USING (true);

-- Part 11: RLS Policies - Admin Write
CREATE POLICY "Admins can manage venues" ON venues FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage sponsors" ON sponsors FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage booths" ON booths FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage event_tags" ON event_tags FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Part 12: RLS Policies - Registrations
CREATE POLICY "Anyone can register for events" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own registrations" ON registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Public can view registrations by qr_code" ON registrations FOR SELECT USING (true);
CREATE POLICY "Admins can manage all registrations" ON registrations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update their own registrations" ON registrations FOR UPDATE USING (user_id = auth.uid());

-- Part 13: RLS Policies - Saved Events
CREATE POLICY "Users can manage their saved events" ON saved_events FOR ALL USING (user_id = auth.uid());

-- Part 14: Update Triggers
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booths_updated_at BEFORE UPDATE ON booths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Part 15: Seed tags
INSERT INTO tags (name, category, color) VALUES
  ('HBCU', 'program', '#10b981'),
  ('STEM', 'program', '#3b82f6'),
  ('Trade Schools', 'program', '#f59e0b'),
  ('Military Friendly', 'feature', '#ef4444'),
  ('Students', 'audience', '#8b5cf6'),
  ('Parents', 'audience', '#ec4899'),
  ('Counselors', 'audience', '#14b8a6'),
  ('On-Spot Admission', 'feature', '#10b981'),
  ('Scholarships Available', 'feature', '#eab308'),
  ('Application Fee Waived', 'feature', '#06b6d4');

-- Part 16: Insert NRG Center Venue
INSERT INTO venues (
  name, address, city, state, zip_code, latitude, longitude,
  map_region, capacity, venue_type, parking_info, accessibility_info,
  contact_phone, amenities
) VALUES (
  'NRG Center',
  '1 Fannin St, NRG Park',
  'Houston',
  'TX',
  '77054',
  29.6847,
  -95.4107,
  'Houston Metro',
  26000,
  'convention_center',
  'Free parking available at NRG Park lots',
  'Wheelchair accessible, ADA compliant facilities',
  '832-667-1400',
  '["WiFi", "Food Court", "Parking", "Air Conditioning", "Restrooms", "First Aid"]'
);

-- Part 17: Insert Sponsors
INSERT INTO sponsors (name, tier, website_url, display_order) VALUES
  ('National College Resources Foundation', 'platinum', 'https://NCRFoundation.org', 1),
  ('Honda', 'gold', 'https://honda.com', 2),
  ('Wells Fargo', 'gold', 'https://wellsfargo.com', 3),
  ('Comerica Bank', 'silver', 'https://comerica.com', 4),
  ('Found', 'silver', NULL, 5);

-- Part 18: Insert Houston Black College Expo Event
INSERT INTO events (
  title, description, event_type, category, audience,
  start_at, end_at, venue_id, registration_url,
  registration_required, capacity, status, event_flyer_url,
  highlights, schedule, contact_email
) VALUES (
  'Houston Black College Expo™',
  'Connect with 50+ HBCUs, universities, certificate programs, and trade schools. Get accepted on the spot, access millions in scholarships, and attend life-changing seminars.',
  'college_fair',
  ARRAY['HBCU', 'Trade Schools', 'Scholarships'],
  ARRAY['students', 'parents', 'counselors'],
  '2025-11-01 10:00:00-06',
  '2025-11-01 15:00:00-06',
  (SELECT id FROM venues WHERE name = 'NRG Center' LIMIT 1),
  'https://NCRFoundation.org',
  true,
  5000,
  'upcoming',
  '/assets/expo-flyers/expo-houston-2.png',
  '[
    "Meet with over 50 colleges",
    "Get accepted on the spot",
    "Millions in scholarships available",
    "Some colleges waive application fees",
    "Certificate and trade schools",
    "Life changing seminars",
    "Celebrities and prizes"
  ]'::jsonb,
  '[
    {"time": "10:00 AM", "activity": "Registration & Check-in Opens"},
    {"time": "10:30 AM", "activity": "Welcome & Opening Remarks"},
    {"time": "11:00 AM", "activity": "College Fair Begins - Visit Booths"},
    {"time": "12:00 PM", "activity": "Financial Aid Workshop"},
    {"time": "1:00 PM", "activity": "HBCU Panel Discussion"},
    {"time": "2:00 PM", "activity": "Scholarship Essay Tips Workshop"},
    {"time": "3:00 PM", "activity": "Event Concludes & Prize Drawing"}
  ]'::jsonb,
  'info@ncrfoundation.org'
);

-- Part 19: Link Event to Tags
INSERT INTO event_tags (event_id, tag_id)
SELECT 
  (SELECT id FROM events WHERE title = 'Houston Black College Expo™' LIMIT 1),
  id
FROM tags
WHERE name IN ('HBCU', 'Students', 'Parents', 'Counselors', 'On-Spot Admission', 'Scholarships Available', 'Application Fee Waived');