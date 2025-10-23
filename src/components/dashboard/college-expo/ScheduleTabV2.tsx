import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CalendarView } from "./schedule/CalendarView";
import { TimelineView } from "./schedule/TimelineView";
import { useEvents } from "@/hooks/useEvents";
import { Loader2, Calendar, List } from "lucide-react";

export const ScheduleTabV2 = () => {
  const { upcomingEvents, isLoadingUpcoming } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  if (isLoadingUpcoming) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading schedule...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Event Schedule</h2>
        <p className="text-muted-foreground">
          Browse upcoming events in calendar and timeline views
        </p>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="timeline" className="gap-2">
            <List className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <TimelineView events={upcomingEvents || []} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView 
            events={upcomingEvents || []}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
