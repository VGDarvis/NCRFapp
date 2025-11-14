import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyScheduleTab } from "./MyScheduleTab";
import { SeminarsTab } from "./SeminarsTab";
import { StageTab } from "./StageTab";
import { BookmarkCheck, Presentation, Sparkles, Loader2 } from "lucide-react";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { Card } from "@/components/ui/card";

export const ScheduleTab = () => {
  const { activeEvent, isLoading } = useActiveEvent();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading schedule...</p>
        </Card>
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No Event Available</h3>
          <p className="text-muted-foreground">
            There are no upcoming events at this time.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="seminars" className="w-full">
        <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-6">
          <TabsTrigger value="my-schedule" className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            <span className="hidden sm:inline">My Schedule</span>
            <span className="sm:hidden">Mine</span>
          </TabsTrigger>
          <TabsTrigger value="stage" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Stage</span>
          </TabsTrigger>
          <TabsTrigger value="seminars" className="flex items-center gap-2">
            <Presentation className="h-4 w-4" />
            <span>Seminars</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-schedule" className="mt-0">
          <MyScheduleTab eventId={activeEvent.id} />
        </TabsContent>

        <TabsContent value="stage" className="mt-0">
          <StageTab eventId={activeEvent.id} />
        </TabsContent>

        <TabsContent value="seminars" className="mt-0">
          <SeminarsTab eventId={activeEvent.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
