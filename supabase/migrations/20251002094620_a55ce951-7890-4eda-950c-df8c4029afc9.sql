-- Fix search_path for log_admin_action function
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
SET search_path = public
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