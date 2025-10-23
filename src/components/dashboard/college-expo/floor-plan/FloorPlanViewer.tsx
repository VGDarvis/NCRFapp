import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Booth } from "@/hooks/useBooths";
import { FloorPlan } from "@/hooks/useFloorPlans";
import { Badge } from "@/components/ui/badge";

interface FloorPlanViewerProps {
  floorPlan: FloorPlan;
  booths: Booth[];
  onBoothClick: (boothId: string) => void;
  highlightedBoothIds?: string[];
}

export const FloorPlanViewer = ({
  floorPlan,
  booths,
  onBoothClick,
  highlightedBoothIds = [],
}: FloorPlanViewerProps) => {
  const boothsWithCoordinates = booths.filter(
    booth => booth.latitude !== null && booth.longitude !== null
  );

  return (
    <Card className="p-4 bg-card">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {floorPlan.floor_name || `Floor ${floorPlan.floor_number}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {boothsWithCoordinates.length} booths on this floor
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => zoomIn()}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => zoomOut()}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => resetTransform()}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 800"
                  className="w-full h-full"
                  style={{ background: floorPlan.image_url ? `url(${floorPlan.image_url})` : undefined }}
                >
                  {/* Grid lines for reference */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path
                        d="M 50 0 L 0 0 0 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        opacity="0.1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Render booths */}
                  {boothsWithCoordinates.map((booth) => {
                    const isHighlighted = highlightedBoothIds.includes(booth.id);
                    const x = ((booth.longitude || 0) + 180) * (1000 / 360);
                    const y = (90 - (booth.latitude || 0)) * (800 / 180);

                    return (
                      <g
                        key={booth.id}
                        onClick={() => onBoothClick(booth.id)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        {/* Booth rectangle */}
                        <rect
                          x={x - 15}
                          y={y - 15}
                          width="30"
                          height="30"
                          fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          rx="4"
                          className="transition-colors"
                        />
                        
                        {/* Booth number badge */}
                        {booth.table_no && (
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs font-bold fill-primary-foreground pointer-events-none"
                          >
                            {booth.table_no}
                          </text>
                        )}

                        {/* Favorite star indicator */}
                        {isHighlighted && (
                          <circle
                            cx={x + 12}
                            cy={y - 12}
                            r="6"
                            fill="hsl(var(--warning))"
                            stroke="white"
                            strokeWidth="1"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </TransformComponent>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary border border-border rounded" />
                <span className="text-sm text-muted-foreground">Regular Booth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary border border-border rounded" />
                <span className="text-sm text-muted-foreground">Favorite</span>
              </div>
            </div>
          </>
        )}
      </TransformWrapper>
    </Card>
  );
};
