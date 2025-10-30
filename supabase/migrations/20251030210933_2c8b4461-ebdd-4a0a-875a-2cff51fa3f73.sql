-- Create beta_interest table for tracking expo app beta sign-ups
CREATE TABLE IF NOT EXISTS public.beta_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  session_id TEXT,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  interest_level TEXT CHECK (interest_level IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.beta_interest ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit beta interest (for guest users)
CREATE POLICY "Anyone can submit beta interest"
  ON public.beta_interest
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to view all beta interest submissions
CREATE POLICY "Admins can view all beta interest"
  ON public.beta_interest
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Allow admins to manage beta interest
CREATE POLICY "Admins can manage beta interest"
  ON public.beta_interest
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_beta_interest_event_id ON public.beta_interest(event_id);
CREATE INDEX IF NOT EXISTS idx_beta_interest_created_at ON public.beta_interest(created_at DESC);