import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import type { Booth } from "@/hooks/useBooths";
import { useAvailableBoothNumbers, useOrganizationOptions } from "@/hooks/useBoothPresets";
import { useBooths } from "@/hooks/useBooths";

interface BoothEditDialogProps {
  booth: Booth;
  open: boolean;
  onClose: () => void;
  onBoothUpdated: () => void;
}

export function BoothEditDialog({ booth, open, onClose, onBoothUpdated }: BoothEditDialogProps) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    table_no: booth.table_no || "",
    org_name: booth.org_name || "",
    description: booth.description || "",
    notes: booth.notes || "",
    sponsor_tier: booth.sponsor_tier || "standard",
    x_position: booth.x_position?.toString() || "",
    y_position: booth.y_position?.toString() || "",
    booth_width: booth.booth_width?.toString() || "60",
    booth_depth: booth.booth_depth?.toString() || "60",
  });

  const { boothNumbers, isLoading: boothNumbersLoading } = useAvailableBoothNumbers(booth.event_id);
  const { organizations, isLoading: orgsLoading } = useOrganizationOptions(booth.event_id);
  const { data: existingBooths } = useBooths(booth.event_id);

  // Get assigned booth numbers (excluding current booth)
  const assignedBoothNumbers = new Set(
    existingBooths?.filter(b => b.id !== booth.id).map(b => b.table_no) || []
  );

  // Update form when booth changes
  useEffect(() => {
    setFormData({
      table_no: booth.table_no || "",
      org_name: booth.org_name || "",
      description: booth.description || "",
      notes: booth.notes || "",
      sponsor_tier: booth.sponsor_tier || "standard",
      x_position: booth.x_position?.toString() || "",
      y_position: booth.y_position?.toString() || "",
      booth_width: booth.booth_width?.toString() || "60",
      booth_depth: booth.booth_depth?.toString() || "60",
    });
  }, [booth]);

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
          x_position: formData.x_position ? parseFloat(formData.x_position) : null,
          y_position: formData.y_position ? parseFloat(formData.y_position) : null,
          booth_width: formData.booth_width ? parseFloat(formData.booth_width) : 60,
          booth_depth: formData.booth_depth ? parseFloat(formData.booth_depth) : 60,
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("id", booth.id);

      if (error) throw error;

      toast.success(`Booth #${booth.table_no} deleted successfully`);
      setShowDeleteConfirm(false);
      onClose();
      onBoothUpdated();
    } catch (error) {
      console.error("Error deleting booth:", error);
      toast.error("Failed to delete booth");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booth</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Booth #{booth.table_no} ({booth.org_name})? 
              This action cannot be undone and will remove the booth from all views.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booth #{booth.table_no || "Unknown"}</DialogTitle>
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
                    const isCurrent = boothNum === booth.table_no;
                    return (
                      <SelectItem 
                        key={boothNum} 
                        value={boothNum}
                        disabled={isAssigned && !isCurrent}
                      >
                        {boothNum} {isAssigned && !isCurrent && "• Already Assigned"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
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

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-3">Floor Plan Position (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="x_position">X Position</Label>
                <Input
                  id="x_position"
                  type="number"
                  value={formData.x_position}
                  onChange={(e) => setFormData({ ...formData, x_position: e.target.value })}
                  placeholder="e.g. 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="y_position">Y Position</Label>
                <Input
                  id="y_position"
                  type="number"
                  value={formData.y_position}
                  onChange={(e) => setFormData({ ...formData, y_position: e.target.value })}
                  placeholder="e.g. 200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booth_width">Width</Label>
                <Input
                  id="booth_width"
                  type="number"
                  value={formData.booth_width}
                  onChange={(e) => setFormData({ ...formData, booth_width: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booth_depth">Depth</Label>
                <Input
                  id="booth_depth"
                  type="number"
                  value={formData.booth_depth}
                  onChange={(e) => setFormData({ ...formData, booth_depth: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Leave positions empty to remove booth from floor plan view
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)} 
              disabled={saving || deleting}
              className="sm:mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Booth
            </Button>
            <div className="flex gap-2 sm:ml-auto">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving || deleting}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || deleting}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
