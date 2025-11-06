import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BoothGridSelector } from "./BoothGridSelector";
import { GridPosition, gridToCoordinates } from "@/hooks/useGridPositioning";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkMoveDialogProps {
  open: boolean;
  onClose: () => void;
  boothIds: string[];
  occupiedPositions: GridPosition[];
  booths?: any[];
  onSuccess: () => void;
}

export function BulkMoveDialog({
  open,
  onClose,
  boothIds,
  occupiedPositions,
  booths = [],
  onSuccess,
}: BulkMoveDialogProps) {
  const [startPosition, setStartPosition] = useState<GridPosition | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!startPosition) {
      toast.error("Please select a start position");
      return;
    }

    setSaving(true);
    try {
      // Position booths in a row starting from selected cell
      for (let i = 0; i < boothIds.length; i++) {
        const gridPos = {
          row: startPosition.row,
          col: (startPosition.col + i) % 12,
        };
        const coords = gridToCoordinates(gridPos);

        const { error } = await supabase
          .from("booths")
          .update({
            grid_row: gridPos.row,
            grid_col: gridPos.col,
            x_position: coords.x,
            y_position: coords.y,
            booth_width: 80,
            booth_depth: 80,
          })
          .eq("id", boothIds[i]);

        if (error) throw error;
      }

      toast.success(`Moved ${boothIds.length} booths successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Failed to move booths", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Move {boothIds.length} Booths</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a starting position. Booths will be arranged in a row from this cell.
          </p>

          <BoothGridSelector
            selectedPosition={startPosition}
            occupiedPositions={occupiedPositions.filter(
              (pos) => !boothIds.some((id) => id === (pos as any).boothId)
            )}
            onSelectPosition={setStartPosition}
            booths={booths}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!startPosition || saving}>
            {saving ? "Moving..." : "Move Booths"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
