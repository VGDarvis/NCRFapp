-- Create movement_tutors table
CREATE TABLE public.movement_tutors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  specializations TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10,2),
  is_active BOOLEAN DEFAULT true,
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tutor_reviews table
CREATE TABLE public.tutor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES public.movement_tutors(id) ON DELETE CASCADE,
  parent_user_id UUID NOT NULL,
  student_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  review_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  moderated_by UUID,
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tutor_sessions table
CREATE TABLE public.tutor_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES public.movement_tutors(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL,
  parent_user_id UUID,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  session_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wellness_progress table
CREATE TABLE public.wellness_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  progress_value NUMERIC(10,2) NOT NULL,
  goal_value NUMERIC(10,2),
  unit TEXT,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movement_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for movement_tutors
CREATE POLICY "Everyone can view active tutors"
  ON public.movement_tutors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Tutors can update their own profile"
  ON public.movement_tutors FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all tutors"
  ON public.movement_tutors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tutor_reviews
CREATE POLICY "Everyone can view approved reviews"
  ON public.tutor_reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Parents can create reviews"
  ON public.tutor_reviews FOR INSERT
  WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "Parents can view their own reviews"
  ON public.tutor_reviews FOR SELECT
  USING (parent_user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON public.tutor_reviews FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tutor_sessions
CREATE POLICY "Students can view their own sessions"
  ON public.tutor_sessions FOR SELECT
  USING (student_user_id = auth.uid() OR parent_user_id = auth.uid());

CREATE POLICY "Students can create sessions"
  ON public.tutor_sessions FOR INSERT
  WITH CHECK (student_user_id = auth.uid() OR parent_user_id = auth.uid());

CREATE POLICY "Tutors can view their sessions"
  ON public.tutor_sessions FOR SELECT
  USING (tutor_id IN (SELECT id FROM public.movement_tutors WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all sessions"
  ON public.tutor_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for wellness_progress
CREATE POLICY "Users can manage their own progress"
  ON public.wellness_progress FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress"
  ON public.wellness_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_movement_tutors_updated_at
  BEFORE UPDATE ON public.movement_tutors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutor_reviews_updated_at
  BEFORE UPDATE ON public.tutor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutor_sessions_updated_at
  BEFORE UPDATE ON public.tutor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();