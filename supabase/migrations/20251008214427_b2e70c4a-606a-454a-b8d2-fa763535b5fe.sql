-- Grant outreach staff access to education databases
CREATE POLICY "Outreach staff can view schools"
ON school_database
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'outreach_manager'::app_role) OR
  has_role(auth.uid(), 'outreach_staff'::app_role)
);

CREATE POLICY "Outreach staff can view youth services"
ON youth_services_database
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'outreach_manager'::app_role) OR
  has_role(auth.uid(), 'outreach_staff'::app_role)
);

-- Update CRM organizations to allow source and metadata
ALTER TABLE crm_organizations 
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update ai_search_queries to track actions taken
ALTER TABLE ai_search_queries
  ADD COLUMN IF NOT EXISTS actions_taken JSONB DEFAULT '{}'::jsonb;

-- Create outreach_search_lists table for saved searches
CREATE TABLE IF NOT EXISTS outreach_search_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_name TEXT NOT NULL,
  search_query TEXT NOT NULL,
  parsed_filters JSONB DEFAULT '{}'::jsonb,
  school_ids UUID[] DEFAULT '{}'::uuid[],
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- Enable RLS on outreach_search_lists
ALTER TABLE outreach_search_lists ENABLE ROW LEVEL SECURITY;

-- Policy for outreach staff to manage their own lists
CREATE POLICY "Outreach staff can manage their own search lists"
ON outreach_search_lists
FOR ALL
TO authenticated
USING (
  created_by = auth.uid() AND (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'outreach_manager'::app_role) OR
    has_role(auth.uid(), 'outreach_staff'::app_role)
  )
);

-- Policy for viewing all lists (managers and admins)
CREATE POLICY "Managers and admins can view all search lists"
ON outreach_search_lists
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'outreach_manager'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_outreach_search_lists_updated_at
  BEFORE UPDATE ON outreach_search_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();