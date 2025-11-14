import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Users } from 'lucide-react';
import scholarshipsImage from '@/assets/scholarships-giveaway.jpg';

interface DonorsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const DonorsTab = ({ user, isGuest }: DonorsTabProps) => {
  const [donors, setDonors] = useState<any[]>([]);
  const studentsHelped = 500000;

  useEffect(() => {
    const fetchDonors = async () => {
      const { data } = await supabase
        .from('donor_information')
        .select('*')
        .eq('is_active', true)
        .eq('public_recognition', true)
        .order('total_contributed', { ascending: false });

      if (data) {
        setDonors(data);
      }
    };

    fetchDonors();
  }, []);

  const getRecognitionBadge = (level: string) => {
    const colors: Record<string, string> = {
      platinum: 'bg-purple-500/20 text-purple-500',
      gold: 'bg-yellow-500/20 text-yellow-500',
      silver: 'bg-gray-500/20 text-gray-500',
      bronze: 'bg-orange-500/20 text-orange-500',
      supporter: 'bg-blue-500/20 text-blue-500',
    };
    return colors[level] || colors.supporter;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Image & Quote */}
      <Card className="relative overflow-hidden border-primary/20 mb-8">
        <div className="relative h-[400px] md:h-[500px]">
          <img 
            src={scholarshipsImage} 
            alt="Scholarship Recipients" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-10 text-white max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-emerald-400">
                YOUR GIFT MAKES A REAL IMPACT.
              </h1>
              <p className="text-lg md:text-xl leading-relaxed">
                National College Resources Foundation has awarded students over <span className="font-bold text-emerald-300">$3,500,000 in scholarships</span> due to the enormous hearts of our supporters! Over <span className="font-bold text-emerald-300">95% of our scholarship recipients complete college</span> earning at least their bachelors degree, which shows the REAL impact your gift makes!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Centered Call to Action */}
      <div className="flex justify-center mb-8">
        <Button 
          size="lg" 
          className="text-lg px-12 py-8 h-auto shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
          asChild
        >
          <a 
            href="https://ncrfoundation.charityproud.org/Donate" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Heart className="h-6 w-6 mr-3" />
            SUPPORT OUR MISSION
          </a>
        </Button>
      </div>

      {/* Students Helped Stat */}
      <div className="flex justify-center mb-12">
        <Card className="p-8 glass-premium border-primary/20 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">{studentsHelped.toLocaleString()}+</p>
              <p className="text-lg text-muted-foreground">Students Helped</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Donor Recognition */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Donor Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.length > 0 ? (
            donors.map((donor) => (
              <Card key={donor.id} className="p-6 glass-light border-primary/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{donor.donor_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Since {new Date(donor.donation_start_date).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRecognitionBadge(donor.recognition_level)}>
                    {donor.recognition_level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contributing ${donor.monthly_amount}/month
                </p>
              </Card>
            ))
          ) : (
            <Card className="p-8 glass-light border-primary/20 col-span-3">
              <p className="text-center text-muted-foreground">
                Be the first to become a monthly donor and support our mission!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
