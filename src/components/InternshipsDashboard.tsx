import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Home, FileText, Search, Briefcase, Users, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardHeader } from './DashboardHeader';
import logoInternshipsCareer from '@/assets/logo-internships-career.png';
import { HomeTab } from './dashboard/internships/HomeTab';
import { ResumeTab } from './dashboard/internships/ResumeTab';
import { JobsTab } from './dashboard/internships/JobsTab';
import { CareerPrepTab } from './dashboard/internships/CareerPrepTab';
import { NetworkingTab } from './dashboard/internships/NetworkingTab';
import { ResourcesTab } from './dashboard/internships/ResourcesTab';

interface InternshipsDashboardProps {
  isGuest?: boolean;
}

export const InternshipsDashboard = ({ isGuest = false }: InternshipsDashboardProps) => {
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
    { id: 'resume', label: 'Resume', icon: FileText, component: ResumeTab },
    { id: 'jobs', label: 'Jobs', icon: Search, component: JobsTab },
    { id: 'prep', label: 'Career Prep', icon: Briefcase, component: CareerPrepTab },
    { id: 'network', label: 'Network', icon: Users, component: NetworkingTab },
    { id: 'resources', label: 'Resources', icon: BookOpen, component: ResourcesTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomeTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-background flex flex-col">
      {/* Header */}
      <DashboardHeader
        logo={logoInternshipsCareer}
        logoAlt="Internships & Career"
        title="Internships & Career"
        subtitle="Professional Development Hub"
      />

      {/* Main Content */}
      <div className="flex-1 pb-20 overflow-y-auto">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-premium border-t border-primary/20 backdrop-blur-lg z-50">
        <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-500 bg-blue-500/10'
                    : 'text-muted-foreground hover:text-blue-400 hover:bg-blue-500/5'
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
};
