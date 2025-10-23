import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, BarChart } from "lucide-react";

export const EventsModule = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Events Management</h2>
        <p className="text-muted-foreground">Manage expo events, venues, and analytics</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="venues" className="gap-2">
            <MapPin className="w-4 h-4" />
            Venues
          </TabsTrigger>
          <TabsTrigger value="booths" className="gap-2">
            <Users className="w-4 h-4" />
            Booths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <Card className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Event Management</h3>
            <p className="text-muted-foreground">
              CRUD operations, bulk import, and event duplication coming soon
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="mt-6">
          <Card className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Venue Management</h3>
            <p className="text-muted-foreground">
              Add and manage event venues with floor plans
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="booths" className="mt-6">
          <Card className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Booth Management</h3>
            <p className="text-muted-foreground">
              Visual floor plan editor with drag-drop booth positioning
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="p-8 text-center">
            <BarChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Event Analytics</h3>
            <p className="text-muted-foreground">
              Booth traffic heatmaps, registration metrics, and attendance tracking
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
