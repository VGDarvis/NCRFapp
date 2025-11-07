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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Booth } from "@/hooks/useBooths";
import { useAvailableBoothNumbers, useOrganizationOptions } from "@/hooks/useBoothPresets";
import { useBooths } from "@/hooks/useBooths";
import { useQueryClient } from "@tanstack/react-query";

interface BoothEditDialogProps {
  booth: Booth;
  open: boolean;
  onClose: () => void;
  onBoothUpdated: () => void;
}

export function BoothEditDialog({ booth, open, onClose, onBoothUpdated }: BoothEditDialogProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAllBooths, setShowAllBooths] = useState(false);
  const [boothInputMode, setBoothInputMode] = useState<"select" | "custom">("select");
  const [orgInputMode, setOrgInputMode] = useState<"select" | "custom">("select");
  const [formData, setFormData] = useState({
    table_no: booth.table_no || "",
    org_name: booth.org_name || "",
    description: booth.description || "",
    offers_on_spot_admission: booth.offers_on_spot_admission || false,
    scholarship_info: !!booth.scholarship_info,
    waives_application_fee: booth.waives_application_fee || false,
    x_position: booth.x_position?.toString() || "",
    y_position: booth.y_position?.toString() || "",
    booth_width: booth.booth_width?.toString() || "30",
    booth_depth: booth.booth_depth?.toString() || "30",
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
      booth_width: booth.booth_width?.toString() || "30",
      booth_depth: booth.booth_depth?.toString() || "30",
    });
  }, [booth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Debug: Log current user authentication state
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error(`Authentication error: ${sessionError.message}`);
        setSaving(false);
        return;
      }

      if (!session) {
        console.error("No active session found");
        toast.error("You must be logged in to update booths");
        setSaving(false);
        return;
      }

      console.log("Current user:", session.user.email, "User ID:", session.user.id);

      // Validate numeric inputs
      const xPos = formData.x_position?.trim() ? parseFloat(formData.x_position) : null;
      const yPos = formData.y_position?.trim() ? parseFloat(formData.y_position) : null;
      const width = formData.booth_width?.trim() ? parseFloat(formData.booth_width) : 30;
      const depth = formData.booth_depth?.trim() ? parseFloat(formData.booth_depth) : 30;

      if ((xPos !== null && isNaN(xPos)) || (yPos !== null && isNaN(yPos))) {
        toast.error("Invalid position values. Please enter valid numbers.");
        setSaving(false);
        return;
      }

      console.log("Updating booth with data:", {
        table_no: formData.table_no,
        org_name: formData.org_name,
        x_position: xPos,
        y_position: yPos,
        booth_width: width,
        booth_depth: depth,
      });

      const { error } = await supabase
        .from("booths")
        .update({
          table_no: formData.table_no,
          org_name: formData.org_name,
          description: formData.description,
          offers_on_spot_admission: formData.offers_on_spot_admission,
          scholarship_info: formData.scholarship_info ? "Available" : null,
          waives_application_fee: formData.waives_application_fee,
          x_position: xPos,
          y_position: yPos,
          booth_width: width,
          booth_depth: depth,
        })
        .eq("id", booth.id);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });

      toast.success(`Booth #${booth.table_no} updated successfully`);
      onBoothUpdated();
    } catch (error: any) {
      console.error("Error updating booth:", error);
      const errorMessage = error?.message || error?.details || "Unknown error occurred";
      toast.error(`Failed to update booth: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Debug: Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Deleting booth - User:", session?.user.email);

      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("id", booth.id);

      if (error) {
        console.error("Delete error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });

      toast.success(`Booth #${booth.table_no} deleted successfully`);
      setShowDeleteConfirm(false);
      onClose();
      onBoothUpdated();
    } catch (error: any) {
      console.error("Error deleting booth:", error);
      const errorMessage = error?.message || error?.details || "Unknown error occurred";
      toast.error(`Failed to delete booth: ${errorMessage}`);
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
                {formData.table_no && formData.table_no !== booth.table_no && assignedBoothNumbers.has(formData.table_no) && (
                  <p className="text-sm text-amber-600 dark:text-amber-500">
                    ⚠️ Booth #{formData.table_no} is already assigned to another organization
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

          <div className="space-y-3">
            <Label htmlFor="org_name">Organization Name *</Label>
            
            <RadioGroup 
              value={orgInputMode} 
              onValueChange={(value: "select" | "custom") => setOrgInputMode(value)} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="org-mode-select" />
                <Label htmlFor="org-mode-select" className="font-normal cursor-pointer">
                  Select from organizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="org-mode-custom" />
                <Label htmlFor="org-mode-custom" className="font-normal cursor-pointer">
                  Enter custom name
                </Label>
              </div>
            </RadioGroup>

            {orgInputMode === "custom" ? (
              <Input
                id="org_name"
                value={formData.org_name}
                onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                placeholder="Enter organization name"
                required
                className="min-h-[48px]"
              />
            ) : orgsLoading ? (
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
                <SelectTrigger id="org_name" className="min-h-[48px]">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] z-[9999] bg-background" position="popper" sideOffset={5}>
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
