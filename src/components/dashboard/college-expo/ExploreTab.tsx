import { FloorPlanTabWrapper } from "./FloorPlanTabWrapper";
import { Grid3x3 } from "lucide-react";

interface ExploreTabProps {
  initialBoothId?: string | null;
  onBoothNavigated?: () => void;
}

export const ExploreTab = ({ initialBoothId, onBoothNavigated }: ExploreTabProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Grid3x3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">BCE Interactive Map</h1>
        </div>
        <p className="text-muted-foreground">
          Browse exhibitor booths and plan your visit
        </p>
      </div>
      
      <FloorPlanTabWrapper initialBoothId={initialBoothId} onBoothNavigated={onBoothNavigated} />
    </div>
  );
};
