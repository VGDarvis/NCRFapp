import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Info } from "lucide-react";
import { FloorPlanManagement } from "../events/FloorPlanManagement";
import { useEvents } from "@/hooks/useEvents";

export const ExposModule = () => {
  const { events } = useEvents();

  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expo Management</h2>
        <p className="text-muted-foreground">
          Manage floor plans, booth assignments, and expo details
        </p>
      </div>

      <Tabs defaultValue="floor-plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="floor-plan" className="gap-2">
            <MapPin className="w-4 h-4" />
            Floor Plan
          </TabsTrigger>
          <TabsTrigger value="event-details" className="gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
        </TabsList>

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
