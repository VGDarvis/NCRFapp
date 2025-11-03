import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Star } from "lucide-react";
import { Booth } from "@/hooks/useBooths";
import { FloorPlan } from "@/hooks/useFloorPlans";
import { useRealtimeFloorPlan } from "@/hooks/useRealtimeFloorPlan";

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
  // Enable real-time updates
  useRealtimeFloorPlan(booths[0]?.event_id || null);
  
  const boothsWithPositions = booths.filter(
    booth => booth.x_position !== null && booth.y_position !== null
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
                  {boothsWithPositions.length} booths on this floor
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
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div 
              className="relative bg-muted rounded-lg overflow-hidden mx-auto" 
              style={{ 
                width: "100%",
                maxWidth: "1200px",
                aspectRatio: floorPlan.canvas_width && floorPlan.canvas_height 
                  ? `${floorPlan.canvas_width}/${floorPlan.canvas_height}` 
                  : "16/9",
              }}
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                {/* Background image if available */}
                {floorPlan.background_image_url && (
                  <img
                    src={floorPlan.background_image_url}
                    alt="Floor plan"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ pointerEvents: "none" }}
                  />
                )}

                {/* Render booths as interactive overlays using real coordinates */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1200 800"
                  className="absolute inset-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {boothsWithPositions.map((booth) => {
                    const isHighlighted = highlightedBoothIds.includes(booth.id);
                    const x = Number(booth.x_position || 0);
                    const y = Number(booth.y_position || 0);
                    const width = Number(booth.booth_width || 60);
                    const height = Number(booth.booth_depth || 60);

                    // Color based on sponsor tier
                    const fillColor = booth.sponsor_tier === "gold" ? "rgba(255, 215, 0, 0.6)" :
                                     booth.sponsor_tier === "silver" ? "rgba(192, 192, 192, 0.6)" :
                                     booth.sponsor_tier === "bronze" ? "rgba(205, 127, 50, 0.6)" :
                                     "rgba(59, 130, 246, 0.6)";

                    const strokeColor = booth.sponsor_tier === "gold" ? "#fbbf24" :
                                       booth.sponsor_tier === "silver" ? "#9ca3af" :
                                       booth.sponsor_tier === "bronze" ? "#cd7f32" :
                                       "#3b82f6";

                    return (
                      <g
                        key={booth.id}
                        onClick={() => onBoothClick(booth.id)}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={isHighlighted ? "rgba(234, 179, 8, 0.8)" : fillColor}
                          stroke={isHighlighted ? "#eab308" : strokeColor}
                          strokeWidth="3"
                          rx="4"
                          className="transition-all"
                        />
                        {booth.table_no && (
                          <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#1e40af"
                            fontSize="14"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {booth.table_no}
                          </text>
                        )}
                        {isHighlighted && (
                          <Star
                            x={x + width - 12}
                            y={y + 4}
                            width="16"
                            height="16"
                            fill="#eab308"
                            className="pointer-events-none"
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
