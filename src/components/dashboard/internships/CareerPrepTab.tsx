import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const CareerPrepTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};
