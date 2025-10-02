import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Users, Calendar } from 'lucide-react';

interface CollegePrepTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const CollegePrepTab = ({ user, isGuest }: CollegePrepTabProps) => {
  const prepCategories = [
    {
      title: 'Application Essays',
      description: 'Tips and examples for crafting compelling college essays',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: 'Admission Requirements',
      description: 'Understand what colleges are looking for in applicants',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'College Visits',
      description: 'Plan and make the most of your campus visits',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Timeline & Deadlines',
      description: 'Stay on track with important application dates',
      icon: Calendar,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        College <span className="text-primary">Preparation</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Essential tools and resources to help you navigate the college application process
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {prepCategories.map((category, index) => (
          <Card key={index} className="p-6 glass-premium border-primary/20 hover:border-primary/40 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-full bg-background/50 ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Explore Resources
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-8 glass-premium border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">College Application Checklist</h2>
        <p className="text-muted-foreground mb-6">
          Stay organized with our comprehensive checklist for college applications
        </p>
        <div className="space-y-3">
          {[
            'Research colleges and programs',
            'Prepare for standardized tests (SAT/ACT)',
            'Request letters of recommendation',
            'Write personal statement and essays',
            'Complete FAFSA and financial aid forms',
            'Submit applications before deadlines',
            'Follow up with colleges',
            'Make final decision and commit',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};