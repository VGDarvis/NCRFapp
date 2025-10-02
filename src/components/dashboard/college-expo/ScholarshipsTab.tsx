import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb } from 'lucide-react';
import { ScholarshipBookletsSection } from './ScholarshipBookletsSection';
import { ScholarshipTipsSection } from './ScholarshipTipsSection';

interface ScholarshipsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const ScholarshipsTab = ({ user, isGuest }: ScholarshipsTabProps) => {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        Scholarship <span className="text-primary">Resources</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Download booklets and get expert tips for success
      </p>

      <Tabs defaultValue="booklets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="booklets">
            <BookOpen className="w-4 h-4 mr-2" />
            Booklets
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Lightbulb className="w-4 h-4 mr-2" />
            Tips & Resources
          </TabsTrigger>
        </TabsList>

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