-- Analytics Performance Indexes
-- These indexes optimize the most common analytics queries

-- Messages table - for time-series analytics
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status_sent_at ON messages(status, sent_at DESC);

-- Activity logs - for activity feed and analytics
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category_created ON activity_logs(activity_category, created_at DESC);

-- Employees - for HR analytics
CREATE INDEX IF NOT EXISTS idx_employees_start_date ON employees(start_date);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);

-- CRM Organizations - for partnership pipeline
CREATE INDEX IF NOT EXISTS idx_crm_orgs_partnership_status ON crm_organizations(partnership_status);
CREATE INDEX IF NOT EXISTS idx_crm_orgs_created ON crm_organizations(created_at DESC);

-- CRM Interactions - for outreach analytics
CREATE INDEX IF NOT EXISTS idx_crm_interactions_date ON crm_interactions(interaction_date DESC);

-- HR Onboarding - for task completion analytics
CREATE INDEX IF NOT EXISTS idx_hr_onboarding_completed ON hr_onboarding(is_completed, due_date);

-- Event Attendance - for program analytics
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration ON event_attendance(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id, attended);

-- Expo Events - for event analytics
CREATE INDEX IF NOT EXISTS idx_expo_events_date ON expo_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_expo_events_status ON expo_events(status);

-- Booklet Downloads - for scholarship analytics
CREATE INDEX IF NOT EXISTS idx_booklet_downloads_date ON booklet_downloads(downloaded_at DESC);