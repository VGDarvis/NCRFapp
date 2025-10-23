import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleTabV2 } from "./ScheduleTabV2";
import { MyScheduleTab } from "./MyScheduleTab";
import { SeminarsTabWrapper } from "./SeminarsTabWrapper";
import { Calendar, BookmarkCheck, Presentation } from "lucide-react";

export const ScheduleTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="all-events" className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
          <TabsTrigger value="all-events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">All Events</span>
            <span className="sm:hidden">Events</span>
          </TabsTrigger>
          <TabsTrigger value="my-schedule" className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            <span className="hidden sm:inline">My Schedule</span>
            <span className="sm:hidden">Mine</span>
          </TabsTrigger>
          <TabsTrigger value="seminars" className="flex items-center gap-2">
            <Presentation className="h-4 w-4" />
            <span>Seminars</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-events" className="mt-0">
          <ScheduleTabV2 />
        </TabsContent>

        <TabsContent value="my-schedule" className="mt-0">
          <MyScheduleTab />
        </TabsContent>

        <TabsContent value="seminars" className="mt-0">
          <SeminarsTabWrapper />
        </TabsContent>
      </Tabs>
    </div>
  );
};
