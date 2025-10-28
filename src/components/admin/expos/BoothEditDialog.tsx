import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Booth } from "@/hooks/useBooths";

interface BoothEditDialogProps {
  booth: Booth;
  open: boolean;
  onClose: () => void;
  onBoothUpdated: () => void;
}

export function BoothEditDialog({ booth, open, onClose, onBoothUpdated }: BoothEditDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    table_no: booth.table_no || "",
    org_name: booth.org_name || "",
    description: booth.description || "",
    notes: booth.notes || "",
    sponsor_tier: booth.sponsor_tier || "standard",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("booths")
        .update({
          table_no: formData.table_no,
          org_name: formData.org_name,
          description: formData.description,
          notes: formData.notes,
          sponsor_tier: formData.sponsor_tier,
        })
        .eq("id", booth.id);

      if (error) throw error;

      toast.success(`Booth #${booth.table_no} updated successfully`);
      onBoothUpdated();
    } catch (error) {
      console.error("Error updating booth:", error);
      toast.error("Failed to update booth");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booth #{booth.table_no || "Unknown"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table_no">Booth Number *</Label>
            <Input
              id="table_no"
              value={formData.table_no}
              onChange={(e) => setFormData({ ...formData, table_no: e.target.value })}
              placeholder="e.g., 101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name *</Label>
            <Input
              id="org_name"
              value={formData.org_name}
              onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
              placeholder="Enter organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter booth description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter special notes or stage information"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
