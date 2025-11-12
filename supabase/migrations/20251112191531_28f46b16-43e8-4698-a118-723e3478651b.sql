
-- Step 1: Update any booths referencing the duplicate floor plan
UPDATE booths 
SET floor_plan_id = 'a7a06af7-613b-47e8-94d1-f184d6c59649'
WHERE floor_plan_id = '4a4694c9-c4fc-46d7-a553-ed7a6128633f';

-- Step 2: Now delete the duplicate floor plan
DELETE FROM floor_plans 
WHERE id = '4a4694c9-c4fc-46d7-a553-ed7a6128633f';

-- Step 3: Update the main floor plan with the background image
UPDATE floor_plans
SET background_image_url = '/floor-plans/seattle-rainier-beach-gym.png'
WHERE id = 'a7a06af7-613b-47e8-94d1-f184d6c59649';

-- Step 4: Delete existing placeholder booths for Seattle to start fresh
DELETE FROM booths 
WHERE event_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Step 5: Insert booths matching the actual floor plan layout
-- Top row: Booths 01-08 (8 booths)
INSERT INTO booths (event_id, venue_id, floor_plan_id, org_name, org_type, zone, grid_row, grid_col, booth_width, booth_depth, display_order, table_no)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 01', 'college', 'entrance', 2, 5, 3, 3, 1, '01'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 02', 'college', 'entrance', 2, 10, 3, 3, 2, '02'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 03', 'college', 'entrance', 2, 15, 3, 3, 3, '03'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 04', 'college', 'entrance', 2, 20, 3, 3, 4, '04'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 05', 'college', 'entrance', 2, 25, 3, 3, 5, '05'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 06', 'college', 'entrance', 2, 30, 3, 3, 6, '06'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 07', 'college', 'entrance', 2, 35, 3, 3, 7, '07'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 08', 'college', 'entrance', 2, 39, 3, 3, 8, '08');

-- Main floor rows (booths 09-44 in 3 rows of 12)
INSERT INTO booths (event_id, venue_id, floor_plan_id, org_name, org_type, zone, grid_row, grid_col, booth_width, booth_depth, display_order, table_no)
SELECT 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c'::uuid,
  'a7a06af7-613b-47e8-94d1-f184d6c59649'::uuid,
  'College Booth ' || LPAD((8 + (row_offset * 12) + col_num)::text, 2, '0'),
  'college',
  'main_floor',
  6 + (row_offset * 5),
  2 + (col_num * 3),
  3,
  3,
  8 + (row_offset * 12) + col_num,
  LPAD((8 + (row_offset * 12) + col_num)::text, 2, '0')
FROM generate_series(0, 2) AS row_offset
CROSS JOIN generate_series(1, 12) AS col_num;

-- Side exit booths (45-50)
INSERT INTO booths (event_id, venue_id, floor_plan_id, org_name, org_type, zone, grid_row, grid_col, booth_width, booth_depth, display_order, table_no)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 45', 'college', 'main_floor', 23, 2, 3, 3, 45, '45'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 46', 'college', 'main_floor', 23, 7, 3, 3, 46, '46'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 47', 'college', 'main_floor', 23, 12, 3, 3, 47, '47'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 48', 'college', 'main_floor', 23, 30, 3, 3, 48, '48'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 49', 'college', 'main_floor', 23, 35, 3, 3, 49, '49'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', 'a7a06af7-613b-47e8-94d1-f184d6c59649', 'College Booth 50', 'college', 'main_floor', 23, 39, 3, 3, 50, '50');
