-- Create booth_presets table for managing available booth numbers and organizations
CREATE TABLE booth_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_type TEXT NOT NULL CHECK (preset_type IN ('booth_number', 'organization')),
  preset_value TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(preset_type, preset_value, event_id)
);

-- Enable RLS
ALTER TABLE booth_presets ENABLE ROW LEVEL SECURITY;

-- Admins can manage presets
CREATE POLICY "Admins can manage booth presets"
  ON booth_presets
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view presets
CREATE POLICY "Public can view booth presets"
  ON booth_presets
  FOR SELECT
  USING (is_active = true);

-- Create index for faster queries
CREATE INDEX idx_booth_presets_type_event ON booth_presets(preset_type, event_id);

-- Seed data for Houston event
DO $$
DECLARE
  houston_event_id UUID;
  booth_num INTEGER;
BEGIN
  -- Find Houston event
  SELECT id INTO houston_event_id 
  FROM events 
  WHERE title ILIKE '%Houston%Black%College%Expo%' 
  LIMIT 1;

  -- Insert booth numbers (100-522, even numbers only)
  FOR booth_num IN 100..522 BY 2 LOOP
    INSERT INTO booth_presets (preset_type, preset_value, event_id, display_order)
    VALUES ('booth_number', booth_num::TEXT, houston_event_id, booth_num);
  END LOOP;

  -- Insert 48 organizations
  INSERT INTO booth_presets (preset_type, preset_value, event_id, display_order) VALUES
    ('organization', '5 STRONG SCHOLARSHIP FOUNDATION HOUSTON', houston_event_id, 1),
    ('organization', 'ALABAMA A&M UNIVERSITY', houston_event_id, 2),
    ('organization', 'ALABAMA STATE UNIVERSITY', houston_event_id, 3),
    ('organization', 'ALCORN STATE UNIVERSITY', houston_event_id, 4),
    ('organization', 'BENEDICT COLLEGE', houston_event_id, 5),
    ('organization', 'CALIFORNIA STATE UNIVERSITY FULLERTON', houston_event_id, 6),
    ('organization', 'CALIFORNIA STATE UNIVERSITY SACRAMENTO', houston_event_id, 7),
    ('organization', 'CLARK ATLANTA UNIVERSITY', houston_event_id, 8),
    ('organization', 'COLUMBIA COLLEGE CHICAGO', houston_event_id, 9),
    ('organization', 'CONCORDIA UNIVERSITY TEXAS', houston_event_id, 10),
    ('organization', 'COMERICA BANK', houston_event_id, 11),
    ('organization', 'DELAWARE STATE UNIVERSITY', houston_event_id, 12),
    ('organization', 'EDWARD WATERS UNIVERSITY', houston_event_id, 13),
    ('organization', 'FLORIDA AGRICULTURAL & MECHANICAL UNIVERSITY', houston_event_id, 14),
    ('organization', 'FOUNDATION CLOTHING', houston_event_id, 15),
    ('organization', 'HAMPTON UNIVERSITY', houston_event_id, 16),
    ('organization', 'HARRIS-STOWE STATE UNIVERSITY', houston_event_id, 17),
    ('organization', 'HOWARD UNIVERSITY', houston_event_id, 18),
    ('organization', 'HUSTON TILLOTSON UNIVERSITY', houston_event_id, 19),
    ('organization', 'HARRIS COUNTY TAX OFFICE', houston_event_id, 20),
    ('organization', 'IHEART LASH & BEAUTY ACADEMY', houston_event_id, 21),
    ('organization', 'JACKSON STATE UNIVERSITY', houston_event_id, 22),
    ('organization', 'JOHNSON C. SMITH UNIVERSITY', houston_event_id, 23),
    ('organization', 'LEGACY YOUTH TRAVEL', houston_event_id, 24),
    ('organization', 'LEMOYNE OWEN COLLEGE', houston_event_id, 25),
    ('organization', 'LIBERTY UNIVERSITY', houston_event_id, 26),
    ('organization', 'LIVINGSTONE COLLEGE', houston_event_id, 27),
    ('organization', 'LONG ISLAND UNIVERSITY', houston_event_id, 28),
    ('organization', 'NCRF INTERNSHIPS AND CAREERS/ NCRF INFORMATION', houston_event_id, 29),
    ('organization', 'NCRF STUDENT ATHLETE PROGRAM (SAP)', houston_event_id, 30),
    ('organization', 'PAIN COLLEGE', houston_event_id, 31),
    ('organization', 'PHILANDER SMITH UNIVERSITY', houston_event_id, 32),
    ('organization', 'SAN DIEGO STATE UNIVERSITY', houston_event_id, 33),
    ('organization', 'SOUTH CAROLINA STATE UNIVERSITY', houston_event_id, 34),
    ('organization', 'SPOTR', houston_event_id, 35),
    ('organization', 'STANFORD UNIVERSITY', houston_event_id, 36),
    ('organization', 'TALLADEGA COLLEGE', houston_event_id, 37),
    ('organization', 'TEXAS SOUTHERN UNIVERSITY', houston_event_id, 38),
    ('organization', 'TEXAS WATER UTILITIES', houston_event_id, 39),
    ('organization', 'UNITED NEGRO COLLEGE FUND', houston_event_id, 40),
    ('organization', 'UNITED STATES COAST GUARD', houston_event_id, 41),
    ('organization', 'UNITED STATES HELP DESK ACADEMY', houston_event_id, 42),
    ('organization', 'UNITED STATES NAVAL ACADEMY', houston_event_id, 43),
    ('organization', 'UNIVERSITY OF HOUSTON', houston_event_id, 44),
    ('organization', 'UNIVERSITY OF WASHINGTON BOTHELL', houston_event_id, 45),
    ('organization', 'VIRGINIA MILITARY INSTITUTE', houston_event_id, 46),
    ('organization', 'WILEY UNIVERSITY', houston_event_id, 47);
END $$;