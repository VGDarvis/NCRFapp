import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAvailableBoothNumbers, useOrganizationOptions } from "@/hooks/useBoothPresets";
import { useBooths } from "@/hooks/useBooths";
import { findNextAvailableCell, gridToCoordinates, getGridLabel, GridPosition } from "@/hooks/useGridPositioning";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [isCreatingNewOrg, setIsCreatingNewOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [boothInputMode, setBoothInputMode] = useState<"select" | "custom">("select");
  const [formData, setFormData] = useState({
    table_no: "",
    org_name: "",
    description: "",
    offers_on_spot_admission: false,
    scholarship_info: false,
    waives_application_fee: false,
  });
  const [showAllBooths, setShowAllBooths] = useState(false);

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
        offers_on_spot_admission: false,
        scholarship_info: false,
        waives_application_fee: false,
      });
      setIsCreatingNewOrg(false);
      setNewOrgName("");
      setShowAllBooths(false);
      setBoothInputMode("select");
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
        offers_on_spot_admission: formData.offers_on_spot_admission,
        scholarship_info: formData.scholarship_info ? "Available" : null,
        waives_application_fee: formData.waives_application_fee,
        grid_row: nextCell.row,
        grid_col: nextCell.col,
        x_position: coords.x,
        y_position: coords.y,
        booth_width: 30,
        booth_depth: 30,
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

      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });

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
          <div className="space-y-3">
            <Label htmlFor="table_no">Booth Number *</Label>
            
            <RadioGroup value={boothInputMode} onValueChange={(value: "select" | "custom") => setBoothInputMode(value)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="mode-select" />
                <Label htmlFor="mode-select" className="font-normal cursor-pointer">Select from available booths</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="mode-custom" />
                <Label htmlFor="mode-custom" className="font-normal cursor-pointer">Enter custom booth number</Label>
              </div>
            </RadioGroup>

            {boothInputMode === "custom" ? (
              <>
                <Input
                  id="table_no"
                  value={formData.table_no}
                  onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
                  placeholder="Enter booth number (e.g., 1, 38-39, A1)"
                  required
                  className="min-h-[48px]"
                />
                {formData.table_no && assignedBoothNumbers.has(formData.table_no) && (
                  <p className="text-sm text-amber-600 dark:text-amber-500">
                    ⚠️ Booth #{formData.table_no} is already assigned
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter any booth number (0-1000 or custom format like "38-39")
                </p>
              </>
            ) : boothNumbersLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading booth numbers...
              </div>
            ) : (
              <>
                <Select
                  value={formData.table_no}
                  onValueChange={(value) => setFormData({ ...formData, table_no: value })}
                  required
                >
                  <SelectTrigger id="table_no" className="min-h-[48px]">
                    <SelectValue placeholder="Select booth number" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] z-[9999] bg-background" position="popper" sideOffset={5}>
                    {boothNumbers
                      .filter(boothNum => showAllBooths || !assignedBoothNumbers.has(boothNum))
                      .map((boothNum) => {
                        const isAssigned = assignedBoothNumbers.has(boothNum);
                        return (
                          <SelectItem 
                            key={boothNum} 
                            value={boothNum}
                            disabled={isAssigned}
                            className="min-h-[44px]"
                          >
                            {boothNum} {isAssigned && "• Already Assigned"}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {boothNumbers.length - assignedBoothNumbers.size} available booths
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllBooths(!showAllBooths)}
                    className="text-xs h-auto py-1"
                  >
                    {showAllBooths ? "Show Available Only" : "Show All Booths"}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name *</Label>
            {orgsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading organizations...
              </div>
            ) : isCreatingNewOrg ? (
              <div className="space-y-2">
                <Input
                  id="new_org_name"
                  value={newOrgName}
                  onChange={(e) => {
                    setNewOrgName(e.target.value);
                    setFormData({ ...formData, org_name: e.target.value });
                  }}
                  placeholder="Enter new organization name"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreatingNewOrg(false);
                    setNewOrgName("");
                    setFormData({ ...formData, org_name: "" });
                  }}
                >
                  ← Back to organization list
                </Button>
              </div>
            ) : (
              <Select
                value={formData.org_name}
                onValueChange={(value) => {
                  if (value === "CREATE_NEW") {
                    setIsCreatingNewOrg(true);
                  } else {
                    setFormData({ ...formData, org_name: value });
                  }
                }}
                required
              >
                <SelectTrigger id="org_name">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] z-[9999] bg-background" position="popper" sideOffset={5}>
                  <SelectItem value="CREATE_NEW" className="font-semibold text-primary">
                    ➕ Create New Organization...
                  </SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isCreatingNewOrg && (
              <p className="text-xs text-muted-foreground">
                {organizations.length} organizations available
              </p>
            )}
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

          <div className="space-y-3">
            <Label className="text-base font-semibold">Special Features</Label>
            <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="on_spot_admission"
                  checked={formData.offers_on_spot_admission}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, offers_on_spot_admission: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="space-y-1 flex-1">
                  <label htmlFor="on_spot_admission" className="text-sm font-medium cursor-pointer">
                    🎓 Acceptance on the Spot
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Offers immediate admission decisions to qualified students
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="scholarships"
                  checked={formData.scholarship_info}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, scholarship_info: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="space-y-1 flex-1">
                  <label htmlFor="scholarships" className="text-sm font-medium cursor-pointer">
                    💰 Scholarships on the Spot
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Provides scholarship opportunities during the event
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="fee_waivers"
                  checked={formData.waives_application_fee}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, waives_application_fee: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="space-y-1 flex-1">
                  <label htmlFor="fee_waivers" className="text-sm font-medium cursor-pointer">
                    💳 Application Fee Waivers
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Waives application fees for students who apply today
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm">
            💡 <strong>Tip:</strong> Position this booth on the floor plan using the "Floor Plan Editor" tab
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="min-h-[48px]">
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.table_no || !formData.org_name} className="min-h-[48px]">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Booth
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
