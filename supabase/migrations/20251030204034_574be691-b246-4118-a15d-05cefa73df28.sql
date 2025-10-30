-- Create guest_sessions table for detailed session tracking
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  event_id UUID REFERENCES public.events(id),
  entry_source TEXT,
  device_type TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  page_views JSONB DEFAULT '[]'::jsonb,
  interactions JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_guest_sessions_event_id ON public.guest_sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_started_at ON public.guest_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_session_id ON public.guest_sessions(session_id);

-- Enable RLS
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and updates (for guest tracking)
CREATE POLICY "Allow anonymous guest session tracking" ON public.guest_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous session updates" ON public.guest_sessions
  FOR UPDATE TO anon
  USING (true);

-- Allow admins to view all sessions
CREATE POLICY "Admins can view all guest sessions" ON public.guest_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Enhance guest_analytics table with new columns
ALTER TABLE public.guest_analytics 
ADD COLUMN IF NOT EXISTS entry_source TEXT,
ADD COLUMN IF NOT EXISTS session_duration INTEGER,
ADD COLUMN IF NOT EXISTS device_type TEXT;