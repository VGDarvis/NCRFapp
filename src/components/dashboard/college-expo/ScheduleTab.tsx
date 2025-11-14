import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyScheduleTab } from "./MyScheduleTab";
import { SeminarsTabWrapper } from "./SeminarsTabWrapper";
import { StageTab } from "./StageTab";
import { BookmarkCheck, Presentation, Sparkles } from "lucide-react";

export const ScheduleTab = () => {
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
          <MyScheduleTab eventId="houston-2025" />
        </TabsContent>

        <TabsContent value="stage" className="mt-0">
          <StageTab eventId="houston-2025" />
        </TabsContent>

        <TabsContent value="seminars" className="mt-0">
          <SeminarsTabWrapper />
        </TabsContent>
      </Tabs>
    </div>
  );
};
