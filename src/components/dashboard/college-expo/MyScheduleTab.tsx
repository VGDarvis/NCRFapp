import { Card } from '@/components/ui/card';
import { BookmarkCheck } from 'lucide-react';

export const MyScheduleTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-12 text-center">
        <BookmarkCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">My Schedule</h2>
        <p className="text-muted-foreground">
          View your saved events, registrations, and QR codes in one place.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Coming in Phase 3: Personal event dashboard with QR codes and calendar export.
        </p>
      </Card>
    </div>
  );
};
