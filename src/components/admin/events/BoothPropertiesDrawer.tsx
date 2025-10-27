import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2, Building2, Mail, Phone, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BoothObject } from "@/hooks/useFloorPlanEditor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [contactOpen, setContactOpen] = useState(false);
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
        const { error } = await supabase
          .from("booths")
          .update(formData)
          .eq("id", selectedBooth.boothData.id);

        if (error) throw error;
      } else {
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
          <SheetTitle>Booth Properties</SheetTitle>
          <SheetDescription>
            Edit booth details and contact information
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="table_no" className="text-base font-semibold">Booth Number</Label>
            <Input
              id="table_no"
              value={formData.table_no}
              onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
              placeholder="e.g., 100"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_name" className="text-base font-semibold">Organization Name</Label>
            <Input
              id="org_name"
              value={formData.org_name}
              onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
              placeholder="College or Organization"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_type" className="text-base font-semibold">Organization Type</Label>
            <Select value={formData.org_type} onValueChange={(value) => setFormData({ ...formData, org_type: value })}>
              <SelectTrigger className="h-12 text-base">
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
            <Label htmlFor="sponsor_tier" className="text-base font-semibold">Sponsor Tier</Label>
            <Select value={formData.sponsor_tier} onValueChange={(value) => setFormData({ ...formData, sponsor_tier: value })}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
              rows={3}
              className="text-base"
            />
          </div>

          <Collapsible open={contactOpen} onOpenChange={setContactOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full h-12 text-base">
                <Building2 className="w-4 h-4 mr-2" />
                Contact Information {contactOpen ? "▲" : "▼"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Contact person"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="email@example.com"
                    className="h-12 text-base pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="(123) 456-7890"
                    className="h-12 text-base pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                    className="h-12 text-base pl-10"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={handleSave} disabled={loading} className="w-full h-12 text-base">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Booth
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
