-- Phase 1b: NCRF HR + Outreach CRM Database Tables and Policies

-- 1. Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contractor', 'intern')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave', 'terminated')),
  start_date DATE NOT NULL,
  end_date DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create employee_documents table
CREATE TABLE public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'certification', 'id', 'resume', 'performance-review', 'other')),
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create time_tracking table
CREATE TABLE public.time_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('hours-logged', 'time-off-request', 'sick-leave', 'vacation')),
  entry_date DATE NOT NULL,
  hours DECIMAL(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  approved_by UUID REFERENCES auth.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create hr_onboarding table
CREATE TABLE public.hr_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  checklist_item TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Create crm_organizations table
CREATE TABLE public.crm_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN ('school', 'university', 'company', 'non-profit', 'government', 'other')),
  industry TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  region TEXT,
  partnership_status TEXT DEFAULT 'prospect' CHECK (partnership_status IN ('prospect', 'active', 'inactive', 'archived')),
  partnership_tier TEXT CHECK (partnership_tier IN ('platinum', 'gold', 'silver', 'bronze', 'prospect')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create crm_contacts table
CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE SET NULL,
  position TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'do-not-contact')),
  last_contact_date TIMESTAMP WITH TIME ZONE,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'sms', 'any')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Create crm_tags table
CREATE TABLE public.crm_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_category TEXT CHECK (tag_category IN ('region', 'grade-level', 'interest', 'program', 'tier', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK ((contact_id IS NOT NULL AND organization_id IS NULL) OR (contact_id IS NULL AND organization_id IS NOT NULL))
);

-- 9. Create crm_interactions table
CREATE TABLE public.crm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.crm_organizations(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'event', 'sms', 'other')),
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  subject TEXT,
  notes TEXT,
  outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative', 'follow-up-needed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Create message_templates table
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms')),
  category TEXT CHECK (category IN ('welcome', 'follow-up', 'event-invite', 'newsletter', 'reminder', 'thank-you', 'other')),
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Create messages table (enhance existing or create new)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type TEXT NOT NULL CHECK (message_type IN ('email', 'sms')),
  sender_id UUID REFERENCES auth.users(id),
  recipient_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  campaign_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'delivered', 'failed', 'bounced')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Create bulk_campaigns table
CREATE TABLE public.bulk_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('email', 'sms', 'mixed')),
  template_id UUID REFERENCES public.message_templates(id),
  target_audience TEXT,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. Create analytics_summary table
CREATE TABLE public.analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL UNIQUE,
  total_employees INTEGER DEFAULT 0,
  active_employees INTEGER DEFAULT 0,
  total_crm_contacts INTEGER DEFAULT 0,
  active_crm_contacts INTEGER DEFAULT 0,
  messages_sent_today INTEGER DEFAULT 0,
  messages_sent_week INTEGER DEFAULT 0,
  active_campaigns INTEGER DEFAULT 0,
  pending_hr_tasks INTEGER DEFAULT 0,
  top_performing_staff JSONB DEFAULT '[]'::jsonb,
  outreach_success_rate DECIMAL(5,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 14. Create performance_metrics table
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('messages-sent', 'contacts-added', 'campaigns-created', 'interactions-logged', 'hr-tasks-completed')),
  metric_date DATE NOT NULL,
  metric_value INTEGER DEFAULT 0,
  department TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, metric_type, metric_date)
);

-- 15. Create school_database table for AI search
CREATE TABLE public.school_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  district TEXT,
  region TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  zip_code TEXT,
  grade_levels TEXT[] DEFAULT ARRAY[]::TEXT[],
  student_count INTEGER,
  demographics JSONB DEFAULT '{}'::jsonb,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  partnership_status TEXT DEFAULT 'prospect' CHECK (partnership_status IN ('prospect', 'contacted', 'active', 'inactive')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  programs_interested JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 16. Create ai_search_queries table
CREATE TABLE public.ai_search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query_text TEXT NOT NULL,
  parsed_filters JSONB DEFAULT '{}'::jsonb,
  results_count INTEGER DEFAULT 0,
  search_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for HR tables
CREATE POLICY "Admins and HR managers can manage departments"
  ON public.departments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "HR staff can view departments"
  ON public.departments FOR SELECT
  USING (has_role(auth.uid(), 'hr_staff'::app_role));

CREATE POLICY "Admins and HR managers can manage employees"
  ON public.employees FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "HR staff can view employees"
  ON public.employees FOR SELECT
  USING (has_role(auth.uid(), 'hr_staff'::app_role));

CREATE POLICY "Employees can view their own record"
  ON public.employees FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "HR staff can manage employee documents"
  ON public.employee_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_staff'::app_role));

CREATE POLICY "HR staff can manage time tracking"
  ON public.time_tracking FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_staff'::app_role));

CREATE POLICY "Employees can view and create their own time entries"
  ON public.time_tracking FOR SELECT
  USING (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

CREATE POLICY "Employees can insert their own time entries"
  ON public.time_tracking FOR INSERT
  WITH CHECK (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

CREATE POLICY "HR staff can manage onboarding"
  ON public.hr_onboarding FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_staff'::app_role));

-- RLS Policies for CRM tables
CREATE POLICY "Admins and outreach staff can manage organizations"
  ON public.crm_organizations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach staff can manage contacts"
  ON public.crm_contacts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach staff can manage tags"
  ON public.crm_tags FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach staff can manage interactions"
  ON public.crm_interactions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach managers can manage templates"
  ON public.message_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role));

CREATE POLICY "Outreach staff can view templates"
  ON public.message_templates FOR SELECT
  USING (has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach staff can manage messages"
  ON public.messages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and outreach staff can manage campaigns"
  ON public.bulk_campaigns FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Admins and managers can view analytics"
  ON public.analytics_summary FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role));

