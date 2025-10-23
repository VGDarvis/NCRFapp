import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapTab } from "./MapTab";
import { FloorPlanTabWrapper } from "./FloorPlanTabWrapper";
import { MapPin, Grid3x3 } from "lucide-react";

export const ExploreTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Map</span>
          </TabsTrigger>
          <TabsTrigger value="floor-plan" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <span>Floor Plan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-0">
          <MapTab />
        </TabsContent>

        <TabsContent value="floor-plan" className="mt-0">
          <FloorPlanTabWrapper />
        </TabsContent>
      </Tabs>
    </div>
  );
};
