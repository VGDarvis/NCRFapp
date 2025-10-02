-- Create career_profiles table for extended professional information
CREATE TABLE IF NOT EXISTS public.career_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  career_interests TEXT[],
  career_goals TEXT,
  industry_preferences TEXT[],
  skills TEXT[],
  education_level TEXT,
  years_experience INTEGER DEFAULT 0,
  geographic_preferences TEXT[],
  resume_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  availability_date DATE,
  is_seeking_internship BOOLEAN DEFAULT true,
  is_seeking_fulltime BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table to track application progress
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_type TEXT NOT NULL, -- 'internship', 'entry-level', 'full-time'
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'applied', -- 'applied', 'screening', 'interview', 'offer', 'rejected', 'accepted'
  location TEXT,
  salary_range TEXT,
  application_url TEXT,
  contact_person TEXT,
  contact_email TEXT,
  notes TEXT,
  interview_date TIMESTAMP WITH TIME ZONE,
  offer_received_date DATE,
  response_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_resources table for guides and materials
CREATE TABLE IF NOT EXISTS public.career_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'guide', 'article', 'video', 'course', 'tool'
  category TEXT NOT NULL, -- 'resume', 'interview', 'networking', 'skills', 'industry-insights'
  content_url TEXT,
  thumbnail_url TEXT,
  difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  estimated_time_minutes INTEGER,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentor_connections table for professional mentorship
CREATE TABLE IF NOT EXISTS public.mentor_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'completed', 'declined'
  focus_areas TEXT[],
  meeting_frequency TEXT, -- 'weekly', 'bi-weekly', 'monthly'
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_users CHECK (mentee_user_id != mentor_user_id)
);

-- Create skills_assessments table for tracking skill development
CREATE TABLE IF NOT EXISTS public.skills_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_category TEXT NOT NULL, -- 'technical', 'soft-skills', 'industry-specific'
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT false,
  verification_source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for career_profiles
CREATE POLICY "Users can view their own career profile"
  ON public.career_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own career profile"
  ON public.career_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career profile"
  ON public.career_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all career profiles"
  ON public.career_profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for job_applications
CREATE POLICY "Users can manage their own job applications"
  ON public.job_applications FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all job applications"
  ON public.job_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for career_resources
CREATE POLICY "Everyone can view career resources"
  ON public.career_resources FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage career resources"
  ON public.career_resources FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for mentor_connections
CREATE POLICY "Users can view their mentor connections"
  ON public.mentor_connections FOR SELECT
  USING (auth.uid() = mentee_user_id OR auth.uid() = mentor_user_id);

CREATE POLICY "Mentees can create mentor requests"
  ON public.mentor_connections FOR INSERT
  WITH CHECK (auth.uid() = mentee_user_id);

CREATE POLICY "Users can update their mentor connections"
  ON public.mentor_connections FOR UPDATE
  USING (auth.uid() = mentee_user_id OR auth.uid() = mentor_user_id);

CREATE POLICY "Admins can manage all mentor connections"
  ON public.mentor_connections FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for skills_assessments
CREATE POLICY "Users can manage their own skills assessments"
  ON public.skills_assessments FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all skills assessments"
  ON public.skills_assessments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_career_profiles_user_id ON public.career_profiles(user_id);
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_career_resources_category ON public.career_resources(category);
CREATE INDEX idx_mentor_connections_mentee ON public.mentor_connections(mentee_user_id);
CREATE INDEX idx_mentor_connections_mentor ON public.mentor_connections(mentor_user_id);
CREATE INDEX idx_skills_assessments_user_id ON public.skills_assessments(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_career_profiles_updated_at
  BEFORE UPDATE ON public.career_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_resources_updated_at
  BEFORE UPDATE ON public.career_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentor_connections_updated_at
  BEFORE UPDATE ON public.mentor_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_assessments_updated_at
  BEFORE UPDATE ON public.skills_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();