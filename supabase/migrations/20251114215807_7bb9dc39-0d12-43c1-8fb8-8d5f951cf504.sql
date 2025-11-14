-- Insert all Seattle Black College Expo exhibitors (including confirmed, pending, and false status)
-- Event ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

INSERT INTO booths (
  event_id, 
  table_no, 
  org_name, 
  org_type, 
  waives_application_fee, 
  scholarship_info, 
  offers_on_spot_admission, 
  contact_phone, 
  contact_email,
  contact_name
) VALUES
  -- Row 1: Alabama A&M University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '39', 'Alabama A&M University', 'hbcu', true, 'Offers scholarships on the spot', true, '(205) 790-6870', NULL, 'Darrius Blakney'),
  
  -- Row 2: Alabama State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '33', 'Alabama State University', 'hbcu', true, 'Offers scholarships on the spot', false, NULL, 'fwilliams@alasu.edu', 'Freddie Williams'),
  
  -- Row 3: Alcorn State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '41', 'Alcorn State University', 'hbcu', false, NULL, false, '(601) 877-6148', NULL, 'De''Martinez Simmons'),
  
  -- Row 4: Benedict College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11', 'Benedict College', 'hbcu', false, NULL, false, '(856) 726-1773', NULL, 'Amir Roberts'),
  
  -- Row 5: California State University Fullerton
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '40', 'California State University Fullerton', 'university', false, NULL, false, '(626) 466-7161', 'jorcontreras@fullerton.edu', 'Jorge Contreras'),
  
  -- Row 6: Central Washington University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '9', 'Central Washington University', 'university', false, NULL, false, '(206) 845-8772', 'cassidy.bateman@cwu.edu', 'Cassidy Bateman'),
  
  -- Row 7: Claflin University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '35', 'Claflin University', 'hbcu', true, NULL, true, '(803) 535-5531', NULL, 'Rey Brown'),
  
  -- Row 8: Columbia College Chicago
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '10', 'Columbia College Chicago', 'university', true, NULL, true, '312-369-7767', NULL, 'Skye Rust'),
  
  -- Row 9: Delaware State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '27', 'Delaware State University', 'hbcu', true, 'Offers scholarships on the spot', true, '(302) 382-5279', NULL, 'SherryAnn Phillip'),
  
  -- Row 10: DigiPen Institute of Technology
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '1', 'DigiPen Institute of Technology', 'university', false, NULL, false, '(440) 759-1593', NULL, 'Max Traylor'),
  
  -- Row 11: Edward Waters University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '37', 'Edward Waters University', 'hbcu', true, 'Offers scholarships on the spot', true, '(786) 426-6688', NULL, 'Cortland Faison'),
  
  -- Row 12: Fort Valley State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '29', 'Fort Valley State University', 'hbcu', false, NULL, false, NULL, NULL, 'Karyn Nooks'),
  
  -- Row 13: Foundation Clothing
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '43-44', 'Foundation Clothing', 'corporate', false, NULL, false, NULL, NULL, NULL),
  
  -- Row 14: Green River College - A2MEND
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '34', 'Green River College - A2MEND', 'university', false, NULL, false, '(312) 399-0548', NULL, 'Sydace Jackson'),
  
  -- Row 15: Harris-Stowe State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '31', 'Harris-Stowe State University', 'hbcu', true, 'Offers scholarships on the spot', true, '(314) 340-3305', NULL, 'Lance Smith'),
  
  -- Row 16: Howard University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '46', 'Howard University', 'hbcu', false, NULL, false, '(202) 806-2725', NULL, 'Carla Goodwin'),
  
  -- Row 17: Huston-Tillotson University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '25', 'Huston-Tillotson University', 'hbcu', true, NULL, true, '(510) 209-2929', NULL, 'Robert Brue'),
  
  -- Row 18: LeMoyne-Owen College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '23', 'LeMoyne-Owen College', 'hbcu', true, 'Offers scholarships on the spot', true, '769-231-2717', NULL, 'Lamar Scott'),
  
  -- Row 19: Livingstone College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '21', 'Livingstone College', 'hbcu', false, NULL, false, '(301) 641-6642', NULL, 'Shari Hill'),
  
  -- Row 20: Morehouse School of Medicine
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8', 'Morehouse School of Medicine', 'hbcu', false, NULL, false, '(310) 892-6578', NULL, 'Aaren Hurd'),
  
  -- Row 21: Mount Saint Mary's University Los Angeles
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '36', 'Mount Saint Mary''s University Los Angeles', 'university', true, 'Offers scholarships on the spot', true, '(213) 477-2566', NULL, 'Gavin Todd'),
  
  -- Row 22: NCRF Internships and Careers / NCRF Information
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '49', 'NCRF Internships and Careers / NCRF Information', 'ncrf', false, NULL, false, NULL, NULL, NULL),
  
  -- Row 23: NCRF Student Athlete Program (SAP)
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '50', 'NCRF Student Athlete Program (SAP)', 'ncrf', false, NULL, false, NULL, NULL, NULL),
  
  -- Row 24: Oregon Institute of Technology
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '38', 'Oregon Institute of Technology', 'university', true, NULL, false, '(541) 887-9187', NULL, 'Carlos Garcia'),
  
  -- Row 25: Paine College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '19', 'Paine College', 'hbcu', false, NULL, false, '713-363-0911', NULL, 'Drane Kany'),
  
  -- Row 26: Paul Quinn College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '17', 'Paul Quinn College', 'hbcu', true, 'Offers scholarships on the spot', true, '(469) 260-1859', 'Amauldin@pqc.edu', 'Antonio Mauldin'),
  
  -- Row 27: Play Black Wall Street
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2', 'Play Black Wall Street', 'corporate', false, NULL, false, '(818) 912-8788', NULL, 'De''Von Walker'),
  
  -- Row 28: San Diego State University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '28', 'San Diego State University', 'university', false, NULL, false, '(619) 675-3589', NULL, 'Edgar Hodge'),
  
  -- Row 29: Seattle University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '30', 'Seattle University', 'university', false, NULL, false, '(206) 296-6387', 'yabesc@seattleu.edu', 'Cassey Yabes'),
  
  -- Row 30: SPOTR
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '48', 'SPOTR', 'corporate', false, NULL, false, NULL, 'alfred@myspotr.co', 'Alfred M. Muteti'),
  
  -- Row 31: Stanford University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '47', 'Stanford University', 'university', false, NULL, false, '(209) 302-5725', NULL, 'Joanna Mendoza'),
  
  -- Row 32: Talladega College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '15', 'Talladega College', 'hbcu', false, NULL, false, '(626) 536-7837', NULL, 'Lon Weind'),
  
  -- Row 33: Tuskegee University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '14', 'Tuskegee University', 'hbcu', false, NULL, false, NULL, NULL, NULL),
  
  -- Row 34: Ultimate Breakthrough University
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '42', 'Ultimate Breakthrough University', 'university', false, NULL, false, NULL, NULL, 'Amir'),
  
  -- Row 35: United Negro College Fund
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '13', 'United Negro College Fund', 'ncrf', false, NULL, false, '(202) 271-3467', NULL, 'William Brown'),
  
  -- Row 36: United States Coast Guard
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '32', 'United States Coast Guard', 'military', false, NULL, false, '202.390.0405', NULL, 'Eugenia R. Gardner'),
  
  -- Row 37: United States Help Desk Academy
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '18', 'United States Help Desk Academy', 'corporate', true, 'Offers scholarships on the spot', true, '(702) 334-8355', NULL, 'Duana Malone'),
  
  -- Row 38: University of Nevada, Las Vegas
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '26', 'University of Nevada, Las Vegas', 'university', true, NULL, true, '(714) 519-4932', NULL, 'Daniel Mendoza'),
  
  -- Row 39: University of Washington Bothell
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '24', 'University of Washington Bothell', 'university', false, NULL, false, '(206) 892-8335', NULL, 'Ben Johnson'),
  
  -- Row 40: United States Naval Academy
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '12', 'United States Naval Academy', 'military', false, NULL, false, '(813) 420-7179', NULL, 'Savannah Patrick'),
  
  -- Row 41: Whittier College
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '16', 'Whittier College', 'university', true, 'Offers scholarships on the spot', true, '(562) 746-5789', NULL, 'Anna-Marie Fahmy'),
  
  -- Row 42: University of Washington, School of Public Health
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '22', 'University of Washington, School of Public Health', 'university', false, NULL, false, '206-596-1610', NULL, NULL);
