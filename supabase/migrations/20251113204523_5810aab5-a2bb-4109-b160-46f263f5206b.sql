-- Enable real-time replication for events table
ALTER TABLE public.events REPLICA IDENTITY FULL;

-- Enable real-time replication for seminar tables
ALTER TABLE public.seminar_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.seminar_rooms REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seminar_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seminar_rooms;

-- Add flyer metadata columns to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS flyer_scanned_at TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS flyer_confidence_score NUMERIC(3,2);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS flyer_manual_override BOOLEAN DEFAULT FALSE;