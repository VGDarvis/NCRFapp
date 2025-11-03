import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSessionManager } from '@/hooks/useSessionManager';
import { SessionWarningDialog } from '@/components/SessionWarningDialog';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminMobileNav } from '@/components/admin/layout/AdminMobileNav';
import { EventQRCodeGenerator } from '@/components/admin/events/EventQRCodeGenerator';
import { AppSidebar } from '@/components/admin/layout/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { MetricsGrid } from '@/components/admin/dashboard/MetricsGrid';
import { RecentActivityFeed } from '@/components/admin/dashboard/RecentActivityFeed';
import { UpcomingTasksWidget } from '@/components/admin/dashboard/UpcomingTasksWidget';
import { Shield } from 'lucide-react';
import { ThemeProvider } from "next-themes";
import { CRMModule } from '@/components/admin/crm/CRMModule';
import { ExposModule } from '@/components/admin/expos/ExposModule';
import { ExhibitorsModule } from '@/components/admin/expos/ExhibitorsModule';
import { AnalyticsModule } from '@/components/admin/analytics/AnalyticsModule';

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
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen w-full flex admin-gradient">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden md:flex">
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full pb-20 md:pb-0">
            <AdminHeader userEmail={userEmail} />
            
            <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-7xl">
              {activeTab === 'dashboard' && (
                <>
                  <MetricsGrid />
                  <div className="grid gap-6 lg:grid-cols-2">
                    <RecentActivityFeed />
                    <UpcomingTasksWidget />
                  </div>
                </>
              )}
              
              {activeTab === 'analytics' && <AnalyticsModule />}
              
              {activeTab === 'expos' && <ExposModule />}
              
              {activeTab === 'crm' && <CRMModule />}
              
              {activeTab === 'exhibitors' && <ExhibitorsModule />}
              
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
                    <p className="text-muted-foreground">
                      Configure your admin panel and generate QR codes
                    </p>
                  </div>
                  
                  <div className="glass-premium rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">Event QR Code Generator</h3>
                    <p className="text-muted-foreground mb-6">
                      Generate QR codes for expo entrances, booths, and promotions
                    </p>
                    <EventQRCodeGenerator />
                  </div>
                </div>
              )}
            </main>
          </div>
          
          {/* Mobile Bottom Navigation */}
          <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}