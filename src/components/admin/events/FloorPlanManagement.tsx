import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { FloorPlanEditor } from "./FloorPlanEditor";
import { toast } from "sonner";

export const FloorPlanManagement = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadFloorPlan(selectedEventId);
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_at, venue_id")
        .eq("event_type", "college_fair")
        .order("start_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const loadFloorPlan = async (eventId: string) => {
    try {
      const { data: eventData } = await supabase
        .from("events")
        .select("venue_id")
        .eq("id", eventId)
        .single();

      if (eventData?.venue_id) {
        const { data: floorPlanData } = await supabase
          .from("floor_plans")
          .select("id")
          .eq("venue_id", eventData.venue_id)
          .limit(1)
          .maybeSingle();

        setFloorPlanId(floorPlanData?.id || null);
      }
    } catch (error) {
      console.error("Error loading floor plan:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Floor Plan Management</h1>
        <p className="text-muted-foreground">
          Design and configure interactive floor plans for expo events
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Select Event</Label>
            <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} - {new Date(event.start_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEventId && (
            <FloorPlanEditor
              eventId={selectedEventId}
              floorPlanId={floorPlanId}
              onFloorPlanCreated={(newFloorPlanId) => setFloorPlanId(newFloorPlanId)}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
