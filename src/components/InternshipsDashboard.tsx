import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Briefcase, FileText, Search, Users, BookOpen, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from './DashboardHeader';
import logoInternshipsCareer from '@/assets/logo-internships-career.png';

export const InternshipsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen cyber-gradient">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <DashboardHeader
            logo={logoInternshipsCareer}
            logoAlt="Internships & Career"
            title="Internships & Career"
            subtitle="Professional Development Hub"
            showBackButton={false}
          />
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Job Search</span>
            </TabsTrigger>
            <TabsTrigger value="prep" className="gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Career Prep</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Networking</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle>Welcome to Career Development</CardTitle>
                  <CardDescription>Your journey to professional success starts here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access tools and resources to build your resume, search for internships and jobs, 
                    prepare for interviews, and connect with industry professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your professional profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-primary">35%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle>Active Applications</CardTitle>
                  <CardDescription>Track your job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">0</div>
                    <p className="text-sm text-muted-foreground">Active applications</p>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Start Applying
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>Steps to launch your career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Build Your Resume</h4>
                      <p className="text-sm text-muted-foreground">Create a professional resume using our builder</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Explore Opportunities</h4>
                      <p className="text-sm text-muted-foreground">Search for internships and entry-level positions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Prepare for Success</h4>
                      <p className="text-sm text-muted-foreground">Practice interviews and develop key skills</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Network & Connect</h4>
                      <p className="text-sm text-muted-foreground">Build relationships with mentors and professionals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resume Builder Tab */}
          <TabsContent value="resume" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Create and manage your professional resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Resume Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start building your professional resume to showcase your skills and experience
                  </p>
                  <Button>Create New Resume</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Search Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Job & Internship Search</CardTitle>
                <CardDescription>Find opportunities that match your skills and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Discover Opportunities</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search for internships, entry-level positions, and career opportunities
                  </p>
                  <Button>Start Searching</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Prep Tab */}
          <TabsContent value="prep" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Career Preparation</CardTitle>
                <CardDescription>Develop skills and prepare for your career journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Interview Preparation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Practice common interview questions and improve your responses
                    </p>
                    <Button variant="outline" size="sm">Start Practicing</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Skills Assessment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Identify your strengths and areas for development
                    </p>
                    <Button variant="outline" size="sm">Take Assessment</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Career Planning</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Explore career paths and set professional goals
                    </p>
                    <Button variant="outline" size="sm">Explore Careers</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Professional Development</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Build essential workplace skills and competencies
                    </p>
                    <Button variant="outline" size="sm">View Courses</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Networking Tab */}
          <TabsContent value="network" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Professional Networking</CardTitle>
                <CardDescription>Connect with mentors, alumni, and industry professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Build Your Network</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with professionals who can guide your career journey
                  </p>
                  <Button>Find Mentors</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Career Resources</CardTitle>
                <CardDescription>Access guides, tools, and information for career success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">📚 Career Guides</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive guides for resume writing, interviewing, and job searching
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">💼 Industry Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn about different industries, roles, and career paths
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">💰 Salary Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Research competitive salaries and compensation packages
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🎓 Learning Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Access online courses and certifications to build new skills
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
