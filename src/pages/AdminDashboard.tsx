import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSessionManager } from '@/hooks/useSessionManager';
import { SessionWarningDialog } from '@/components/SessionWarningDialog';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminMobileNav } from '@/components/admin/layout/AdminMobileNav';
import { MetricsGrid } from '@/components/admin/dashboard/MetricsGrid';
import { QuickActionsPanel } from '@/components/admin/dashboard/QuickActionsPanel';
import { RecentActivityFeed } from '@/components/admin/dashboard/RecentActivityFeed';
import { UpcomingTasksWidget } from '@/components/admin/dashboard/UpcomingTasksWidget';
import { Shield } from 'lucide-react';
import { ThemeProvider } from "next-themes";
import { CRMModule } from '@/components/admin/crm/CRMModule';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { showWarning, userEmail, resetActivity, dismissWarning } = useSessionManager();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Verify admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      console.error('Admin access check error:', error);
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} functionality coming in Phase 3-5`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-gradient">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionWarningDialog 
        open={showWarning} 
        onContinue={() => {
          resetActivity();
          dismissWarning();
        }} 
      />
      <div className="min-h-screen admin-gradient pb-20 md:pb-8">
        <AdminHeader userEmail={userEmail} />
        
        <main className="container mx-auto px-4 py-6 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <MetricsGrid />
              <div className="grid gap-6 lg:grid-cols-2">
                <QuickActionsPanel onAction={handleQuickAction} />
                <UpcomingTasksWidget />
              </div>
              <RecentActivityFeed />
            </>
          )}
          
          {activeTab === 'crm' && <CRMModule />}
          
          {activeTab === 'messages' && (
            <div className="glass-premium rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Messages Module</h2>
              <p className="text-muted-foreground">Coming in Phase 5</p>
            </div>
          )}
          
          {activeTab === 'hr' && (
            <div className="glass-premium rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">HR Module</h2>
              <p className="text-muted-foreground">Coming in Phase 4</p>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="glass-premium rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Analytics Module</h2>
              <p className="text-muted-foreground">Coming in Phase 6</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="glass-premium rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Settings</h2>
              <p className="text-muted-foreground">Configuration options coming soon</p>
            </div>
          )}
        </main>
        
        <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
}