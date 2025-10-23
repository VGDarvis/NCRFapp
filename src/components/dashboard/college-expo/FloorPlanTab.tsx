import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, MapPin, Grid3x3, List, Filter } from "lucide-react";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useBooths } from "@/hooks/useBooths";
import { useBoothFavorites } from "@/hooks/useBoothFavorites";
import { useBoothCheckIns } from "@/hooks/useBoothCheckIns";
import { FloorPlanViewer } from "./floor-plan/FloorPlanViewer";
import { BoothList } from "./floor-plan/BoothList";
import { BoothDetailDrawer } from "./floor-plan/BoothDetailDrawer";
import { MyFavoritesPanel } from "./floor-plan/MyFavoritesPanel";

interface FloorPlanTabProps {
  eventId: string;
  venueId: string | null;
}

export const FloorPlanTab = ({ eventId, venueId }: FloorPlanTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { data: floorPlans, isLoading: isLoadingFloors } = useFloorPlans(venueId);
  const { data: booths, isLoading: isLoadingBooths } = useBooths(eventId);
  const { favorites, isFavorite, addFavorite, removeFavorite } = useBoothFavorites(eventId);
  const { hasVisitedBooth, createCheckIn } = useBoothCheckIns(eventId);

  const selectedFloorPlan = floorPlans?.[0]; // Default to first floor

  const filteredBooths = booths?.filter(booth => {
    const matchesSearch = !searchQuery || 
      booth.org_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFavorites = !showOnlyFavorites || isFavorite(booth.id);
    
    return matchesSearch && matchesFavorites;
  }) || [];

  const selectedBooth = booths?.find(b => b.id === selectedBoothId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expo Floor Plan</h1>
        <p className="text-muted-foreground">
          Browse booths, find colleges, and plan your route
        </p>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <TabsList>
            <TabsTrigger value="map" className="gap-2">
              <Grid3x3 className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-1 max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search colleges, majors, programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showOnlyFavorites ? "default" : "outline"}
              size="icon"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            >
              <Star className={showOnlyFavorites ? "fill-current" : ""} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TabsContent value="map" className="mt-0">
              {selectedFloorPlan ? (
                <FloorPlanViewer
                  floorPlan={selectedFloorPlan}
                  booths={filteredBooths}
                  onBoothClick={setSelectedBoothId}
                  highlightedBoothIds={favorites?.map(f => f.booth_id) || []}
                />
              ) : (
                <Card className="p-12 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Floor Plan Available</h3>
                  <p className="text-muted-foreground">
                    Floor plan data is not yet available for this event.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <BoothList
                booths={filteredBooths}
                onBoothClick={setSelectedBoothId}
                favorites={favorites || []}
                onToggleFavorite={(boothId) => {
                  if (isFavorite(boothId)) {
                    removeFavorite.mutate({ boothId, eventId });
                  } else {
                    addFavorite.mutate({ boothId, eventId });
                  }
                }}
              />
            </TabsContent>
          </div>

          <div className="lg:col-span-1">
            <MyFavoritesPanel
              eventId={eventId}
              favorites={favorites || []}
              booths={booths || []}
              onBoothClick={setSelectedBoothId}
              onRemoveFavorite={(boothId) => removeFavorite.mutate({ boothId, eventId })}
            />
          </div>
        </div>
      </Tabs>

      {selectedBooth && (
        <BoothDetailDrawer
          booth={selectedBooth}
          open={!!selectedBoothId}
          onClose={() => setSelectedBoothId(null)}
          isFavorite={isFavorite(selectedBooth.id)}
          hasVisited={hasVisitedBooth(selectedBooth.id)}
          onToggleFavorite={() => {
            if (isFavorite(selectedBooth.id)) {
              removeFavorite.mutate({ boothId: selectedBooth.id, eventId });
            } else {
              addFavorite.mutate({ boothId: selectedBooth.id, eventId });
            }
          }}
          onCheckIn={() => createCheckIn.mutate({ boothId: selectedBooth.id, eventId })}
        />
      )}
    </div>
  );
};
