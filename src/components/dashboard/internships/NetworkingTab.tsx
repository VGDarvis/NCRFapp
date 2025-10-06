import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const NetworkingTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};
