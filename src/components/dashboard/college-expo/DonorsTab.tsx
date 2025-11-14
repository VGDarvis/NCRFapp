import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users } from 'lucide-react';
import scholarshipsImage from '@/assets/scholarships-giveaway.jpg';

interface DonorsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const DonorsTab = ({ user, isGuest }: DonorsTabProps) => {
  const studentsHelped = 500000;

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
    </div>
  );
};
