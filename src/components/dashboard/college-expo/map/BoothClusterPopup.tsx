import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BoothClusterPopupProps {
  count: number;
  onZoomIn: () => void;
}

export const BoothClusterPopup = ({
  count,
  onZoomIn,
}: BoothClusterPopupProps) => {
  return (
    <div className="p-3 min-w-[200px]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">
            {count} {count === 1 ? "Booth" : "Booths"}
          </h4>
          <p className="text-xs text-muted-foreground">
            Click to expand cluster
          </p>
        </div>
      </div>
      <Button size="sm" className="w-full" onClick={onZoomIn}>
        Zoom In
      </Button>
    </div>
  );
};
