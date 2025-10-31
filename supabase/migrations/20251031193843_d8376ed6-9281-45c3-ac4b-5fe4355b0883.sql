-- Grant admin role to joyce@ncrfoundation.org
INSERT INTO public.user_roles (user_id, role, assigned_by)
SELECT 
  id,
  'admin'::app_role,
  id
FROM auth.users
WHERE email = 'joyce@ncrfoundation.org'
ON CONFLICT (user_id, role) DO NOTHING;