import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Home, Heart, Users, Star, Activity, MessageSquare } from 'lucide-react';
import { MovementHomeTab } from './dashboard/movement/HomeTab';
import { MovementProgramsTab } from './dashboard/movement/ProgramsTab';
import { MovementMentorsTab } from './dashboard/movement/MentorsTab';
import { MovementReviewsTab } from './dashboard/movement/ReviewsTab';
import { MovementProgressTab } from './dashboard/movement/ProgressTab';
import { MovementCommunityTab } from './dashboard/movement/CommunityTab';
import { DashboardHeader } from './DashboardHeader';
import movementLogo from '@/assets/logo-movement.png';

interface MovementDashboardProps {
  isGuest?: boolean;
}

export function MovementDashboard({ isGuest = false }: MovementDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isGuest) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    }
  }, [isGuest]);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, component: MovementHomeTab },
    { id: 'programs', label: 'Programs', icon: Heart, component: MovementProgramsTab },
    { id: 'mentors', label: 'Mentors', icon: Users, component: MovementMentorsTab },
    { id: 'reviews', label: 'Reviews', icon: Star, component: MovementReviewsTab },
    { id: 'progress', label: 'Progress', icon: Activity, component: MovementProgressTab },
    { id: 'community', label: 'Community', icon: MessageSquare, component: MovementCommunityTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MovementHomeTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-background flex flex-col">
      {/* Movement Logo Header */}
      <DashboardHeader
        logo={movementLogo}
        logoAlt="NCRF Movement Enrichment Program"
        title="Movement Enrichment"
        subtitle="Tutoring, Mentorship & Wellness"
        isGuest={isGuest}
      />

      {/* Main Content */}
      <div className="flex-1 pb-20 overflow-y-auto">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-premium border-t border-pink-500/20 backdrop-blur-lg z-50">
        <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-pink-500 bg-pink-500/10'
                    : 'text-muted-foreground hover:text-pink-400 hover:bg-pink-500/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
