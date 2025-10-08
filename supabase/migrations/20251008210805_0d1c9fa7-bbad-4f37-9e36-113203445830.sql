-- Add missing columns to school_database for comprehensive school management
ALTER TABLE public.school_database
ADD COLUMN IF NOT EXISTS athletic_programs text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_hbcu boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS special_programs text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS data_source text DEFAULT 'manual_entry' CHECK (data_source IN ('internal', 'partner', 'manual_entry', 'api', 'nces', 'ncaa', 'official_website')),
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_type ON public.school_database(school_type);
CREATE INDEX IF NOT EXISTS idx_schools_hbcu ON public.school_database(is_hbcu) WHERE is_hbcu = true;
CREATE INDEX IF NOT EXISTS idx_schools_verification ON public.school_database(verification_status);
CREATE INDEX IF NOT EXISTS idx_schools_athletic ON public.school_database USING GIN(athletic_programs);
CREATE INDEX IF NOT EXISTS idx_schools_active ON public.school_database(is_active) WHERE is_active = true;