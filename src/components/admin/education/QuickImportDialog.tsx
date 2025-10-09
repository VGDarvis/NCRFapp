import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSchools } from "@/hooks/useSchools";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface QuickImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolData: any;
}

export function QuickImportDialog({ open, onOpenChange, schoolData }: QuickImportDialogProps) {
  const { createSchool } = useSchools();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    programs: "",
    sports: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createSchool.mutateAsync({
        school_name: schoolData.name,
        address: schoolData.address,
        city: schoolData.city,
        state: schoolData.state,
        zip_code: schoolData.zip_code || "",
        phone: schoolData.phone || "",
        website: schoolData.website || "",
        school_type: schoolData.school_type || "high_school",
        verification_status: "pending",
        data_source: "web_scraped",
        programs_offered: formData.programs ? formData.programs.split(",").map(p => p.trim()) : [],
        athletic_programs: formData.sports ? formData.sports.split(",").map(s => s.trim()) : [],
        notes: formData.notes,
      });

      toast.success("School added to database!");
      onOpenChange(false);
      setFormData({ programs: "", sports: "", notes: "" });
    } catch (error) {
      toast.error("Failed to add school to database");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add School to Database</DialogTitle>
          <DialogDescription>
            Review the information from web search and add additional details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input value={schoolData.name} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>School Type</Label>
              <Input value={schoolData.school_type || "High School"} disabled className="bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={schoolData.address} disabled className="bg-muted" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={schoolData.city} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input value={schoolData.state} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input value={schoolData.zip_code || ""} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={schoolData.phone || "N/A"} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={schoolData.website || "N/A"} disabled className="bg-muted" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Additional Information (Optional)</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="programs">Programs Offered (comma-separated)</Label>
                <Input
                  id="programs"
                  placeholder="e.g., Engineering, Business, Arts"
                  value={formData.programs}
                  onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sports">Athletic Programs (comma-separated)</Label>
                <Input
                  id="sports"
                  placeholder="e.g., Football, Basketball, Track"
                  value={formData.sports}
                  onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this school"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add to Database
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
