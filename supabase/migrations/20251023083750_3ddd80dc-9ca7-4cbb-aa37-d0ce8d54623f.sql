-- Create guest analytics table for tracking anonymous app usage
CREATE TABLE IF NOT EXISTS public.guest_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page_view TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster queries on event_id and timestamp
CREATE INDEX idx_guest_analytics_event_timestamp ON public.guest_analytics(event_id, timestamp DESC);
CREATE INDEX idx_guest_analytics_session ON public.guest_analytics(session_id);

-- Enable RLS but allow anonymous inserts
ALTER TABLE public.guest_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert analytics (for guest tracking)
CREATE POLICY "Anyone can insert guest analytics"
  ON public.guest_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can view analytics
CREATE POLICY "Admins can view guest analytics"
  ON public.guest_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );