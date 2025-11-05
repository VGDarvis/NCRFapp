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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [showAllBooths, setShowAllBooths] = useState(false);
  const [formData, setFormData] = useState({
    table_no: booth.table_no || "",
    org_name: booth.org_name || "",
    description: booth.description || "",
    offers_on_spot_admission: booth.offers_on_spot_admission || false,
    scholarship_info: !!booth.scholarship_info,
    waives_application_fee: booth.waives_application_fee || false,
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
      offers_on_spot_admission: booth.offers_on_spot_admission || false,
      scholarship_info: !!booth.scholarship_info,
      waives_application_fee: booth.waives_application_fee || false,
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
          offers_on_spot_admission: formData.offers_on_spot_admission,
          scholarship_info: formData.scholarship_info ? "Available" : null,
          waives_application_fee: formData.waives_application_fee,
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
              <>
                <Select
                  value={formData.table_no}
                  onValueChange={(value) => setFormData({ ...formData, table_no: value })}
                  required
                >
                  <SelectTrigger id="table_no" className="min-h-[48px]">
                    <SelectValue placeholder="Select booth number" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] z-[100] bg-background">
                    {boothNumbers
                      .filter(boothNum => {
                        if (showAllBooths) return true;
                        const isAssigned = assignedBoothNumbers.has(boothNum);
                        const isCurrent = boothNum === booth.table_no;
                        return !isAssigned || isCurrent;
                      })
                      .map((boothNum) => {
                        const isAssigned = assignedBoothNumbers.has(boothNum);
                        const isCurrent = boothNum === booth.table_no;
                        return (
                          <SelectItem 
                            key={boothNum} 
                            value={boothNum}
                            disabled={isAssigned && !isCurrent}
                            className="min-h-[44px]"
                          >
                            {boothNum} {isAssigned && !isCurrent && "• Already Assigned"}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllBooths(!showAllBooths)}
                  className="text-xs h-auto py-1"
                >
                  {showAllBooths ? "Show Available Only" : "Show All Booths"}
                </Button>
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
            ) : (
              <Select
                value={formData.org_name}
                onValueChange={(value) => setFormData({ ...formData, org_name: value })}
                required
              >
                <SelectTrigger id="org_name">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] z-[100]">
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
            💡 <strong>Tip:</strong> Reposition this booth using the "Floor Plan Editor" tab
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)} 
              disabled={saving || deleting}
              className="sm:mr-auto min-h-[48px]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Booth
            </Button>
            <div className="flex gap-2 sm:ml-auto">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving || deleting} className="min-h-[48px]">
                Cancel
              </Button>
              <Button type="submit" disabled={saving || deleting} className="min-h-[48px]">
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
