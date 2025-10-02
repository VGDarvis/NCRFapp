import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Calendar, ExternalLink, BookmarkPlus, BookOpen, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScholarshipBookletsSection } from './ScholarshipBookletsSection';
import { ScholarshipTipsSection } from './ScholarshipTipsSection';

interface ScholarshipsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const ScholarshipsTab = ({ user, isGuest }: ScholarshipsTabProps) => {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch scholarships
      const { data: scholarshipData } = await supabase
        .from('scholarship_opportunities')
        .select('*')
        .eq('status', 'active')
        .gte('deadline', new Date().toISOString().split('T')[0])
        .order('deadline', { ascending: true });

      if (scholarshipData) setScholarships(scholarshipData);

      // Fetch user's applications
      if (user) {
        const { data: applications } = await supabase
          .from('scholarship_applications')
          .select('scholarship_id')
          .eq('user_id', user.id);

        if (applications) {
          setAppliedIds(new Set(applications.map(app => app.scholarship_id)));
        }
      }
    };

    fetchData();
  }, [user]);

  const trackApplication = async (scholarshipId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to track scholarship applications',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('scholarship_applications')
      .insert({
        user_id: user.id,
        scholarship_id: scholarshipId,
        status: 'planning',
      });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setAppliedIds(prev => new Set([...prev, scholarshipId]));
    toast({
      title: 'Added to your tracker',
      description: 'This scholarship has been added to your application tracker',
    });
  };

  const formatAmount = (min?: number, max?: number) => {
    if (min && max && min !== max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Amount varies';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        Scholarship <span className="text-primary">Resources</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Explore opportunities, download booklets, and get expert tips for success
      </p>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="opportunities">
            <ExternalLink className="w-4 h-4 mr-2" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="booklets">
            <BookOpen className="w-4 h-4 mr-2" />
            Booklets
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Lightbulb className="w-4 h-4 mr-2" />
            Tips & Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scholarships.length > 0 ? (
          scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-6 glass-premium border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{scholarship.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{scholarship.provider_name}</p>
                </div>
                {appliedIds.has(scholarship.id) && (
                  <Badge variant="secondary">Tracking</Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-3">{scholarship.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {formatAmount(scholarship.amount_min, scholarship.amount_max)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {scholarship.gpa_requirement && (
                <div className="bg-background/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    GPA Requirement: {scholarship.gpa_requirement}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => window.open(scholarship.application_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
                {!appliedIds.has(scholarship.id) && (
                  <Button
                    variant="outline"
                    onClick={() => trackApplication(scholarship.id)}
                    disabled={isGuest}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 glass-light border-primary/20 col-span-2">
            <p className="text-center text-muted-foreground">
              No active scholarships available at this time. Check back soon!
            </p>
          </Card>
        )}
          </div>
        </TabsContent>

        <TabsContent value="booklets">
          <ScholarshipBookletsSection user={user} />
        </TabsContent>

        <TabsContent value="tips">
          <ScholarshipTipsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};