import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Edit3, List } from "lucide-react";
import { FloorPlanManagement } from "../events/FloorPlanManagement";
import { BoothEditorTab } from "./BoothEditorTab";
import { BoothListEditor } from "./BoothListEditor";
import { useEvents } from "@/hooks/useEvents";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useState } from "react";

export const ExposModule = () => {
  const { events } = useEvents();
  const [selectedEventForSettings, setSelectedEventForSettings] = useState<string>("");
  
  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];
  const selectedEventData = collegeExpos.find(e => e.id === selectedEventForSettings);
  const venueId = selectedEventData?.venue?.id || null;
  const { data: floorPlans } = useFloorPlans(venueId);
  const floorPlan = floorPlans?.[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expo Management</h2>
        <p className="text-muted-foreground">
          Manage floor plans, booth assignments, and expo details
        </p>
      </div>

      <Tabs defaultValue="list-editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list-editor" className="gap-2">
            <List className="w-4 h-4" />
            Booth List Editor
          </TabsTrigger>
          <TabsTrigger value="floor-plan" className="gap-2">
            <MapPin className="w-4 h-4" />
            Attendee View
          </TabsTrigger>
          <TabsTrigger value="edit-booths" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Booths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list-editor" className="space-y-4">
          <BoothListEditor floorPlanId={floorPlan?.id || null} />
        </TabsContent>

        <TabsContent value="floor-plan" className="space-y-4">
          <FloorPlanManagement />
        </TabsContent>

        <TabsContent value="edit-booths" className="space-y-4">
          <BoothEditorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
