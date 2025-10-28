import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BoothObject } from "@/hooks/useFloorPlanEditor";

interface BoothPropertiesPanelProps {
  selectedBooth: BoothObject | null;
  eventId: string;
  onBoothUpdated: () => void;
}

export const BoothPropertiesPanel = ({ selectedBooth, eventId, onBoothUpdated }: BoothPropertiesPanelProps) => {
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
        // Update existing booth
        const { error } = await supabase
          .from("booths")
          .update(updateData)
          .eq("id", selectedBooth.boothData.id);

        if (error) throw error;
      } else {
        // Create new booth
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
    } catch (error) {
      console.error("Error updating booth:", error);
      toast.error("Failed to update booth");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBooth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booth Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tap a booth to edit its details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Booth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-no">Booth Number</Label>
            <Input
              id="table-no"
              value={formData.table_no}
              onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
              placeholder="e.g., 101"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-name">Booth Title</Label>
            <Input
              id="org-name"
              value={formData.org_name}
              onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
              placeholder="Organization name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Special offers like:
- Accepting applications on the spot
- Application fee waived
- Free admission"
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description">Stage/Special Notes</Label>
            <Textarea
              id="stage-description"
              value={formData.stage_description}
              onChange={(e) => setFormData({ ...formData, stage_description: e.target.value })}
              placeholder="e.g., Seminar at 2pm in Room A"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-tier">Sponsorship Level</Label>
            <Select
              value={formData.sponsor_tier}
              onValueChange={(value) => setFormData({ ...formData, sponsor_tier: value })}
            >
              <SelectTrigger>
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

          <Button
            onClick={handleSave}
            disabled={loading || !formData.org_name}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};