import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User as UserIcon, Star, Calendar } from 'lucide-react';

interface MentorsTabProps {
  user: User | null;
  isGuest?: boolean;
}

interface Tutor {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  specializations: string[];
  years_experience: number;
  hourly_rate: number;
}

export function MovementMentorsTab({ user, isGuest }: MentorsTabProps) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const { data, error } = await supabase
      .from('movement_tutors')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setTutors(data);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Our Mentors & Tutors
        </h1>
        <p className="text-muted-foreground">
          Meet our certified wellness professionals
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading mentors...</p>
        </div>
      ) : tutors.length === 0 ? (
        <Card className="glass-light border-pink-500/20">
          <CardContent className="py-12 text-center">
            <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No mentors available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="glass-light border-pink-500/20 hover-scale">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                    {tutor.avatar_url ? (
                      <img src={tutor.avatar_url} alt={tutor.display_name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tutor.display_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span>4.9 (24 reviews)</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tutor.bio || 'Passionate wellness mentor dedicated to helping students achieve their health goals.'}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Specializations:</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.specializations && tutor.specializations.length > 0 ? (
                      tutor.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                        Wellness Coach
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-pink-500/10">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Experience: </span>
                    <span className="font-medium">{tutor.years_experience} years</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
