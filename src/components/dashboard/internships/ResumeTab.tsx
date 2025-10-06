import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const ResumeTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
    </div>
  );
};
