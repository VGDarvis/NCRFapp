-- Add viewer_url column to scholarship_booklets table
ALTER TABLE public.scholarship_booklets
ADD COLUMN viewer_url TEXT;

COMMENT ON COLUMN public.scholarship_booklets.viewer_url IS 'URL for embedded viewer (e.g., Adobe InDesign viewer link)';