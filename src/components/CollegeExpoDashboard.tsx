import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Home, Calendar, MapPin, Building2, BookmarkCheck, Heart, Grid3x3, Presentation } from 'lucide-react';
import { WelcomeTab } from './dashboard/college-expo/WelcomeTab';
import { MapTab } from './dashboard/college-expo/MapTab';
import { FloorPlanTabWrapper } from './dashboard/college-expo/FloorPlanTabWrapper';
import { SeminarsTabWrapper } from './dashboard/college-expo/SeminarsTabWrapper';
import { ScheduleTabV2 } from './dashboard/college-expo/ScheduleTabV2';
import { VendorsTabV2 } from './dashboard/college-expo/VendorsTabV2';
import { MyScheduleTab } from './dashboard/college-expo/MyScheduleTab';
import { DonorsTab } from './dashboard/college-expo/DonorsTab';
import { DashboardHeader } from './DashboardHeader';
import logoGreenClean from '@/assets/logo-green-clean.png';

interface CollegeExpoDashboardProps {
  isGuest?: boolean;
}

export const CollegeExpoDashboard = ({ isGuest = false }: CollegeExpoDashboardProps) => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const tabs = [
    {
      id: 'welcome',
      label: 'Welcome',
      icon: Home,
      component: WelcomeTab
    },
    {
      id: 'map',
      label: 'Map',
      icon: MapPin,
      component: MapTab
    },
    {
      id: 'floor-plan',
      label: 'Floor Plan',
      icon: Grid3x3,
      component: FloorPlanTabWrapper
    },
    {
      id: 'seminars',
      label: 'Seminars',
      icon: Presentation,
      component: SeminarsTabWrapper
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      component: ScheduleTabV2
    },
    {
      id: 'vendors',
      label: 'Vendors',
      icon: Building2,
      component: VendorsTabV2
    },
    {
      id: 'my-schedule',
      label: 'My Schedule',
      icon: BookmarkCheck,
      component: MyScheduleTab
    },
    {
      id: 'donors',
      label: 'Donors',
      icon: Heart,
      component: DonorsTab
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || WelcomeTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-background flex flex-col">
      {/* Header */}
      <DashboardHeader
        logo={logoGreenClean}
        logoAlt="NCRF College Expo & Preparation"
        title="College Expo & Preparation"
        subtitle="Your Journey to Higher Education"
        isGuest={isGuest}
      />
      
      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-8">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border md:hidden z-50">
        <div className="grid grid-cols-8 h-16">
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