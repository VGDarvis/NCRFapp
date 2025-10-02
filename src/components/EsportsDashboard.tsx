import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { HomeTab } from './dashboard/HomeTab';
import { LeaguesTab } from './dashboard/LeaguesTab';
import { TeamsTab } from './dashboard/TeamsTab';
import { StatsTab } from './dashboard/StatsTab';
import { ShopTab } from './dashboard/ShopTab';
import { Home, Trophy, Users, BarChart3, ShoppingBag } from 'lucide-react';

interface EsportsDashboardProps {
  isGuest?: boolean;
}

export const EsportsDashboard = ({ isGuest = false }: EsportsDashboardProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, component: HomeTab },
    { id: 'leagues', label: 'Leagues', icon: Trophy, component: LeaguesTab },
    { id: 'teams', label: 'Teams', icon: Users, component: TeamsTab },
    { id: 'stats', label: 'Stats', icon: BarChart3, component: StatsTab },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, component: ShopTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomeTab;

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      {/* Main Content */}
      <div className="flex-1 pb-20 overflow-y-auto">
        <ActiveComponent user={user} isGuest={isGuest} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-heavy border-t border-primary/20 backdrop-blur-xl">
          <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[60px] ${
                    activeTab === tab.id
                      ? 'glass-cyber text-primary scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:glass-light'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`mb-1 ${activeTab === tab.id ? 'drop-shadow-[0_0_8px_hsl(var(--primary))]' : ''}`} 
                  />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};