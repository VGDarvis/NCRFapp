import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, BarChart, Loader2, QrCode, Upload } from "lucide-react";
import { FloorPlanUploader } from "./FloorPlanUploader";
import { BoothCSVImporter } from "./BoothCSVImporter";
import { SeminarCSVImporter } from "./SeminarCSVImporter";
import { RegistrationCSVImporter } from "./RegistrationCSVImporter";
import { EventQRCodeGenerator } from "./EventQRCodeGenerator";
import { QRAnalyticsDashboard } from "../analytics/QRAnalyticsDashboard";
import { useEvents } from "@/hooks/useEvents";
import { useVenues } from "@/hooks/useVenues";
import { toast } from "sonner";

export const EventsModule = () => {
  const { events, isLoading: isLoadingEvents } = useEvents();
  const { data: venues, isLoading: isLoadingVenues } = useVenues();

  // Get the first event and venue for demo purposes
  const firstEvent = events?.[0];
  const firstVenue = venues?.[0];

  if (isLoadingEvents || isLoadingVenues) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Events Management</h2>
        <p className="text-muted-foreground">Manage expo events, venues, and analytics</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-6">
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
          <TabsTrigger value="registrations" className="gap-2">
            <Upload className="w-4 h-4" />
            Registrations
          </TabsTrigger>
          <TabsTrigger value="qr-codes" className="gap-2">
            <QrCode className="w-4 h-4" />
            QR Codes
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
          {firstVenue ? (
            <div className="grid gap-4 md:grid-cols-2">
              <FloorPlanUploader 
                venueId={firstVenue.id}
                onUploadComplete={() => window.location.reload()}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Current Venue</CardTitle>
                  <CardDescription>{firstVenue.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {firstVenue.address}</p>
                    <p><strong>City:</strong> {firstVenue.city}, {firstVenue.state}</p>
                    <p><strong>Capacity:</strong> {firstVenue.capacity || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No venues found. Create a venue first.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="booths" className="mt-6">
          {firstEvent && firstVenue ? (
            <div className="grid gap-4">
              <BoothCSVImporter 
                eventId={firstEvent.id}
                onImportComplete={() => window.location.reload()}
              />
              
              <SeminarCSVImporter 
                eventId={firstEvent.id}
                venueId={firstVenue.id}
                eventDate={firstEvent.start_at}
                onImportComplete={() => window.location.reload()}
              />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {!firstEvent ? 'No events found. Create an event first.' : 'No venues found. Create a venue first.'}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="registrations" className="mt-6">
          {firstEvent ? (
            <div className="grid gap-4">
              <RegistrationCSVImporter 
                defaultEventId={firstEvent.id}
                onImportComplete={() => {
                  toast.success('Registrations imported! Check Analytics tab to view scan data.');
                  window.location.reload();
                }}
              />
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No events found. Create an event first.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="qr-codes" className="mt-6">
          <EventQRCodeGenerator eventId={firstEvent?.id} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <QRAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
