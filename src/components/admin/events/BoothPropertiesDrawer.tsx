import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BoothObject } from "@/hooks/useFloorPlanEditor";

interface BoothPropertiesDrawerProps {
  selectedBooth: BoothObject | null;
  eventId: string;
  onBoothUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BoothPropertiesDrawer = ({ 
  selectedBooth, 
  eventId, 
  onBoothUpdated, 
  open, 
  onOpenChange 
}: BoothPropertiesDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    table_no: "",
    org_name: "",
    sponsor_tier: "",
    description: "",
    stage_description: "",
  });

  useEffect(() => {
    if (selectedBooth) {
      setFormData({
        table_no: selectedBooth.boothData?.table_no || "",
        org_name: selectedBooth.boothData?.org_name || "",
        sponsor_tier: selectedBooth.boothData?.sponsor_tier || "",
        description: selectedBooth.boothData?.description || "",
        stage_description: selectedBooth.boothData?.stage_description || "",
      });
    }
  }, [selectedBooth]);

  const handleSave = async () => {
    if (!selectedBooth) return;

    setLoading(true);
    try {
      const updateData = {
        table_no: formData.table_no,
        org_name: formData.org_name,
        sponsor_tier: formData.sponsor_tier || null,
        description: formData.description || null,
        stage_description: formData.stage_description || null,
      };

      if (selectedBooth.boothData?.id) {
        const { error } = await supabase
          .from("booths")
          .update(updateData)
          .eq("id", selectedBooth.boothData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("booths")
          .insert({
            ...updateData,
            event_id: eventId,
            x_position: selectedBooth.rect.left,
            y_position: selectedBooth.rect.top,
            booth_width: selectedBooth.rect.width,
            booth_depth: selectedBooth.rect.height,
          });

        if (error) throw error;
      }

      toast.success("Booth updated successfully");
      onBoothUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating booth:", error);
      toast.error("Failed to update booth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Edit Booth</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="table-no" className="text-base font-medium">Booth Number</Label>
            <Input
              id="table-no"
              value={formData.table_no}
              onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
              placeholder="e.g., 101"
              className="h-14 text-lg"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-base font-medium">Booth Title</Label>
            <Input
              id="org-name"
              value={formData.org_name}
              onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
              placeholder="Organization name"
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Special offers like:
- Accepting applications on the spot
- Application fee waived
- Free admission
- Scholarship information"
              className="min-h-[160px] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description" className="text-base font-medium">Stage/Special Notes</Label>
            <Textarea
              id="stage-description"
              value={formData.stage_description}
              onChange={(e) => setFormData({ ...formData, stage_description: e.target.value })}
              placeholder="e.g., Seminar at 2pm in Room A"
              className="min-h-[100px] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-tier" className="text-base font-medium">Sponsorship Level</Label>
            <Select
              value={formData.sponsor_tier}
              onValueChange={(value) => setFormData({ ...formData, sponsor_tier: value })}
            >
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
                <SelectItem value="">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-14 text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !formData.org_name}
            className="flex-1 h-14 text-lg"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};