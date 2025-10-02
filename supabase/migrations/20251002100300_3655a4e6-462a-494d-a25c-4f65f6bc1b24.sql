-- Create scholarship_booklets table
CREATE TABLE public.scholarship_booklets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  pdf_url TEXT,
  category TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  total_scholarships INTEGER DEFAULT 0,
  total_value NUMERIC DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published_date TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booklet_scholarships junction table
CREATE TABLE public.booklet_scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booklet_id UUID NOT NULL REFERENCES public.scholarship_booklets(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarship_opportunities(id) ON DELETE CASCADE,
  page_number INTEGER,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booklet_id, scholarship_id)
);

-- Create booklet_downloads tracking table
CREATE TABLE public.booklet_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booklet_id UUID NOT NULL REFERENCES public.scholarship_booklets(id) ON DELETE CASCADE,
  user_id UUID,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Create scholarship_tips table
CREATE TABLE public.scholarship_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scholarship_booklets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booklet_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booklet_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scholarship_booklets
CREATE POLICY "Everyone can view published booklets"
  ON public.scholarship_booklets FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage booklets"
  ON public.scholarship_booklets FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for booklet_scholarships
CREATE POLICY "Everyone can view booklet scholarships"
  ON public.booklet_scholarships FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage booklet scholarships"
  ON public.booklet_scholarships FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for booklet_downloads
CREATE POLICY "Users can view their own downloads"
  ON public.booklet_downloads FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create download records"
  ON public.booklet_downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all downloads"
  ON public.booklet_downloads FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for scholarship_tips
CREATE POLICY "Everyone can view tips"
  ON public.scholarship_tips FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tips"
  ON public.scholarship_tips FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_booklet_scholarships_booklet_id ON public.booklet_scholarships(booklet_id);
CREATE INDEX idx_booklet_scholarships_scholarship_id ON public.booklet_scholarships(scholarship_id);
CREATE INDEX idx_booklet_downloads_booklet_id ON public.booklet_downloads(booklet_id);
CREATE INDEX idx_booklet_downloads_user_id ON public.booklet_downloads(user_id);
CREATE INDEX idx_scholarship_booklets_status ON public.scholarship_booklets(status);
CREATE INDEX idx_scholarship_booklets_category ON public.scholarship_booklets(category);

-- Create trigger for updated_at
CREATE TRIGGER update_scholarship_booklets_updated_at
  BEFORE UPDATE ON public.scholarship_booklets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_tips_updated_at
  BEFORE UPDATE ON public.scholarship_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample scholarship tips
INSERT INTO public.scholarship_tips (title, content, category, display_order, icon_name) VALUES
('Start Early', 'Begin your scholarship search at least 6-12 months before you need the funds. Many scholarships have early deadlines, and starting early gives you time to prepare strong applications.', 'application_tips', 1, 'Calendar'),
('Read Requirements Carefully', 'Before applying, thoroughly read all eligibility requirements and application instructions. Missing a single requirement can disqualify your application.', 'application_tips', 2, 'FileText'),
('Tell Your Story', 'Your essay should be personal and authentic. Share specific experiences, challenges you''ve overcome, and how the scholarship will help you achieve your goals.', 'essay_writing', 1, 'PenTool'),
('Proofread Multiple Times', 'Grammar and spelling errors can hurt your chances. Have teachers, counselors, or mentors review your essays before submission.', 'essay_writing', 2, 'CheckCircle'),
('Practice Common Questions', 'Prepare for interviews by practicing responses to common questions like "Tell us about yourself" and "Why do you deserve this scholarship?"', 'interview_prep', 1, 'MessageSquare'),
('Dress Professionally', 'First impressions matter. Dress professionally for interviews, arrive early, and bring copies of your resume and application materials.', 'interview_prep', 2, 'Users'),
('Track Deadlines', 'Create a spreadsheet or calendar to track all scholarship deadlines, requirements, and submission dates. Set reminders 1-2 weeks before each deadline.', 'organization', 1, 'Clock'),
('Request Letters Early', 'Ask for recommendation letters at least 3-4 weeks before they''re due. Provide your recommenders with your resume and information about the scholarship.', 'organization', 2, 'Mail');