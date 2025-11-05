import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, DollarSign, CreditCard } from "lucide-react";

interface BoothFeaturesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boothId: string;
  boothNumber: string;
  organizationName: string;
  initialFeatures: {
    offers_on_spot_admission: boolean;
    scholarship_info: string | null;
    waives_application_fee: boolean;
  };
  onUpdate?: () => void;
}

export const BoothFeaturesDrawer = ({
  open,
  onOpenChange,
  boothId,
  boothNumber,
  organizationName,
  initialFeatures,
  onUpdate,
}: BoothFeaturesDrawerProps) => {
  const [onSpotAdmission, setOnSpotAdmission] = useState(initialFeatures.offers_on_spot_admission);
  const [scholarship, setScholarship] = useState(!!initialFeatures.scholarship_info);
  const [feeWaiver, setFeeWaiver] = useState(initialFeatures.waives_application_fee);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (
    field: "offers_on_spot_admission" | "scholarship_info" | "waives_application_fee",
    value: boolean
  ) => {
    setIsSaving(true);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const updateData: any = {};
    
    if (field === "scholarship_info") {
      updateData.scholarship_info = value ? "Available" : null;
    } else {
      updateData[field] = value;
    }

    const { error } = await supabase
      .from("booths")
      .update(updateData)
      .eq("id", boothId);

    setIsSaving(false);

    if (error) {
      toast.error("Failed to update features", {
        description: error.message,
      });
      // Revert the state
      if (field === "offers_on_spot_admission") setOnSpotAdmission(!value);
      if (field === "scholarship_info") setScholarship(!value);
      if (field === "waives_application_fee") setFeeWaiver(!value);
    } else {
      toast.success(`✅ Features updated for Booth #${boothNumber}`);
      onUpdate?.();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Edit Features</DrawerTitle>
          <DrawerDescription>
            Booth #{boothNumber} - {organizationName}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-3">
          {/* On-Spot Admission */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-card min-h-[72px] active:scale-[0.98] transition-transform">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <Label htmlFor="admission" className="text-base font-medium cursor-pointer">
                  On-Spot Admission
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Offer immediate admission decisions to students
              </p>
            </div>
            <Switch
              id="admission"
              checked={onSpotAdmission}
              onCheckedChange={(checked) => {
                setOnSpotAdmission(checked);
                handleToggle("offers_on_spot_admission", checked);
              }}
              disabled={isSaving}
              className="mt-1"
            />
          </div>

          {/* Scholarships */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-card min-h-[72px] active:scale-[0.98] transition-transform">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <Label htmlFor="scholarship" className="text-base font-medium cursor-pointer">
                  Scholarships
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                On-spot scholarship opportunities available
              </p>
            </div>
            <Switch
              id="scholarship"
              checked={scholarship}
              onCheckedChange={(checked) => {
                setScholarship(checked);
                handleToggle("scholarship_info", checked);
              }}
              disabled={isSaving}
              className="mt-1"
            />
          </div>

          {/* Fee Waiver */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-card min-h-[72px] active:scale-[0.98] transition-transform">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <Label htmlFor="fee-waiver" className="text-base font-medium cursor-pointer">
                  Fee Waiver
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Waive application fees for attendees today
              </p>
            </div>
            <Switch
              id="fee-waiver"
              checked={feeWaiver}
              onCheckedChange={(checked) => {
                setFeeWaiver(checked);
                handleToggle("waives_application_fee", checked);
              }}
              disabled={isSaving}
              className="mt-1"
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
