import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, TrendingUp, Users } from 'lucide-react';

interface DonorsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const DonorsTab = ({ user, isGuest }: DonorsTabProps) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalDonors: 0, monthlySupport: 0, studentsHelped: 0 });

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
        const totalDonors = data.length;
        const monthlySupport = data.reduce((sum, d) => sum + Number(d.monthly_amount), 0);
        setStats({
          totalDonors,
          monthlySupport,
          studentsHelped: Math.floor(monthlySupport / 50), // Estimate
        });
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
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        Our Amazing <span className="text-primary">Donors</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Thank you to our monthly donors who make college access possible for all students
      </p>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalDonors}</p>
              <p className="text-sm text-muted-foreground">Active Donors</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${stats.monthlySupport.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Monthly Support</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.studentsHelped}+</p>
              <p className="text-sm text-muted-foreground">Students Helped</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="p-8 glass-premium border-primary/20 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Become a Monthly Donor
            </h2>
            <p className="text-muted-foreground mb-4">
              Your monthly contribution helps us provide college expo events, scholarship resources,
              and guidance to students pursuing higher education. Every dollar makes a difference!
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap" asChild>
            <a 
              href="https://ncrfoundation.charityproud.org/Donate" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Heart className="h-5 w-5 mr-2" />
              Support Our Mission
            </a>
          </Button>
        </div>
      </Card>

      {/* Donor Recognition */}
      <h2 className="text-2xl font-bold text-foreground mb-4">Donor Recognition</h2>
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
  );
};