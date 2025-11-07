import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { type Booth } from "@/hooks/useBooths";

interface BulkDimensionsDialogProps {
  open: boolean;
  onClose: () => void;
  booths: Booth[];
  onSuccess: () => void;
}

export function BulkDimensionsDialog({
  open,
  onClose,
  booths,
  onSuccess,
}: BulkDimensionsDialogProps) {
  const [selectedBooths, setSelectedBooths] = useState<Set<string>>(new Set());
  const [width, setWidth] = useState("30");
  const [depth, setDepth] = useState("30");
  const [saving, setSaving] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBooths(new Set(booths.map(b => b.id)));
    } else {
      setSelectedBooths(new Set());
    }
  };

  const handleToggleBooth = (boothId: string) => {
    const newSelected = new Set(selectedBooths);
    if (newSelected.has(boothId)) {
      newSelected.delete(boothId);
    } else {
      newSelected.add(boothId);
    }
    setSelectedBooths(newSelected);
  };

  const handleSave = async () => {
    if (selectedBooths.size === 0) {
      toast.error("Please select at least one booth");
      return;
    }

    const widthNum = parseFloat(width);
    const depthNum = parseFloat(depth);

    if (isNaN(widthNum) || isNaN(depthNum) || widthNum <= 0 || depthNum <= 0) {
      toast.error("Please enter valid dimensions");
      return;
    }

    setSaving(true);
    try {
      const updates = Array.from(selectedBooths).map(boothId =>
        supabase
          .from("booths")
          .update({
            booth_width: widthNum,
            booth_depth: depthNum,
          })
          .eq("id", boothId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} booths`);
      }

      toast.success(`Updated dimensions for ${selectedBooths.size} booths`);
      onSuccess();
      onClose();
      setSelectedBooths(new Set());
    } catch (error: any) {
      toast.error("Failed to update booth dimensions", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const allSelected = booths.length > 0 && selectedBooths.size === booths.length;
  const someSelected = selectedBooths.size > 0 && selectedBooths.size < booths.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Update Booth Dimensions</DialogTitle>
          <DialogDescription>
            Select booths and set new dimensions for all selected booths
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dimensions Input */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min="1"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Depth</Label>
              <Input
                id="depth"
                type="number"
                min="1"
                step="0.5"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="Depth"
              />
            </div>
          </div>

          {/* Select All */}
          <div className="flex items-center space-x-2 p-3 border-b bg-muted/20">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
            />
            <Label htmlFor="select-all" className="font-medium cursor-pointer flex-1">
              Select All ({selectedBooths.size} of {booths.length} selected)
            </Label>
          </div>

          {/* Booth List */}
          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2 space-y-1">
              {booths.map((booth) => (
                <div
                  key={booth.id}
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors ${
                    selectedBooths.has(booth.id) ? "bg-muted/30" : ""
                  }`}
                >
                  <Checkbox
                    id={`booth-${booth.id}`}
                    checked={selectedBooths.has(booth.id)}
                    onCheckedChange={() => handleToggleBooth(booth.id)}
                  />
                  <Label
                    htmlFor={`booth-${booth.id}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Booth #{booth.table_no}</span>
                        <span className="text-muted-foreground ml-2">
                          {booth.org_name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {booth.booth_width} × {booth.booth_depth}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || selectedBooths.size === 0}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update {selectedBooths.size} Booth{selectedBooths.size !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
