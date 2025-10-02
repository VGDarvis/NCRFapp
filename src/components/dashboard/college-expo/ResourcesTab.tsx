import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Book, ExternalLink } from 'lucide-react';

interface ResourcesTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const ResourcesTab = ({ user, isGuest }: ResourcesTabProps) => {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase
        .from('college_prep_resources')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (data) setResources(data);
    };

    fetchResources();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'article':
        return FileText;
      case 'guide':
        return Book;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-500';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'advanced':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        College Prep <span className="text-primary">Resources</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Curated guides, videos, and tools to support your college journey
      </p>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const Icon = getIcon(resource.resource_type);
            return (
              <Card key={resource.id} className="p-6 glass-premium border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {resource.is_featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex gap-2 mb-4 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                  {resource.difficulty_level && (
                    <Badge className={`text-xs ${getDifficultyColor(resource.difficulty_level)}`}>
                      {resource.difficulty_level}
                    </Badge>
                  )}
                  {resource.estimated_time_minutes && (
                    <Badge variant="outline" className="text-xs">
                      {resource.estimated_time_minutes} min
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open(resource.content_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access Resource
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 glass-light border-primary/20">
          <p className="text-center text-muted-foreground">
            Resources coming soon! Check back later for helpful guides and materials.
          </p>
        </Card>
      )}
    </div>
  );
};