CREATE POLICY "System can update analytics"
  ON public.analytics_summary FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update existing analytics"
  ON public.analytics_summary FOR UPDATE
  USING (true);

CREATE POLICY "Admins and managers can view all metrics"
  ON public.performance_metrics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role));

CREATE POLICY "Users can view their own metrics"
  ON public.performance_metrics FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert metrics"
  ON public.performance_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and outreach staff can manage school database"
  ON public.school_database FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role));

CREATE POLICY "Users can view their own search queries"
  ON public.ai_search_queries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create search queries"
  ON public.ai_search_queries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all search queries"
  ON public.ai_search_queries FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_tracking_updated_at BEFORE UPDATE ON public.time_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hr_onboarding_updated_at BEFORE UPDATE ON public.hr_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_organizations_updated_at BEFORE UPDATE ON public.crm_organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON public.message_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bulk_campaigns_updated_at BEFORE UPDATE ON public.bulk_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_summary_updated_at BEFORE UPDATE ON public.analytics_summary
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_database_updated_at BEFORE UPDATE ON public.school_database
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_employees_department ON public.employees(department_id);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employee_documents_employee ON public.employee_documents(employee_id);
CREATE INDEX idx_time_tracking_employee ON public.time_tracking(employee_id);
CREATE INDEX idx_time_tracking_date ON public.time_tracking(entry_date);
CREATE INDEX idx_hr_onboarding_employee ON public.hr_onboarding(employee_id);

CREATE INDEX idx_crm_contacts_organization ON public.crm_contacts(organization_id);
CREATE INDEX idx_crm_contacts_status ON public.crm_contacts(status);
CREATE INDEX idx_crm_tags_contact ON public.crm_tags(contact_id);
CREATE INDEX idx_crm_tags_organization ON public.crm_tags(organization_id);
CREATE INDEX idx_crm_interactions_contact ON public.crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_organization ON public.crm_interactions(organization_id);

CREATE INDEX idx_messages_campaign ON public.messages(campaign_id);
CREATE INDEX idx_messages_status ON public.messages(status);
CREATE INDEX idx_messages_recipient_contact ON public.messages(recipient_contact_id);

CREATE INDEX idx_school_database_state ON public.school_database(state);
CREATE INDEX idx_school_database_city ON public.school_database(city);
CREATE INDEX idx_school_database_partnership ON public.school_database(partnership_status);
CREATE INDEX idx_school_database_grade_levels ON public.school_database USING GIN(grade_levels);
CREATE INDEX idx_school_database_tags ON public.school_database USING GIN(tags);

CREATE INDEX idx_analytics_summary_date ON public.analytics_summary(summary_date);
CREATE INDEX idx_performance_metrics_user_date ON public.performance_metrics(user_id, metric_date);

-- Create storage bucket for HR documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('hr-documents', 'hr-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for HR documents
CREATE POLICY "HR staff can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'hr-documents' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_staff'::app_role))
  );

CREATE POLICY "HR staff can view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'hr-documents' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_staff'::app_role))
  );

CREATE POLICY "HR managers can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'hr-documents' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
  );

-- Create storage bucket for CRM attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('crm-attachments', 'crm-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for CRM attachments
CREATE POLICY "Outreach staff can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'crm-attachments' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role))
  );

CREATE POLICY "Outreach staff can view attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'crm-attachments' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role) OR has_role(auth.uid(), 'outreach_staff'::app_role))
  );

CREATE POLICY "Outreach managers can delete attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'crm-attachments' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'outreach_manager'::app_role))
  );