-- Insert Los Angeles Black College Expo Scholarship Booklet
INSERT INTO public.scholarship_booklets (
  title,
  description,
  cover_image_url,
  viewer_url,
  category,
  academic_year,
  total_scholarships,
  total_value,
  featured,
  status,
  published_date
) VALUES (
  'Los Angeles Black College Expo - Scholarship Program',
  'Comprehensive scholarship opportunities for students attending the LA Black College Expo. Features local and national scholarships available to HBCU-bound students.',
  '/images/la-booklet-cover.png',
  'https://indd.adobe.com/view/bcc2e309-1fa2-461a-b51a-c24f39536ace',
  'regional',
  '2024-2025',
  0,
  0,
  true,
  'published',
  now()
);