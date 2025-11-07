import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GRID_COLS,
  GRID_ROWS,
  CELL_SIZE,
  GridPosition,
  getGridLabel,
} from "@/hooks/useGridPositioning";
import { Zone } from "@/hooks/useZones";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { cn } from "@/lib/utils";
import { GridZoomControls } from "./GridZoomControls";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface BoothGridSelectorProps {
  selectedPosition: GridPosition | null;
  occupiedPositions: GridPosition[];
  onSelectPosition: (position: GridPosition) => void;
  backgroundImageUrl?: string;
  zones?: Zone[];
  gridOpacity?: number;
  onGridOpacityChange?: (opacity: number) => void;
  booths?: any[];
}

export const BoothGridSelector = ({
  selectedPosition,
  occupiedPositions,
  onSelectPosition,
  backgroundImageUrl,
  zones = [],
  gridOpacity = 0.6,
  onGridOpacityChange,
  booths = [],
}: BoothGridSelectorProps) => {
  const [hoveredCell, setHoveredCell] = useState<GridPosition | null>(null);
  const { isMobile } = useMobileDetection();
  const [zoom, setZoom] = useState(1);
  
  // Use standard cell size to match 1200x800 floor plan
  const cellSize = CELL_SIZE;

  // Helper to get booth info for a grid position
  const getBoothInfo = (row: number, col: number) => {
    return booths.find((b: any) => b.grid_row === row && b.grid_col === col);
  };

  const getBoothNumber = (row: number, col: number) => {
    const booth = getBoothInfo(row, col);
    return booth?.table_no || null;
  };

  const isCellOccupied = (row: number, col: number) => {
    return occupiedPositions.some((pos) => pos.row === row && pos.col === col);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isCellOccupied(row, col)) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onSelectPosition({ row, col });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Grid Position Selector</h3>
          {selectedPosition && (
            <Badge variant="secondary">
              {getGridLabel(selectedPosition)}
            </Badge>
          )}
        </div>

        <div 
          className="relative bg-muted/20 rounded-lg overflow-hidden mx-auto" 
          style={{ 
            width: "100%",
            maxWidth: "1200px",
            aspectRatio: "1200/800",
            height: isMobile ? "auto" : "700px",
          }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.3}
            maxScale={3}
            centerOnInit
            onZoom={(ref) => setZoom(ref.state.scale)}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <GridZoomControls
                  onZoomIn={() => zoomIn()}
                  onZoomOut={() => zoomOut()}
                  onResetZoom={() => resetTransform()}
                />
                <div className="fixed bottom-32 right-4 z-20 md:hidden">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {Math.round(zoom * 100)}%
                  </Badge>
                </div>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  {/* Background image */}
                  {backgroundImageUrl && (
                    <img
                      src={backgroundImageUrl}
                      alt="Floor plan"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      style={{ opacity: 0.3 }}
                    />
                  )}

                  {/* SVG Grid with proper viewBox */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 800"
                    className="absolute inset-0"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Render zones as SVG rects */}
                    {zones.map((zone) => (
                      <g key={zone.id}>
                        <rect
                          x={zone.startCol * cellSize}
                          y={zone.startRow * cellSize}
                          width={zone.cols * cellSize}
                          height={zone.rows * cellSize}
                          fill={`${zone.color}25`}
                          stroke={zone.color}
                          strokeWidth="2"
                          rx="4"
                        />
                        <text
                          x={zone.startCol * cellSize + 5}
                          y={zone.startRow * cellSize + 20}
                          fill={zone.color}
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {zone.name}
                        </text>
                      </g>
                    ))}

                    {/* Render grid cells as SVG */}
                    {Array.from({ length: GRID_ROWS }).map((_, row) =>
                      Array.from({ length: GRID_COLS }).map((_, col) => {
                        const occupied = isCellOccupied(row, col);
                        const selected = isCellSelected(row, col);
                        const boothNumber = getBoothNumber(row, col);
                        const x = col * cellSize;
                        const y = row * cellSize;

                        return (
                          <g
                            key={`${row}-${col}`}
                            onClick={() => handleCellClick(row, col)}
                            className={cn(
                              "cursor-pointer transition-all",
                              !occupied && "hover:opacity-80"
                            )}
                            style={{ pointerEvents: occupied ? "none" : "auto" }}
                          >
                            <rect
                              x={x}
                              y={y}
                              width={cellSize}
                              height={cellSize}
                              fill={
                                occupied
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : selected
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--background))"
                              }
                              stroke={
                                occupied
                                  ? "rgb(239, 68, 68)"
                                  : selected
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--border))"
                              }
                              strokeWidth="1"
                              rx="2"
                              opacity={gridOpacity}
                            />
                            {boothNumber && (
                              <text
                                x={x + cellSize / 2}
                                y={y + cellSize / 2 - 5}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="currentColor"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {boothNumber}
                              </text>
                            )}
                            {/* Status indicator */}
                            <circle
                              cx={x + cellSize / 2}
                              cy={y + cellSize / 2 + 10}
                              r="3"
                              fill={
                                selected
                                  ? "rgb(34, 197, 94)"
                                  : occupied
                                  ? "rgb(239, 68, 68)"
                                  : "rgba(0,0,0,0.2)"
                              }
                            />
                          </g>
                        );
                      })
                    )}

                    {/* Row labels */}
                    {Array.from({ length: GRID_ROWS }).map((_, i) => (
                      <text
                        key={`row-${i}`}
                        x="-15"
                        y={i * cellSize + cellSize / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="currentColor"
                        fontSize="12"
                      >
                        {String.fromCharCode(65 + i)}
                      </text>
                    ))}
                  </svg>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

         <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-background border border-border rounded" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive/20 border border-destructive rounded" />
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary border border-primary rounded" />
            <span className="text-muted-foreground">Selected</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
