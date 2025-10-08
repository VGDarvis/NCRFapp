-- Add college/university specific columns to school_database
ALTER TABLE school_database 
ADD COLUMN IF NOT EXISTS school_type TEXT,
ADD COLUMN IF NOT EXISTS programs_offered TEXT[],
ADD COLUMN IF NOT EXISTS acceptance_rate NUMERIC,
ADD COLUMN IF NOT EXISTS total_enrollment INTEGER,
ADD COLUMN IF NOT EXISTS athletic_division TEXT;

-- Update existing indexes
CREATE INDEX IF NOT EXISTS idx_school_type ON school_database(school_type);
CREATE INDEX IF NOT EXISTS idx_school_programs ON school_database USING gin(programs_offered);
CREATE INDEX IF NOT EXISTS idx_school_name_search ON school_database USING gin(to_tsvector('english', school_name));