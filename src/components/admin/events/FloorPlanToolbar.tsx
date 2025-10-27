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
    <Card className="p-2 flex items-center gap-2">
      <div className="flex gap-1">
        <Button
          variant={activeTool === "select" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToolChange("select")}
        >
          <MousePointer className="w-4 h-4 mr-2" />
          Select
        </Button>
        <Button
          variant={activeTool === "draw" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToolChange("draw")}
        >
          <Square className="w-4 h-4 mr-2" />
          Draw
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="sm" onClick={onAddBooth}>
        <Plus className="w-4 h-4 mr-2" />
        Add Booth
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDeleteBooth}
        disabled={!hasSelectedBooth}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>

      <Separator orientation="vertical" className="h-8" />

      <div className="text-sm text-muted-foreground">
        {hasSelectedBooth ? "Booth selected" : "No booth selected"}
      </div>
    </Card>
  );
};
