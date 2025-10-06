import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeTabProps {
  user?: any;
  isGuest?: boolean;
}

export const HomeTab = ({ user, isGuest }: HomeTabProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
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
      </div>
    </div>
  );
};
