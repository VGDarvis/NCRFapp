-- Add status and analytics columns to expo_events
ALTER TABLE public.expo_events
ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
ADD COLUMN IF NOT EXISTS attendee_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS event_photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS event_recap text,
ADD COLUMN IF NOT EXISTS colleges_attended text[] DEFAULT '{}';

-- Create admin audit logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_table text,
  target_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create system settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  updated_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create admin sessions table for tracking active admin sessions
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_audit_logs
CREATE POLICY "Admins can view all audit logs"
ON public.admin_audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for system_settings
CREATE POLICY "Admins can manage system settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for admin_sessions
CREATE POLICY "Admins can view their own sessions"
ON public.admin_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create sessions"
ON public.admin_sessions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update their own sessions"
ON public.admin_sessions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role));

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_target_table text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action,
    target_table,
    target_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    p_action,
    p_target_table,
    p_target_id,
    p_old_values,
    p_new_values
  );
END;
$$;

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON public.admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_expo_events_status ON public.expo_events(status);
CREATE INDEX IF NOT EXISTS idx_expo_events_event_date ON public.expo_events(event_date);