import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Info, Edit3, MousePointerClick, List, FolderTree, ImageIcon } from "lucide-react";
import { FloorPlanManagement } from "../events/FloorPlanManagement";
import { BoothEditorTab } from "./BoothEditorTab";
import { FloorPlanEditorTab } from "./FloorPlanEditorTab";
import { BoothListEditor } from "./BoothListEditor";
import { ZoneManager } from "./ZoneManager";
import { FloorPlanImageUpload } from "./FloorPlanImageUpload";
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
          <TabsTrigger value="zones" className="gap-2">
            <FolderTree className="w-4 h-4" />
            Zones
          </TabsTrigger>
          <TabsTrigger value="floor-plan-settings" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Floor Plan Settings
          </TabsTrigger>
          <TabsTrigger value="edit-booths" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Booths
          </TabsTrigger>
          <TabsTrigger value="floor-plan" className="gap-2">
            <MapPin className="w-4 h-4" />
            Attendee View
          </TabsTrigger>
          <TabsTrigger value="event-details" className="gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list-editor" className="space-y-4">
          <BoothListEditor />
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <ZoneManager floorPlanId={floorPlan?.id || null} />
        </TabsContent>

        <TabsContent value="floor-plan-settings" className="space-y-4">
          <FloorPlanImageUpload floorPlanId={floorPlan?.id || null} />
        </TabsContent>

        <TabsContent value="edit-booths" className="space-y-4">
          <BoothEditorTab />
        </TabsContent>

        <TabsContent value="floor-plan" className="space-y-4">
          <FloorPlanManagement />
        </TabsContent>

        <TabsContent value="event-details" className="space-y-4">
          {collegeExpos.length === 0 ? (
            <Card className="p-8 text-center">
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No college expo events found</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collegeExpos.map((expo) => (
                <Card key={expo.id} className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{expo.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expo.start_at).toLocaleDateString()} -{" "}
                      {new Date(expo.end_at).toLocaleDateString()}
                    </p>
                    {expo.venue && (
                      <p className="text-sm">{expo.venue.address}</p>
                    )}
                    {expo.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {expo.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
