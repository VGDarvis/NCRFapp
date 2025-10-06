import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export const JobsTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};
