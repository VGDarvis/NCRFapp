import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAvailableBoothNumbers, useOrganizationOptions } from "@/hooks/useBoothPresets";
import { useBooths } from "@/hooks/useBooths";
import { findNextAvailableCell, gridToCoordinates, getGridLabel, GridPosition } from "@/hooks/useGridPositioning";

// Auto-calculate booth positions based on booth number
const calculateBoothPosition = (boothNumber: string) => {
  const num = parseInt(boothNumber);
  
  // Grid layout: 10 booths per row, 60x60 size, 20px spacing
  const boothsPerRow = 10;
  const boothWidth = 60;
  const boothDepth = 60;
  const spacing = 20;
  const startX = 100;
  const startY = 100;
  
  // Calculate index (0-based) from booth number
  const index = Math.floor((num - 100) / 2);
  const row = Math.floor(index / boothsPerRow);
  const col = index % boothsPerRow;
  
  return {
    x_position: startX + (col * (boothWidth + spacing)),
    y_position: startY + (row * (boothDepth + spacing)),
    booth_width: boothWidth,
    booth_depth: boothDepth,
  };
};

interface BoothAddDialogProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  onBoothAdded: () => void;
}

export function BoothAddDialog({ eventId, open, onClose, onBoothAdded }: BoothAddDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    table_no: "",
    org_name: "",
    description: "",
    sponsor_tier: "standard",
  });

  const { boothNumbers, isLoading: boothNumbersLoading } = useAvailableBoothNumbers(eventId);
  const { organizations, isLoading: orgsLoading } = useOrganizationOptions(eventId);
  const { data: existingBooths } = useBooths(eventId);

  // Get assigned booth numbers
  const assignedBoothNumbers = new Set(existingBooths?.map(b => b.table_no) || []);

  // Get occupied grid cells for auto-positioning
  const occupiedCells: GridPosition[] = existingBooths
    ?.filter((b: any) => b.grid_row !== null && b.grid_col !== null)
    .map((b: any) => ({ row: b.grid_row!, col: b.grid_col! })) || [];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        table_no: "",
        org_name: "",
        description: "",
        sponsor_tier: "standard",
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation 1: Check event ID
      if (!eventId) {
        toast.error("No event selected", {
          description: "Please select an event before adding booths",
        });
        setSaving(false);
        return;
      }

      // Validation 2: Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("Authentication required", {
          description: "Please log in again to add booths",
        });
        setSaving(false);
        return;
      }

      console.log("✅ Auth check passed - User ID:", user.id);
      console.log("✅ Event ID:", eventId);
      console.log("✅ Booth data:", formData);

      // Auto-assign to next available grid cell
      const nextCell = findNextAvailableCell(occupiedCells);
      if (!nextCell) {
        toast.error("No available grid positions", {
          description: "All grid cells are occupied",
        });
        setSaving(false);
        return;
      }

      const coords = gridToCoordinates(nextCell);
      
      const boothData = {
        event_id: eventId,
        table_no: formData.table_no,
        org_name: formData.org_name,
        description: formData.description || null,
        sponsor_tier: formData.sponsor_tier,
        grid_row: nextCell.row,
        grid_col: nextCell.col,
        x_position: coords.x,
        y_position: coords.y,
        booth_width: 100,
        booth_depth: 100,
      };

      console.log("📤 Inserting booth data:", boothData);

      const { data, error } = await supabase
        .from("booths")
        .insert(boothData)
        .select();

      if (error) {
        console.error("❌ Insert error:", error);
        throw error;
      }

      console.log("✅ Booth inserted successfully:", data);

      toast.success(`Booth #${formData.table_no} added successfully`, {
        description: `${formData.org_name} has been assigned to booth #${formData.table_no}`,
      });
      onBoothAdded();
      onClose();
    } catch (error: any) {
      console.error("Error adding booth:", error);
      toast.error("Failed to add booth", {
        description: error.message || error.toString() || "Unknown error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Booth</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table_no">Booth Number *</Label>
            {boothNumbersLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading booth numbers...
              </div>
            ) : (
              <Select
                value={formData.table_no}
                onValueChange={(value) => setFormData({ ...formData, table_no: value })}
                required
              >
                <SelectTrigger id="table_no">
                  <SelectValue placeholder="Select booth number" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {boothNumbers.map((boothNum) => {
                    const isAssigned = assignedBoothNumbers.has(boothNum);
                    return (
                      <SelectItem 
                        key={boothNum} 
                        value={boothNum}
                        disabled={isAssigned}
                      >
                        {boothNum} {isAssigned && "• Already Assigned"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground">
              {boothNumbers.length - assignedBoothNumbers.size} available booths
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name *</Label>
            {orgsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading organizations...
              </div>
            ) : (
              <Select
                value={formData.org_name}
                onValueChange={(value) => setFormData({ ...formData, org_name: value })}
                required
              >
                <SelectTrigger id="org_name">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {organizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground">
              {organizations.length} organizations available
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter booth description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor_tier">Sponsorship Level</Label>
            <Select
              value={formData.sponsor_tier}
              onValueChange={(value) => setFormData({ ...formData, sponsor_tier: value })}
            >
              <SelectTrigger id="sponsor_tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm">
            💡 <strong>Tip:</strong> Position this booth on the floor plan using the "Floor Plan Editor" tab
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.table_no || !formData.org_name}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Booth
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
