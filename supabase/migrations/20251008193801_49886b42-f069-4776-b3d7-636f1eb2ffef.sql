-- Phase 1a: Extend app_role enum with new roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'outreach_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'outreach_staff';