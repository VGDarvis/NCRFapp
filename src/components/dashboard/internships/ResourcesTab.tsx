import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ResourcesTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};
