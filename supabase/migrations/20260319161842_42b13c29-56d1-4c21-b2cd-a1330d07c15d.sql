INSERT INTO public.user_roles (user_id, role)
VALUES ('f3ee281a-6dce-41aa-a4d2-4a297e09a4f4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;