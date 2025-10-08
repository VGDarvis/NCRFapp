-- Create youth_services_database table for sports programs and youth services
CREATE TABLE IF NOT EXISTS public.youth_services_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('Sports', 'Mentorship', 'STEM', 'After-School', 'Arts', 'Community Center', 'Tutoring')),
  organization_name TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT CHECK (region IN ('West', 'South', 'Midwest', 'Northeast')),
  zip_code TEXT,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  programs_offered TEXT[] DEFAULT '{}',
  age_ranges TEXT[] DEFAULT '{}',
  sports_offered TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  coaching_staff JSONB DEFAULT '{}',
  schedule JSONB DEFAULT '{}',
  cost_info TEXT,
  eligibility_requirements TEXT[] DEFAULT '{}',
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  data_source TEXT DEFAULT 'manual_entry' CHECK (data_source IN ('internal', 'partner', 'manual_entry', 'api')),
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_youth_services_state ON public.youth_services_database(state);
CREATE INDEX idx_youth_services_region ON public.youth_services_database(region);
CREATE INDEX idx_youth_services_service_type ON public.youth_services_database(service_type);
CREATE INDEX idx_youth_services_sports ON public.youth_services_database USING GIN(sports_offered);
CREATE INDEX idx_youth_services_verification ON public.youth_services_database(verification_status);
CREATE INDEX idx_youth_services_active ON public.youth_services_database(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.youth_services_database ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view active youth services"
  ON public.youth_services_database
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage youth services"
  ON public.youth_services_database
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_youth_services_updated_at
  BEFORE UPDATE ON public.youth_services_database
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();