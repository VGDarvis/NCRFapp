import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Home, MapPin, GraduationCap, BookOpen, Users, Heart } from 'lucide-react';
import { CollegeExpoHomeTab } from './dashboard/college-expo/HomeTab';
import { EventsMapTab } from './dashboard/college-expo/EventsMapTab';
import { ScholarshipsTab } from './dashboard/college-expo/ScholarshipsTab';
import { CollegePrepTab } from './dashboard/college-expo/CollegePrepTab';
import { ResourcesTab } from './dashboard/college-expo/ResourcesTab';
import { DonorsTab } from './dashboard/college-expo/DonorsTab';

interface CollegeExpoDashboardProps {
  isGuest?: boolean;
}

export const CollegeExpoDashboard = ({ isGuest = false }: CollegeExpoDashboardProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      component: CollegeExpoHomeTab
    },
    {
      id: 'events',
      label: 'Events & Expos',
      icon: MapPin,
      component: EventsMapTab
    },
    {
      id: 'scholarships',
      label: 'Scholarships',
      icon: GraduationCap,
      component: ScholarshipsTab
    },
    {
      id: 'prep',
      label: 'College Prep',
      icon: BookOpen,
      component: CollegePrepTab
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Users,
      component: ResourcesTab
    },
    {
      id: 'donors',
      label: 'Donors',
      icon: Heart,
      component: DonorsTab
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CollegeExpoHomeTab;

  return (
    <div className="min-h-screen bg-gradient-primary pb-20 md:pb-8">
      <ActiveComponent user={user} isGuest={isGuest} />
      
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border md:hidden z-50">
        <div className="grid grid-cols-6 h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};