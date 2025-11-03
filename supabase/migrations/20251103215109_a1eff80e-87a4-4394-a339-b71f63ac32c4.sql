-- Create master exhibitors table for managing organizations across events
CREATE TABLE IF NOT EXISTS public.exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  org_type TEXT DEFAULT 'college',
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  campus_address TEXT,
  campus_city TEXT,
  campus_state TEXT,
  campus_zip TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  offers_on_spot_admission BOOLEAN DEFAULT false,
  waives_application_fee BOOLEAN DEFAULT false,
  scholarship_info TEXT,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_org_name UNIQUE(org_name)
);

-- Add exhibitor_id to booths table to link to master exhibitors
ALTER TABLE public.booths 
ADD COLUMN IF NOT EXISTS exhibitor_id UUID REFERENCES public.exhibitors(id) ON DELETE SET NULL;

-- Add verification fields to booths
ALTER TABLE public.booths
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE;

-- Add verification fields to seminar_sessions
ALTER TABLE public.seminar_sessions
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_booths_exhibitor_id ON public.booths(exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_booths_event_id ON public.booths(event_id);
CREATE INDEX IF NOT EXISTS idx_exhibitors_org_name ON public.exhibitors(org_name);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_exhibitors_updated_at
  BEFORE UPDATE ON public.exhibitors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for exhibitors table
ALTER TABLE public.exhibitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view exhibitors"
  ON public.exhibitors FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exhibitors"
  ON public.exhibitors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing booth data to exhibitors table (deduplicate by org_name)
INSERT INTO public.exhibitors (
  org_name,
  org_type,
  website_url,
  logo_url,
  description,
  contact_name,
  contact_email,
  contact_phone,
  latitude,
  longitude,
  offers_on_spot_admission,
  waives_application_fee,
  scholarship_info
)
SELECT DISTINCT ON (org_name)
  org_name,
  org_type,
  website_url,
  logo_url,
  description,
  contact_name,
  contact_email,
  contact_phone,
  latitude,
  longitude,
  offers_on_spot_admission,
  waives_application_fee,
  scholarship_info
FROM public.booths
WHERE org_name IS NOT NULL
ON CONFLICT (org_name) DO NOTHING;

-- Link existing booths to exhibitors
UPDATE public.booths b
SET exhibitor_id = e.id
FROM public.exhibitors e
WHERE b.org_name = e.org_name
AND b.exhibitor_id IS NULL;