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
    org_type: "college",
    description: "",
    sponsor_tier: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website_url: "",
  });

  useEffect(() => {
    if (selectedBooth?.boothData) {
      setFormData({
        table_no: selectedBooth.boothData.table_no || "",
        org_name: selectedBooth.boothData.org_name || "",
        org_type: selectedBooth.boothData.org_type || "college",
        description: selectedBooth.boothData.description || "",
        sponsor_tier: selectedBooth.boothData.sponsor_tier || "",
        contact_name: selectedBooth.boothData.contact_name || "",
        contact_email: selectedBooth.boothData.contact_email || "",
        contact_phone: selectedBooth.boothData.contact_phone || "",
        website_url: selectedBooth.boothData.website_url || "",
      });
    }
  }, [selectedBooth]);

  const handleSave = async () => {
    if (!selectedBooth) return;

    setLoading(true);
    try {
      if (selectedBooth.boothData?.id) {
        // Update existing booth
        const { error } = await supabase
          .from("booths")
          .update(formData)
          .eq("id", selectedBooth.boothData.id);

        if (error) throw error;
      } else {
        // Create new booth
        const { error } = await supabase
          .from("booths")
          .insert({
            ...formData,
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
            Select a booth to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booth Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="table_no">Booth Number</Label>
          <Input
            id="table_no"
            value={formData.table_no}
            onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
            placeholder="e.g., 100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org_name">Organization Name</Label>
          <Input
            id="org_name"
            value={formData.org_name}
            onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
            placeholder="College or Organization"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org_type">Organization Type</Label>
          <Select value={formData.org_type} onValueChange={(value) => setFormData({ ...formData, org_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="college">College/University</SelectItem>
              <SelectItem value="hbcu">HBCU</SelectItem>
              <SelectItem value="military">Military</SelectItem>
              <SelectItem value="trade_school">Trade School</SelectItem>
              <SelectItem value="sponsor">Sponsor</SelectItem>
              <SelectItem value="nonprofit">Nonprofit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sponsor_tier">Sponsor Tier</Label>
          <Select value={formData.sponsor_tier} onValueChange={(value) => setFormData({ ...formData, sponsor_tier: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Contact person"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="(123) 456-7890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Booth
        </Button>
      </CardContent>
    </Card>
  );
};
