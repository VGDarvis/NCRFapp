import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FloorPlanTab } from "./FloorPlanTab";

export const FloorPlanTabWrapper = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, venue_id")
          .eq("status", "upcoming")
          .order("start_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setEventId(data.id);
          setVenueId(data.venue_id);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading BCE Map...</p>
        </Card>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No BCE Map Available</h3>
          <p className="text-muted-foreground">
            There are no upcoming events at this time.
          </p>
        </Card>
      </div>
    );
  }

  return <FloorPlanTab eventId={eventId} venueId={venueId} />;
};
