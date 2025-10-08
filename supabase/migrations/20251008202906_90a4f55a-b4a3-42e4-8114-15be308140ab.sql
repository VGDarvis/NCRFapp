-- Populate Scholarship Opportunities with correct schema
INSERT INTO scholarship_opportunities (
  title, description, provider_name, provider_url, amount_min, amount_max, 
  deadline, eligibility_criteria, application_url, gpa_requirement, 
  demographic_requirements, major_restrictions, status
) VALUES
-- HBCU Scholarships
('HBCU National Alumni Association', 'Scholarship for students attending HBCUs', 'HBCU Alliance', 'https://hbcu-scholarships.org', 1000, 5000, '2025-03-15', 'Must attend an HBCU', 'https://hbcu-scholarships.org/apply', 2.5, ARRAY['HBCU Students'], ARRAY[]::text[], 'active'),
('UNCF General Scholarship', 'Supporting students at UNCF member colleges', 'UNCF', 'https://uncf.org', 500, 10000, '2025-12-31', 'African American students at member institutions', 'https://uncf.org/scholarships', 2.5, ARRAY['African American', 'HBCU Students'], ARRAY[]::text[], 'active'),
('Thurgood Marshall Scholarship', 'Merit-based scholarship for HBCU students', 'TMCF', 'https://tmcf.org', 3000, 6200, '2025-06-30', 'Students at TMCF member schools', 'https://tmcf.org/scholarships', 3.0, ARRAY['HBCU Students'], ARRAY[]::text[], 'active'),
-- STEM Scholarships
('Google Tech Scholars', 'For underrepresented students in tech', 'Google', 'https://buildyourfuture.withgoogle.com', 5000, 10000, '2025-12-01', 'Computer Science majors from underrepresented groups', 'https://buildyourfuture.withgoogle.com', 3.2, ARRAY['Underrepresented in Tech'], ARRAY['Computer Science', 'Technology'], 'active'),
('Microsoft HBCU Scholarship', 'Supporting STEM education at HBCUs', 'Microsoft', 'https://microsoft.com/scholarships', 5000, 15000, '2025-02-28', 'STEM majors at HBCUs', 'https://microsoft.com/scholarships', 3.0, ARRAY['HBCU Students'], ARRAY['Engineering', 'Computer Science', 'STEM'], 'active'),
('NASA STEM Engagement', 'For future aerospace professionals', 'NASA', 'https://nasa.gov/stem', 2000, 8000, '2025-11-30', 'Engineering and science majors', 'https://nasa.gov/stem', 3.5, ARRAY[]::text[], ARRAY['Engineering', 'Science'], 'active'),
('Society of Women Engineers', 'Supporting women in STEM fields', 'SWE', 'https://swe.org', 1000, 15000, '2026-02-15', 'Women in engineering', 'https://swe.org/scholarships', 3.0, ARRAY['Women'], ARRAY['Engineering'], 'active'),
('National Society of Black Engineers', 'For African American engineers', 'NSBE', 'https://nsbe.org', 1000, 10000, '2025-06-30', 'Black engineering students', 'https://nsbe.org/scholarships', 2.5, ARRAY['African American'], ARRAY['Engineering'], 'active'),
-- Need-Based
('Federal Pell Grant', 'Need-based federal grant', 'U.S. Department of Education', 'https://studentaid.gov', 400, 7395, '2025-06-30', 'Students with exceptional financial need', 'https://studentaid.gov', 0.0, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Jack Kent Cooke Foundation', 'For exceptional students with financial need', 'JKC Foundation', 'https://jkcf.org', 5000, 40000, '2025-11-15', 'High-achieving, low-income students', 'https://jkcf.org', 3.5, ARRAY['Low Income'], ARRAY[]::text[], 'active'),
-- Merit-Based
('Coca-Cola Scholars', 'Prestigious merit scholarship', 'Coca-Cola Foundation', 'https://coca-colascholarsfoundation.org', 20000, 20000, '2025-10-31', 'Academic excellence and leadership', 'https://coca-colascholarsfoundation.org', 3.5, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Gates Scholarship', 'Full-ride for exceptional students', 'Bill & Melinda Gates Foundation', 'https://thegatesscholarship.org', 10000, 50000, '2025-09-15', 'Pell-eligible minority students with strong academics', 'https://thegatesscholarship.org', 3.3, ARRAY['Minority'], ARRAY[]::text[], 'active'),
('Dell Scholars Program', 'Beyond financial aid - mentorship included', 'Michael & Susan Dell Foundation', 'https://dellscholars.org', 20000, 20000, '2025-12-01', 'Low-income students with grit and determination', 'https://dellscholars.org', 2.4, ARRAY['Low Income'], ARRAY[]::text[], 'active'),
('Horatio Alger Scholarship', 'For resilient students who overcome adversity', 'Horatio Alger Association', 'https://horatioalger.org', 10000, 25000, '2025-10-25', 'Students who have overcome adversity', 'https://horatioalger.org', 2.0, ARRAY[]::text[], ARRAY[]::text[], 'active'),
-- Geographic/Regional
('California Dream Act', 'For California students', 'State of California', 'https://dream.csac.ca.gov', 1000, 5000, '2025-03-02', 'California residents', 'https://dream.csac.ca.gov', 2.0, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Texas Grant Program', 'State grant for Texans', 'State of Texas', 'https://texasgrant.com', 2000, 6000, '2025-01-15', 'TX residents with financial need', 'https://texasgrant.com', 2.5, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Georgia HOPE Scholarship', 'Merit scholarship for Georgia students', 'State of Georgia', 'https://gsfc.georgia.gov/hope', 3000, 7000, '2025-07-01', 'GA residents with 3.0+ GPA', 'https://gsfc.georgia.gov/hope', 3.0, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Florida Bright Futures', 'Florida merit scholarship', 'State of Florida', 'https://floridastudentfinancialaid.org', 2000, 6000, '2025-08-01', 'FL high school graduates', 'https://floridastudentfinancialaid.org', 3.0, ARRAY[]::text[], ARRAY[]::text[], 'active'),
-- Athletic
('NCAA Division I Scholarship', 'Athletic scholarships for D1 athletes', 'NCAA', 'https://ncaa.org', 5000, 50000, '2025-11-01', 'Student-athletes competing in D1', 'https://ncaa.org', 2.3, ARRAY['Student Athletes'], ARRAY[]::text[], 'active'),
('NAIA Athletic Scholarship', 'For NAIA athletes', 'NAIA', 'https://naia.org', 1000, 25000, '2025-10-01', 'NAIA student-athletes', 'https://naia.org', 2.0, ARRAY['Student Athletes'], ARRAY[]::text[], 'active'),
-- First Generation
('First Generation Matching Grant', 'For students whose parents did not attend college', 'Various Colleges', 'https://firstgen.org', 500, 5000, '2025-05-01', 'First-generation college students', 'https://firstgen.org', 2.0, ARRAY['First Generation'], ARRAY[]::text[], 'active'),
('Iam First Scholarship', 'Supporting first-generation scholars', 'Center for Student Opportunity', 'https://iamfirst.org', 1000, 5000, '2025-11-30', 'First-gen students', 'https://iamfirst.org', 3.0, ARRAY['First Generation'], ARRAY[]::text[], 'active'),
-- Business/Entrepreneurship
('Ron Brown Scholar Program', 'For future business leaders', 'CAP Charitable Foundation', 'https://ronbrown.org', 10000, 40000, '2025-01-09', 'African American leaders and scholars', 'https://ronbrown.org', 3.5, ARRAY['African American'], ARRAY['Business', 'Leadership'], 'active'),
('NABA Student Scholarship', 'For Black accounting students', 'National Association of Black Accountants', 'https://nabainc.org', 1000, 10000, '2025-06-30', 'Accounting/finance majors', 'https://nabainc.org', 3.0, ARRAY['African American'], ARRAY['Accounting', 'Finance'], 'active'),
-- Arts
('National YoungArts Foundation', 'For talented young artists', 'YoungArts', 'https://youngarts.org', 1000, 10000, '2025-10-15', 'Arts students aged 15-18', 'https://youngarts.org', 0.0, ARRAY[]::text[], ARRAY['Arts'], 'active'),
('Scholastic Art Writing Awards', 'Recognizing artistic talent', 'Scholastic', 'https://artandwriting.org', 500, 10000, '2025-09-15', 'Creative students grades 7-12', 'https://artandwriting.org', 0.0, ARRAY[]::text[], ARRAY['Arts', 'Writing'], 'active'),
-- Essay-Based
('AXA Achievement Scholarship', 'Essay and achievement-based', 'AXA Foundation', 'https://axa-equitable.com/foundation', 10000, 25000, '2025-12-15', 'Students with ambition and drive', 'https://axa-equitable.com/foundation', 2.5, ARRAY[]::text[], ARRAY[]::text[], 'active'),
('Burger King Scholars', 'Based on GPA, work, and essay', 'Burger King Foundation', 'https://bkmclamorefoundation.org', 1000, 50000, '2025-12-15', 'High school seniors in US/Canada', 'https://bkmclamorefoundation.org', 2.5, ARRAY[]::text[], ARRAY[]::text[], 'active'),
-- Technology Specific
('Generation Google Scholarship', 'For aspiring tech leaders', 'Google', 'https://buildyourfuture.withgoogle.com/scholarships', 1000, 10000, '2025-12-03', 'Computer science students', 'https://buildyourfuture.withgoogle.com/scholarships', 3.0, ARRAY[]::text[], ARRAY['Computer Science'], 'active'),
('Apple Scholars Program', 'Supporting diversity in tech', 'Apple', 'https://apple.com/education', 5000, 20000, '2025-11-01', 'STEM students from underrepresented groups', 'https://apple.com/education', 3.2, ARRAY['Underrepresented in Tech'], ARRAY['STEM', 'Technology'], 'active'),
('Adobe Research Women-in-Technology', 'For women in technology fields', 'Adobe', 'https://research.adobe.com/scholarship', 5000, 10000, '2025-09-25', 'Women studying tech', 'https://research.adobe.com/scholarship', 3.0, ARRAY['Women'], ARRAY['Technology'], 'active'),
-- Healthcare/Medical
('Tylenol Future Care Scholarship', 'For future healthcare professionals', 'Johnson & Johnson', 'https://tylenol.com/future-care-scholarship', 1000, 10000, '2025-06-30', 'Healthcare-related majors', 'https://tylenol.com/future-care-scholarship', 2.5, ARRAY[]::text[], ARRAY['Healthcare', 'Nursing', 'Medicine'], 'active'),
('National Health Service Corps', 'Service commitment scholarship', 'HRSA', 'https://nhsc.hrsa.gov', 20000, 50000, '2025-04-30', 'Primary care health professionals', 'https://nhsc.hrsa.gov', 3.0, ARRAY[]::text[], ARRAY['Medicine', 'Healthcare'], 'active')
ON CONFLICT DO NOTHING;

-- Add scholarship search indexes
CREATE INDEX IF NOT EXISTS idx_scholarship_title_search ON scholarship_opportunities USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_scholarship_deadline ON scholarship_opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarship_amount ON scholarship_opportunities(amount_max);
CREATE INDEX IF NOT EXISTS idx_scholarship_demographics ON scholarship_opportunities USING gin(demographic_requirements);
CREATE INDEX IF NOT EXISTS idx_scholarship_majors ON scholarship_opportunities USING gin(major_restrictions);