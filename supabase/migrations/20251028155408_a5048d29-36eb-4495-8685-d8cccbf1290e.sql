-- Create storage bucket for event assets (floor plans, banners, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event_assets',
  'event_assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Allow public read access to event assets
CREATE POLICY "Event assets are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event_assets');

-- Allow authenticated admins to upload event assets
CREATE POLICY "Admins can upload event assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'event_assets' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to update event assets
CREATE POLICY "Admins can update event assets"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'event_assets' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to delete event assets
CREATE POLICY "Admins can delete event assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'event_assets' 
  AND auth.role() = 'authenticated'
);