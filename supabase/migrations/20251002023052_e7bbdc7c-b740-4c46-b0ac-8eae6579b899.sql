-- Create athlete_profiles table
CREATE TABLE public.athlete_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  position TEXT,
  graduation_year INTEGER,
  height TEXT,
  weight TEXT,
  gpa NUMERIC(3,2),
  sat_score INTEGER,
  act_score INTEGER,
  athletic_stats JSONB DEFAULT '{}',
  highlight_reel_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, sport)
);

-- Create recruitment_events table
CREATE TABLE public.recruitment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  sport TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create college_connections table
CREATE TABLE public.college_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  coach_name TEXT,
  coach_email TEXT,
  coach_phone TEXT,
  sport TEXT NOT NULL,
  interest_level TEXT DEFAULT 'interested',
  contact_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create athletic_achievements table
CREATE TABLE public.athletic_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  achievement_date DATE,
  organization TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshop_attendance table
CREATE TABLE public.workshop_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.recruitment_events(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  attendance_date TIMESTAMP WITH TIME ZONE,
  completion_certificate_url TEXT,
  notes TEXT,
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletic_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athlete_profiles
CREATE POLICY "Users can manage their own athlete profiles"
ON public.athlete_profiles
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all athlete profiles"
ON public.athlete_profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for recruitment_events
CREATE POLICY "Everyone can view recruitment events"
ON public.recruitment_events
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage recruitment events"
ON public.recruitment_events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for college_connections
CREATE POLICY "Athletes can manage their own college connections"
ON public.college_connections
FOR ALL
USING (athlete_user_id = auth.uid());

CREATE POLICY "Admins can view all college connections"
ON public.college_connections
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for athletic_achievements
CREATE POLICY "Users can manage their own achievements"
ON public.athletic_achievements
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Everyone can view achievements"
ON public.athletic_achievements
FOR SELECT
USING (true);

-- RLS Policies for workshop_attendance
CREATE POLICY "Users can manage their own workshop attendance"
ON public.workshop_attendance
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all workshop attendance"
ON public.workshop_attendance
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for athlete_profiles
CREATE TRIGGER update_athlete_profiles_updated_at
BEFORE UPDATE ON public.athlete_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for recruitment_events
CREATE TRIGGER update_recruitment_events_updated_at
BEFORE UPDATE ON public.recruitment_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for college_connections
CREATE TRIGGER update_college_connections_updated_at
BEFORE UPDATE ON public.college_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();