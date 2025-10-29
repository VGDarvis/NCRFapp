import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Home, Calendar, MapPin, GraduationCap, Heart } from 'lucide-react';
import { useGuestAnalytics } from '@/hooks/useGuestAnalytics';
import { WelcomeTab } from './dashboard/college-expo/WelcomeTab';
import { ExploreTab } from './dashboard/college-expo/ExploreTab';
import { ScheduleTab } from './dashboard/college-expo/ScheduleTab';
import { VendorsTabV2 } from './dashboard/college-expo/VendorsTabV2';
import { DonorsTab } from './dashboard/college-expo/DonorsTab';
import { DashboardHeader } from './DashboardHeader';
import logoGreenClean from '@/assets/logo-green-clean.png';

interface CollegeExpoDashboardProps {
  isGuest?: boolean;
}

export const CollegeExpoDashboard = ({ isGuest = false }: CollegeExpoDashboardProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Fetch the current/next event for analytics
    const fetchCurrentEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select('id')
        .eq('status', 'upcoming')
        .order('start_at', { ascending: true })
        .limit(1)
        .single();
      
      if (data) setEventId(data.id);
    };

    fetchCurrentEvent();
  }, []);

  // Track guest analytics
  useGuestAnalytics(eventId, `college-expo-${activeTab}`);

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      component: WelcomeTab
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: MapPin,
      component: ExploreTab
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      component: ScheduleTab
    },
    {
      id: 'vendors',
      label: 'Colleges',
      icon: GraduationCap,
      component: VendorsTabV2
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
        <div className="grid grid-cols-5 h-16">
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