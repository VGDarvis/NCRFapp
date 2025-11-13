import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMapbox } from "@/hooks/useMapbox";
import { openNavigation } from "@/lib/navigation-utils";
import mapboxgl from "mapbox-gl";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

export const VenueLocationMap = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Subscribe to real-time event updates
  useRealtimeEvents();

  const { map, isLoaded } = useMapbox("venue-map-container", mapboxToken);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        if (error) throw error;
        if (data?.token) setMapboxToken(data.token);
      } catch (error) {
        console.error("Failed to fetch Mapbox token:", error);
      }
    };
    fetchToken();
  }, []);

  // Fetch upcoming event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, venue:venues(*)")
          .eq("status", "upcoming")
          .order("start_at", { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  // Add venue marker when map loads
  useEffect(() => {
    if (!map || !isLoaded || !event?.venue?.latitude || !event?.venue?.longitude) return;

    const { latitude, longitude } = event.venue;

    // Add venue marker
    const el = document.createElement("div");
    el.className = "w-10 h-10 cursor-pointer";
    el.innerHTML = `
      <div class="relative w-full h-full">
        <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
        <div class="relative w-full h-full bg-primary rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>
    `;

    new mapboxgl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Fly to venue
    map.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 2000,
    });
  }, [map, isLoaded, event]);

  const handleGetDirections = () => {
    if (!event?.venue) return;

    openNavigation({
      address: event.venue.address,
      city: event.venue.city,
      state: event.venue.state,
      zipCode: event.venue.zip_code,
      latitude: event.venue.latitude,
      longitude: event.venue.longitude,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event?.venue) return null;

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{event.venue.name}</h3>
              <p className="text-sm text-muted-foreground">
                {event.venue.address}, {event.venue.city}, {event.venue.state}
              </p>
            </div>
          </div>
          <Button onClick={handleGetDirections} className="gap-2">
            <Navigation className="h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </div>
      <div className="relative h-[300px] md:h-[400px]">
        <div id="venue-map-container" className="absolute inset-0" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
};
