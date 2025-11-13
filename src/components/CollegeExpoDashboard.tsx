import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Home, Calendar, MapPin, GraduationCap, Heart, Wifi } from 'lucide-react';
import { useGuestSession } from '@/hooks/useGuestSession';
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';
import { useActiveEvent } from '@/hooks/useActiveEvent';
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
  
  // Enable real-time updates for all event data across all tabs
  const { activeEvent } = useActiveEvent();
  useRealtimeEvents(activeEvent?.id);
  
  const eventId = activeEvent?.id || null;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Track guest session with detailed analytics
  const { trackPageView } = useGuestSession(eventId, `college-expo-${activeTab}`);

  // Track tab changes
  useEffect(() => {
    trackPageView(`college-expo-${activeTab}`);
  }, [activeTab, trackPageView]);

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      component: WelcomeTab
    },
    {
      id: 'maps',
      label: 'Maps',
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
      
      {/* Live Updates Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20 shadow-lg">
          <Wifi className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">Live Updates</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 pb-20">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-50">
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