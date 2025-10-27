import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MousePointer, Square, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FloorPlanToolbarProps {
  activeTool: "select" | "draw";
  onToolChange: (tool: "select" | "draw") => void;
  onAddBooth: () => void;
  onDeleteBooth: () => void;
  hasSelectedBooth: boolean;
}

export const FloorPlanToolbar = ({
  activeTool,
  onToolChange,
  onAddBooth,
  onDeleteBooth,
  hasSelectedBooth,
}: FloorPlanToolbarProps) => {
  return (
    <Card className="p-2 flex items-center gap-2 md:gap-4">
      <div className="flex gap-1">
        <Button
          variant={activeTool === "select" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToolChange("select")}
          className="h-11 min-w-[44px]"
        >
          <MousePointer className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Select</span>
        </Button>
        <Button
          variant={activeTool === "draw" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToolChange("draw")}
          className="h-11 min-w-[44px]"
        >
          <Square className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Draw</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onAddBooth}
        className="h-11 min-w-[44px]"
      >
        <Plus className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Add Booth</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDeleteBooth}
        disabled={!hasSelectedBooth}
        className="h-11 min-w-[44px]"
      >
        <Trash2 className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Delete</span>
      </Button>

      <Separator orientation="vertical" className="h-8 hidden md:block" />

      <div className="text-sm text-muted-foreground hidden md:block">
        {hasSelectedBooth ? "Booth selected" : "No booth selected"}
      </div>
    </Card>
  );
};
