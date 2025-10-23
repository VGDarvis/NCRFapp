import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export const ScheduleTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-12 text-center">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Event Schedule</h2>
        <p className="text-muted-foreground">
          Browse all upcoming events in calendar and timeline views.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Coming in Phase 2: Multi-view scheduling with add-to-calendar functionality.
        </p>
      </Card>
    </div>
  );
};
