-- Create floor_plans table for venue floor layouts
CREATE TABLE public.floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL DEFAULT 1,
  floor_name TEXT,
  svg_data TEXT, -- SVG path data for floor outline
  image_url TEXT, -- URL to floor plan image
  width_meters NUMERIC, -- Physical width in meters
  height_meters NUMERIC, -- Physical height in meters
  scale_factor NUMERIC DEFAULT 1.0, -- Pixels to meters conversion
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enhance booths table with floor plan coordinates
ALTER TABLE public.booths
  ADD COLUMN IF NOT EXISTS floor_plan_id UUID REFERENCES public.floor_plans(id),
  ADD COLUMN IF NOT EXISTS x_position NUMERIC, -- X coordinate on floor plan
  ADD COLUMN IF NOT EXISTS y_position NUMERIC, -- Y coordinate on floor plan
  ADD COLUMN IF NOT EXISTS booth_width NUMERIC DEFAULT 3, -- Width in meters
  ADD COLUMN IF NOT EXISTS booth_depth NUMERIC DEFAULT 3; -- Depth in meters

-- Create seminar_rooms table
CREATE TABLE public.seminar_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  floor_plan_id UUID REFERENCES public.floor_plans(id),
  room_name TEXT NOT NULL,
  room_number TEXT,
  capacity INTEGER,
  x_position NUMERIC,
  y_position NUMERIC,
  amenities JSONB DEFAULT '[]'::jsonb, -- ['projector', 'whiteboard', 'microphone']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create seminar_sessions table
CREATE TABLE public.seminar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.seminar_rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  presenter_name TEXT,
  presenter_title TEXT,
  presenter_organization TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  category TEXT, -- 'financial_aid', 'admissions', 'career_prep', 'athletics'
  target_audience TEXT[], -- ['high_school', 'transfer', 'parents']
  max_capacity INTEGER,
  registration_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create venue_amenities table (restrooms, food, exits, etc.)
CREATE TABLE public.venue_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  floor_plan_id UUID REFERENCES public.floor_plans(id),
  amenity_type TEXT NOT NULL, -- 'restroom', 'food', 'exit', 'first_aid', 'info_desk'
  amenity_name TEXT,
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL,
  icon_name TEXT, -- Lucide icon name
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_booth_favorites table
CREATE TABLE public.user_booth_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booth_id UUID NOT NULL REFERENCES public.booths(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  visit_order INTEGER, -- For route optimization
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, booth_id, event_id)
);

-- Create booth_check_ins table for tracking visits
CREATE TABLE public.booth_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booth_id UUID NOT NULL REFERENCES public.booths(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_in_method TEXT DEFAULT 'qr_scan', -- 'qr_scan', 'manual', 'auto'
  session_id TEXT, -- For guest check-ins
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all new tables
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_booth_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booth_check_ins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for floor_plans
CREATE POLICY "Public can view floor plans"
  ON public.floor_plans FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage floor plans"
  ON public.floor_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for seminar_rooms
CREATE POLICY "Public can view seminar rooms"
  ON public.seminar_rooms FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage seminar rooms"
  ON public.seminar_rooms FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for seminar_sessions
CREATE POLICY "Public can view seminar sessions"
  ON public.seminar_sessions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage seminar sessions"
  ON public.seminar_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for venue_amenities
CREATE POLICY "Public can view venue amenities"
  ON public.venue_amenities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage venue amenities"
  ON public.venue_amenities FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_booth_favorites
CREATE POLICY "Users can manage their own favorites"
  ON public.user_booth_favorites FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all favorites"
  ON public.user_booth_favorites FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for booth_check_ins
CREATE POLICY "Users can view their own check-ins"
  ON public.booth_check_ins FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create check-ins"
  ON public.booth_check_ins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all check-ins"
  ON public.booth_check_ins FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_floor_plans_venue ON public.floor_plans(venue_id);
CREATE INDEX idx_booths_floor_plan ON public.booths(floor_plan_id);
CREATE INDEX idx_seminar_rooms_venue ON public.seminar_rooms(venue_id);
CREATE INDEX idx_seminar_sessions_event ON public.seminar_sessions(event_id);
CREATE INDEX idx_seminar_sessions_time ON public.seminar_sessions(start_time, end_time);
CREATE INDEX idx_venue_amenities_floor_plan ON public.venue_amenities(floor_plan_id);
CREATE INDEX idx_user_booth_favorites_user ON public.user_booth_favorites(user_id);
CREATE INDEX idx_booth_check_ins_booth ON public.booth_check_ins(booth_id);
CREATE INDEX idx_booth_check_ins_user ON public.booth_check_ins(user_id);

-- Add updated_at trigger to seminar_sessions
CREATE TRIGGER update_seminar_sessions_updated_at
  BEFORE UPDATE ON public.seminar_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();