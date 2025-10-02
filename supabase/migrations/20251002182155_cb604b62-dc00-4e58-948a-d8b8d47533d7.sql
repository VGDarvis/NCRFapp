-- Insert Fresno Black College Expo booklet
INSERT INTO scholarship_booklets (
  title,
  description,
  cover_image_url,
  viewer_url,
  category,
  academic_year,
  total_scholarships,
  total_value,
  status,
  featured,
  published_date
) VALUES (
  'Fresno Black College Expo - Scholarship Program',
  'Comprehensive scholarship guide featuring over 4.5 billion dollars in available scholarships and financial aid opportunities. Includes detailed information about hundreds of scholarships for Black students pursuing higher education.',
  '/images/fresno-booklet-cover.png',
  'https://indd.adobe.com/view/8344c09e-57b0-44f0-b4e2-d17d9de2eb4d',
  'Regional',
  '2024-2025',
  500,
  4500000000,
  'published',
  true,
  NOW()
);

-- Update Oakland booklet with new cover image
UPDATE scholarship_booklets 
SET cover_image_url = '/images/oakland-booklet-cover.png',
    updated_at = NOW()
WHERE id = '402b9be2-4276-4275-8efe-12c4784d170d';