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
  
  // Responsive cell size - larger on mobile for better touch targets
  const cellSize = isMobile ? 56 : 50;
  const gridWidth = GRID_COLS * cellSize;
  const gridHeight = GRID_ROWS * cellSize;

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

        <ScrollArea 
          className="relative w-full pb-6 border rounded-lg" 
          style={{ 
            height: `min(${gridHeight + 140}px, 80vh)`,
            minHeight: "500px",
          }}
        >
          <div className="flex items-center justify-center w-full h-full min-h-[500px] p-8">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit={true}
              centerZoomedOut={true}
              wheel={{ disabled: !isMobile }}
              onZoom={(ref) => setZoom(ref.state.scale)}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {isMobile && (
                    <GridZoomControls
                      onZoomIn={() => zoomIn()}
                      onZoomOut={() => zoomOut()}
                      onResetZoom={() => resetTransform()}
                    />
                  )}
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="relative"
                      style={{
                        width: `${gridWidth}px`,
                        height: `${gridHeight}px`,
                        minWidth: "320px",
                        margin: "0 auto",
                      }}
                    >
                    {/* Background image with controlled opacity */}
                    {backgroundImageUrl && (
                      <div 
                        className="absolute inset-0 pointer-events-none rounded"
                        style={{
                          backgroundImage: `url(${backgroundImageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          opacity: 0.3,
                        }}
                      />
                    )}

            {/* Zone overlays */}
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="absolute border-2 pointer-events-none rounded"
                style={{
                  left: `${zone.startCol * cellSize}px`,
                  top: `${zone.startRow * cellSize}px`,
                  width: `${zone.cols * cellSize}px`,
                  height: `${zone.rows * cellSize}px`,
                  borderColor: zone.color,
                  backgroundColor: `${zone.color}25`,
                  borderWidth: isMobile ? "3px" : "2px",
                }}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 font-semibold px-1 rounded shadow-sm",
                    isMobile ? "text-sm" : "text-xs"
                  )}
                  style={{
                    backgroundColor: zone.color,
                    color: 'white',
                  }}
                >
                  {zone.name}
                </span>
              </div>
            ))}

            {/* Grid cells */}
            <div 
              className="relative grid" 
              style={{ 
                gridTemplateColumns: `repeat(${GRID_COLS}, ${cellSize}px)`,
                opacity: gridOpacity,
              }}
            >
              {Array.from({ length: GRID_ROWS }).map((_, row) =>
                Array.from({ length: GRID_COLS }).map((_, col) => {
                  const occupied = isCellOccupied(row, col);
                  const selected = isCellSelected(row, col);
                  const hovered = hoveredCell?.row === row && hoveredCell?.col === col;
                  const boothNumber = getBoothNumber(row, col);
                  const boothInfo = getBoothInfo(row, col);

                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => handleCellClick(row, col)}
                      onMouseEnter={() => setHoveredCell({ row, col })}
                      onMouseLeave={() => setHoveredCell(null)}
                      disabled={occupied}
                      title={boothInfo ? `Booth #${boothInfo.table_no} - ${boothInfo.org_name || 'No org'}` : undefined}
                      className={cn(
                        `w-[${cellSize}px] h-[${cellSize}px] border transition-all touch-manipulation flex flex-col items-center justify-center gap-0.5`,
                        "hover:scale-105 active:scale-95",
                        occupied && "bg-destructive/20 border-destructive cursor-not-allowed",
                        !occupied && "bg-background border-border hover:bg-accent",
                        selected && "bg-primary border-primary ring-2 ring-primary",
                        hovered && !occupied && !selected && "bg-secondary border-secondary"
                      )}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        minWidth: "44px",
                        minHeight: "44px",
                      }}
                    >
                      {boothNumber && (
                        <span className={cn(
                          "font-bold leading-none",
                          isMobile ? "text-[8px]" : "text-[10px]"
                        )}>
                          {boothNumber.length > 4 ? `${boothNumber.slice(0, 3)}...` : boothNumber}
                        </span>
                      )}
                      <div className="flex items-center justify-center">
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-green-500" title="Selected" />
                        )}
                        {occupied && !selected && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title="Occupied" />
                        )}
                        {!occupied && !selected && (
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" title="Available" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Grid labels */}
            <div className="absolute -left-6 top-0 h-full flex flex-col justify-around text-xs text-muted-foreground">
              {Array.from({ length: GRID_ROWS }).map((_, i) => (
                <div key={i}>{String.fromCharCode(65 + i)}</div>
              ))}
             </div>
                     </div>
                   </TransformComponent>
                 </>
               )}
             </TransformWrapper>
           </div>
         </ScrollArea>

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
