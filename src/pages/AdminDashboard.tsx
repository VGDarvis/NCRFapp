import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  LogOut, 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign,
  Activity,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleSignOut = async () => {
    await supabase.rpc('log_admin_action', {
      p_action: 'admin_logout',
    });
    
    await supabase.auth.signOut();
    
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal.",
    });
    
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-premium border-b border-primary/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">NCRF Foundation Management</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 glass-premium">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financials</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-premium">
                <CardHeader className="pb-2">
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-3xl text-primary">0</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Across all programs</p>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader className="pb-2">
                  <CardDescription>Active Events</CardDescription>
                  <CardTitle className="text-3xl text-primary">0</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Upcoming & ongoing</p>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader className="pb-2">
                  <CardDescription>Total Programs</CardDescription>
                  <CardTitle className="text-3xl text-primary">6</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Active programs</p>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader className="pb-2">
                  <CardDescription>System Health</CardDescription>
                  <CardTitle className="text-3xl text-green-500">●</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
                <CardDescription>Quick stats for all NCRF programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'College Expo & Preparation', users: 0, events: 0, color: 'blue' },
                    { name: 'STEAM Program', users: 0, projects: 0, color: 'purple' },
                    { name: 'Movement Enrichment', users: 0, sessions: 0, color: 'pink' },
                    { name: 'Student Athlete Program', users: 0, workshops: 0, color: 'amber' },
                    { name: 'Internships & Career', users: 0, applications: 0, color: 'cyan' },
                    { name: 'eSports League', users: 0, tournaments: 0, color: 'indigo' },
                  ].map((program) => (
                    <div key={program.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.users} users · {Object.values(program)[2]} {Object.keys(program)[2]}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics across all programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users across all programs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Manage events, workshops, and expos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Event management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage resources, articles, and media</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Content management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Financial Dashboard</CardTitle>
                <CardDescription>Donations, expenses, and financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Financial dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}