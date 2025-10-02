import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { HomeTab } from './dashboard/steam/HomeTab';
import { ProjectsTab } from './dashboard/steam/ProjectsTab';
import { LearningTab } from './dashboard/steam/LearningTab';
import { LabsTab } from './dashboard/steam/LabsTab';
import { CommunityTab } from './dashboard/steam/CommunityTab';
import { Home, FlaskConical, BookOpen, Microscope, Users } from 'lucide-react';
import steamLogo from '@/assets/logo-steam.png';

interface SteamDashboardProps {
  isGuest?: boolean;
}

export const SteamDashboard = ({ isGuest = false }: SteamDashboardProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isGuest) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    }
  }, [isGuest]);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, component: HomeTab },
    { id: 'projects', label: 'Projects', icon: FlaskConical, component: ProjectsTab },
    { id: 'learning', label: 'Learning', icon: BookOpen, component: LearningTab },
    { id: 'labs', label: 'Labs', icon: Microscope, component: LabsTab },
    { id: 'community', label: 'Community', icon: Users, component: CommunityTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomeTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-background flex flex-col">
      {/* STEAM Logo Header */}
      <header className="sticky top-0 z-40 glass-premium border-b border-primary/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <img 
            src={steamLogo} 
            alt="NCRF STEAM Program" 
            className="h-16 md:h-20 w-auto object-contain logo-glow"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pb-20 overflow-y-auto">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-premium border-t border-primary/20 z-50">
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-purple-400 bg-purple-400/10'
                    : 'text-muted-foreground hover:text-purple-300 hover:bg-purple-400/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
