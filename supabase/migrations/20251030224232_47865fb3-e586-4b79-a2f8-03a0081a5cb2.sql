-- Fix security issue: Restrict public access to booth contact information
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can view booths" ON public.booths;

-- Create policy for authenticated users to view all booth data
CREATE POLICY "Authenticated users can view all booth data"
ON public.booths
FOR SELECT
TO authenticated
USING (true);

-- Create security definer function for safe public booth access (no contact info)
CREATE OR REPLACE FUNCTION public.get_public_booths(p_event_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  event_id uuid,
  venue_id uuid,
  floor_plan_id uuid,
  org_name text,
  org_type text,
  description text,
  logo_url text,
  website_url text,
  sponsor_tier text,
  sponsor_id uuid,
  is_featured boolean,
  offers_on_spot_admission boolean,
  waives_application_fee boolean,
  scholarship_info text,
  table_no text,
  zone text,
  x_position numeric,
  y_position numeric,
  grid_row integer,
  grid_col integer,
  booth_width numeric,
  booth_depth numeric,
  floor_number integer,
  display_order integer,
  latitude numeric,
  longitude numeric,
  stage_description text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    event_id,
    venue_id,
    floor_plan_id,
    org_name,
    org_type,
    description,
    logo_url,
    website_url,
    sponsor_tier,
    sponsor_id,
    is_featured,
    offers_on_spot_admission,
    waives_application_fee,
    scholarship_info,
    table_no,
    zone,
    x_position,
    y_position,
    grid_row,
    grid_col,
    booth_width,
    booth_depth,
    floor_number,
    display_order,
    latitude,
    longitude,
    stage_description,
    created_at,
    updated_at
  FROM public.booths
  WHERE (p_event_id IS NULL OR event_id = p_event_id)
  ORDER BY display_order, org_name;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_booths(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_booths(uuid) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_public_booths IS 'Returns booth information without sensitive contact details (email, phone, contact_name) for public/guest access. Use direct table access for authenticated admin users who need contact information.';