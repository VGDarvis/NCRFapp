import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { useFloorPlan } from "@/hooks/useFloorPlans";

interface FloorPlanImageUploadProps {
  floorPlanId: string | null;
}

export function FloorPlanImageUpload({ floorPlanId }: FloorPlanImageUploadProps) {
  const { data: floorPlan, refetch } = useFloorPlan(floorPlanId);
  const [uploading, setUploading] = useState(false);
  const [gridOpacity, setGridOpacity] = useState(floorPlan?.grid_opacity || 0.6);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !floorPlanId) return;

    setUploading(true);
    try {
      // Resize image using canvas
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.src = e.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, 1200, 800);

          canvas.toBlob(async (blob) => {
            if (!blob) return;

            const fileName = `floor-plan-${floorPlanId}-${Date.now()}.jpg`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('event_assets')
              .upload(fileName, blob, { contentType: 'image/jpeg' });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from('event_assets')
              .getPublicUrl(fileName);

            const { error: updateError } = await supabase
              .from('floor_plans')
              .update({ background_image_url: urlData.publicUrl })
              .eq('id', floorPlanId);

            if (updateError) throw updateError;

            toast.success('Floor plan image uploaded successfully');
            refetch();
          }, 'image/jpeg', 0.9);
        };
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error('Failed to upload image', {
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!floorPlanId) return;

    try {
      const { error } = await supabase
        .from('floor_plans')
        .update({ background_image_url: null })
        .eq('id', floorPlanId);

      if (error) throw error;

      toast.success('Floor plan image removed');
      refetch();
    } catch (error: any) {
      toast.error('Failed to remove image', {
        description: error.message,
      });
    }
  };

  const handleOpacityChange = async (value: number[]) => {
    setGridOpacity(value[0]);
    if (!floorPlanId) return;

    try {
      const { error } = await supabase
        .from('floor_plans')
        .update({ grid_opacity: value[0] })
        .eq('id', floorPlanId);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to update grid opacity');
    }
  };

  if (!floorPlanId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Select an event to manage floor plan image</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plan Background Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Background Image</Label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {floorPlan?.background_image_url && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDeleteImage}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Current Image Preview */}
        {floorPlan?.background_image_url && (
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={floorPlan.background_image_url}
                alt="Floor plan"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Grid Opacity Control */}
        <div className="space-y-2">
          <Label>Grid Overlay Opacity: {Math.round(gridOpacity * 100)}%</Label>
          <Slider
            value={[gridOpacity]}
            onValueChange={handleOpacityChange}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Adjust opacity to make the background image more visible through the grid
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
