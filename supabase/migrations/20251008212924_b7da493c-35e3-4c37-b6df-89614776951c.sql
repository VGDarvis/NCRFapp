-- Create verification history table
CREATE TABLE IF NOT EXISTS public.verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type TEXT NOT NULL CHECK (record_type IN ('school', 'youth_service')),
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('verified', 'rejected', 'requested_info')),
  verified_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view verification history"
  ON public.verification_history
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert verification history"
  ON public.verification_history
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for verification history
CREATE INDEX IF NOT EXISTS idx_verification_history_record ON public.verification_history(record_type, record_id);
CREATE INDEX IF NOT EXISTS idx_verification_history_date ON public.verification_history(created_at DESC);

-- Add data_source column to tables if not exists
ALTER TABLE public.school_database 
ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'manual';

ALTER TABLE public.youth_services_database 
ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'manual';