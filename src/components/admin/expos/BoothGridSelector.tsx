import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  GRID_COLS,
  GRID_ROWS,
  GridPosition,
  getGridLabel,
  getPresetPosition,
} from "@/hooks/useGridPositioning";
import { Zone } from "@/hooks/useZones";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { cn } from "@/lib/utils";

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
  
  // Responsive cell size
  const cellSize = isMobile ? 40 : 50;
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

  const handlePresetClick = (preset: string) => {
    const position = getPresetPosition(preset);
    if (!isCellOccupied(position.row, position.col)) {
      onSelectPosition(position);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Quick Position Presets</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("top-left")}
            className="text-xs"
          >
            ⬉ Top-Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("top-center")}
            className="text-xs"
          >
            ⬆ Top-Center
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("top-right")}
            className="text-xs"
          >
            ⬈ Top-Right
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("middle-left")}
            className="text-xs"
          >
            ⬅ Middle-Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("center")}
            className="text-xs"
          >
            ● Center
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("middle-right")}
            className="text-xs"
          >
            ➡ Middle-Right
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("bottom-left")}
            className="text-xs"
          >
            ⬋ Bottom-Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("bottom-center")}
            className="text-xs"
          >
            ⬇ Bottom-Center
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick("bottom-right")}
            className="text-xs"
          >
            ⬊ Bottom-Right
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Grid Position Selector</h3>
          {selectedPosition && (
            <Badge variant="secondary">
              {getGridLabel(selectedPosition)}
            </Badge>
          )}
        </div>

        <div className="relative w-full overflow-x-auto pb-6">
          <div
            className="relative mx-auto"
            style={{
              width: `${gridWidth}px`,
              height: `${gridHeight}px`,
              minWidth: "320px",
            }}
          >
            {/* Background image if available */}
            {backgroundImageUrl && (
              <img
                src={backgroundImageUrl}
                alt="Floor plan background"
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
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
                  backgroundColor: `${zone.color}15`,
                }}
              >
                <span
                  className="absolute top-1 left-1 text-xs font-semibold px-1 rounded"
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
            <div className="absolute -top-6 left-0 w-full flex justify-around text-xs text-muted-foreground">
              {Array.from({ length: GRID_COLS }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          </div>
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
