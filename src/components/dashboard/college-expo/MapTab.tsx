import { useState, useEffect, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useBooths } from "@/hooks/useBooths";
import { useMapbox } from "@/hooks/useMapbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Eye, EyeOff } from "lucide-react";
import { EventSwitcher } from "./map/EventSwitcher";
import { MapFilterSidebar, MapFilters } from "./map/MapFilterSidebar";
import { MapCardDrawer } from "./map/MapCardDrawer";
import { RegistrationDrawer } from "./RegistrationDrawer";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import {
  createMarkerElement,
  flyToLocation,
  convertBoothsToGeoJSON,
} from "@/lib/mapbox-utils";
import { getUserLocation } from "@/lib/geolocation-utils";

export const MapTab = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showBoothLayer, setShowBoothLayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MapFilters>({
    orgTypes: [],
    tiers: [],
    distanceRadius: 100,
  });
  const [drawerContent, setDrawerContent] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const boothSourceRef = useRef<string | null>(null);

  const { eventsWithVenues, isLoadingEventsWithVenues } = useEvents();
  const { data: booths, isLoading: isLoadingBooths } = useBooths(
    showBoothLayer ? selectedEventId : null,
    {
      search: searchQuery,
      org_type: filters.orgTypes,
      tier: filters.tiers,
    }
  );
  const { map, isLoaded } = useMapbox("map-container", mapboxToken);

  // Load Mapbox token (stub - in production would fetch from backend)
  useEffect(() => {
    // For now, user must input token manually
    // In production, fetch from Supabase Edge Function
    const savedToken = localStorage.getItem("mapbox_token");
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Get user location
  useEffect(() => {
    getUserLocation()
      .then((location) => setUserLocation(location))
      .catch(() => {
        // User denied location permission - that's ok
      });
  }, []);

  // Auto-select Houston event if it's the only one
  useEffect(() => {
    if (eventsWithVenues && eventsWithVenues.length === 1 && !selectedEventId) {
      setSelectedEventId(eventsWithVenues[0].id);
    }
  }, [eventsWithVenues, selectedEventId]);

  // Handle event selection - fly to venue
  useEffect(() => {
    if (!map || !isLoaded || !selectedEventId || !eventsWithVenues) return;

    const selectedEvent = eventsWithVenues.find((e) => e.id === selectedEventId);
    if (!selectedEvent?.venue) return;

    const { latitude, longitude } = selectedEvent.venue;
    if (!latitude || !longitude) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add venue marker
    const el = createMarkerElement("venue");
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Add click handler
    el.addEventListener("click", () => {
      setDrawerContent({
        type: "event",
        ...selectedEvent,
      });
      setDrawerOpen(true);
    });

    markersRef.current.push(marker);

    // Fly to venue
    flyToLocation(map, longitude, latitude, 15);
  }, [map, isLoaded, selectedEventId, eventsWithVenues]);

  // Handle booth layer
  useEffect(() => {
    if (!map || !isLoaded || !showBoothLayer || !booths || booths.length === 0)
      return;

    // Remove old booth markers
    if (boothSourceRef.current) {
      if (map.getLayer("booth-markers")) map.removeLayer("booth-markers");
      if (map.getLayer("clusters")) map.removeLayer("clusters");
      if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
      if (map.getSource(boothSourceRef.current))
        map.removeSource(boothSourceRef.current);
    }

    // Add booth markers with clustering
    const geojson = convertBoothsToGeoJSON(booths);
    const sourceId = `booths-${Date.now()}`;
    boothSourceRef.current = sourceId;

    map.addSource(sourceId, {
      type: "geojson",
      data: geojson as any,
      cluster: true,
      clusterMaxZoom: 16,
      clusterRadius: 50,
    });

    // Add cluster circles
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#3b82f6",
          10,
          "#2563eb",
          20,
          "#1d4ed8",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 20, 40],
      },
    });

    // Add cluster count labels
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    // Add unclustered booth markers
    booths.forEach((booth) => {
      if (!booth.latitude || !booth.longitude) return;

      const el = createMarkerElement("booth", booth.sponsor?.tier);
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([booth.longitude, booth.latitude])
        .addTo(map);

      el.addEventListener("click", () => {
        setDrawerContent({
          type: "booth",
          ...booth,
        });
        setDrawerOpen(true);
      });

      markersRef.current.push(marker);
    });

    // Handle cluster clicks (zoom in)
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const coordinates = (features[0].geometry as any).coordinates;
        map.easeTo({
          center: coordinates,
          zoom: zoom,
        });
      });
    });

    // Change cursor on hover
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [map, isLoaded, showBoothLayer, booths]);

  // Handle token submission
  const handleTokenSubmit = () => {
    if (!tokenInput.trim()) {
      toast.error("Please enter a valid Mapbox token");
      return;
    }
    localStorage.setItem("mapbox_token", tokenInput);
    setMapboxToken(tokenInput);
    toast.success("Mapbox token saved!");
  };

  // Handle registration
  const handleRegister = () => {
    setDrawerOpen(false);
    setRegistrationOpen(true);
  };

  // Handle add to schedule
  const handleAddToSchedule = () => {
    // TODO: Implement in Phase 3
    toast.success("Added to your schedule!");
  };

  if (!mapboxToken) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Mapbox Setup Required</h2>
          <p className="text-muted-foreground mb-6">
            To use the interactive map, you need a Mapbox public token. Get one
            for free at{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="token">Mapbox Public Token</Label>
              <Input
                id="token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="pk.eyJ1..."
                className="mt-2"
              />
            </div>
            <Button onClick={handleTokenSubmit} className="w-full">
              Save Token
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoadingEventsWithVenues) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedEvent = eventsWithVenues?.find((e) => e.id === selectedEventId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 p-4">
      {/* Filter Sidebar - Desktop */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <MapFilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          userLocation={userLocation}
          className="h-full"
        />
      </div>

      {/* Main Map Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Controls */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Event Switcher */}
            {eventsWithVenues && (
              <EventSwitcher
                events={eventsWithVenues}
                selectedEventId={selectedEventId}
                onEventSelect={setSelectedEventId}
              />
            )}

            {/* Search & Booth Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search booths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  disabled={!selectedEventId || !showBoothLayer}
                />
              </div>

              {selectedEventId && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
                  <Switch
                    id="booth-layer"
                    checked={showBoothLayer}
                    onCheckedChange={setShowBoothLayer}
                  />
                  <Label htmlFor="booth-layer" className="cursor-pointer">
                    {showBoothLayer ? (
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Hide Booths
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4" />
                        Show Booths
                      </span>
                    )}
                  </Label>
                </div>
              )}
            </div>

            {/* Booth Loading State */}
            {showBoothLayer && isLoadingBooths && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading booths...
              </div>
            )}
          </div>
        </Card>

        {/* Map Container */}
        <Card className="flex-1 relative overflow-hidden">
          <div id="map-container" className="absolute inset-0" />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </Card>
      </div>

      {/* Drawers */}
      <MapCardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        content={drawerContent}
        onRegister={
          drawerContent?.type === "event" ? handleRegister : undefined
        }
        onAddToSchedule={handleAddToSchedule}
      />

      {selectedEvent && (
        <RegistrationDrawer
          open={registrationOpen}
          onClose={() => setRegistrationOpen(false)}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
        />
      )}
    </div>
  );
};
