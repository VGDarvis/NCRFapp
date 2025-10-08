-- Create import_jobs table for tracking bulk imports
CREATE TABLE public.import_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Admins can view all import jobs
CREATE POLICY "Admins can view all import jobs"
  ON public.import_jobs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create import jobs
CREATE POLICY "Admins can create import jobs"
  ON public.import_jobs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update import jobs
CREATE POLICY "Admins can update import jobs"
  ON public.import_jobs
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index for faster queries
CREATE INDEX idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX idx_import_jobs_created_by ON public.import_jobs(created_by);
CREATE INDEX idx_import_jobs_created_at ON public.import_jobs(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_import_jobs_updated_at
  BEFORE UPDATE ON public.import_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE public.import_jobs IS 'Tracks progress and status of bulk data import jobs (NCES, Google Places, etc.)';