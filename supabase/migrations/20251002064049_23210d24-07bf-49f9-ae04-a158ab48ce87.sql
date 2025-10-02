-- Create expo_events table for college expo event information
CREATE TABLE public.expo_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'college_fair',
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  registration_required BOOLEAN DEFAULT true,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  contact_email TEXT,
  contact_phone TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  parking_info TEXT,
  accessibility_info TEXT,
  featured_colleges TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scholarship_opportunities table for automated scholarship database
CREATE TABLE public.scholarship_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  provider_name TEXT NOT NULL,
  provider_url TEXT,
  amount_min NUMERIC,
  amount_max NUMERIC,
  deadline DATE NOT NULL,
  eligibility_criteria TEXT,
  academic_requirements TEXT,
  essay_required BOOLEAN DEFAULT false,
  recommendation_letters_required INTEGER DEFAULT 0,
  gpa_requirement NUMERIC,
  major_restrictions TEXT[],
  demographic_requirements TEXT[],
  geographic_restrictions TEXT[],
  application_url TEXT NOT NULL,
  auto_discovered BOOLEAN DEFAULT false,
  source_url TEXT,
  status TEXT DEFAULT 'active',
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scholarship_applications table for tracking student applications
CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scholarship_id UUID NOT NULL REFERENCES public.scholarship_opportunities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'planning',
  application_date DATE,
  submission_date DATE,
  decision_date DATE,
  award_amount NUMERIC,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor_information table for monthly donor management
CREATE TABLE public.donor_information (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_type TEXT DEFAULT 'individual',
  monthly_amount NUMERIC NOT NULL,
  total_contributed NUMERIC DEFAULT 0,
  donation_start_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  recognition_level TEXT DEFAULT 'supporter',
  public_recognition BOOLEAN DEFAULT true,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  last_donation_date DATE,
  next_billing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create college_prep_resources table
CREATE TABLE public.college_prep_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  category TEXT NOT NULL,
  content_url TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  difficulty_level TEXT,
  estimated_time_minutes INTEGER,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_attendance table
CREATE TABLE public.event_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES public.expo_events(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  attendance_date TIMESTAMP WITH TIME ZONE,
  check_in_method TEXT,
  feedback_rating INTEGER,
  feedback_text TEXT,
  colleges_visited TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS on all tables
ALTER TABLE public.expo_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_prep_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expo_events
CREATE POLICY "Everyone can view expo events"
  ON public.expo_events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage expo events"
  ON public.expo_events FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for scholarship_opportunities
CREATE POLICY "Everyone can view active scholarships"
  ON public.scholarship_opportunities FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage scholarships"
  ON public.scholarship_opportunities FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for scholarship_applications
CREATE POLICY "Users can view their own applications"
  ON public.scholarship_applications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own applications"
  ON public.scholarship_applications FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all applications"
  ON public.scholarship_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for donor_information
CREATE POLICY "Public donors can be viewed by all"
  ON public.donor_information FOR SELECT
  USING (public_recognition = true AND is_active = true);

CREATE POLICY "Donors can view their own info"
  ON public.donor_information FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage donor information"
  ON public.donor_information FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for college_prep_resources
CREATE POLICY "Everyone can view college prep resources"
  ON public.college_prep_resources FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage resources"
  ON public.college_prep_resources FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for event_attendance
CREATE POLICY "Users can view their own attendance"
  ON public.event_attendance FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can register for events"
  ON public.event_attendance FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own attendance"
  ON public.event_attendance FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all attendance"
  ON public.event_attendance FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_expo_events_date ON public.expo_events(event_date);
CREATE INDEX idx_expo_events_location ON public.expo_events(city, state);
CREATE INDEX idx_scholarships_deadline ON public.scholarship_opportunities(deadline);
CREATE INDEX idx_scholarships_status ON public.scholarship_opportunities(status);
CREATE INDEX idx_scholarship_apps_user ON public.scholarship_applications(user_id);
CREATE INDEX idx_scholarship_apps_status ON public.scholarship_applications(status);
CREATE INDEX idx_event_attendance_user ON public.event_attendance(user_id);
CREATE INDEX idx_event_attendance_event ON public.event_attendance(event_id);

-- Create trigger for updated_at columns
CREATE TRIGGER update_expo_events_updated_at
  BEFORE UPDATE ON public.expo_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_opportunities_updated_at
  BEFORE UPDATE ON public.scholarship_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_applications_updated_at
  BEFORE UPDATE ON public.scholarship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_information_updated_at
  BEFORE UPDATE ON public.donor_information
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_college_prep_resources_updated_at
  BEFORE UPDATE ON public.college_prep_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_attendance_updated_at
  BEFORE UPDATE ON public.event_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();