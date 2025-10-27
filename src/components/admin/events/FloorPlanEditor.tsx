import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, Plus, Trash2, MousePointer, Square } from "lucide-react";
import { useFloorPlanEditor } from "@/hooks/useFloorPlanEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BoothPropertiesPanel } from "./BoothPropertiesPanel";
import { FloorPlanToolbar } from "./FloorPlanToolbar";

interface FloorPlanEditorProps {
  eventId: string;
  floorPlanId: string | null;
  onFloorPlanCreated?: (floorPlanId: string) => void;
}

export const FloorPlanEditor = ({ eventId, floorPlanId, onFloorPlanCreated }: FloorPlanEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentFloorPlanId, setCurrentFloorPlanId] = useState<string | null>(floorPlanId);

  const {
    fabricCanvas,
    selectedBooth,
    activeTool,
    isLoading,
    setActiveTool,
    loadFloorPlanBackground,
    loadBooths,
    addBooth,
    deleteBooth,
    saveBooths,
    setSelectedBooth,
  } = useFloorPlanEditor(currentFloorPlanId, canvasRef);

  // Load existing booths when floor plan is set
  useEffect(() => {
    if (fabricCanvas && currentFloorPlanId && eventId) {
      loadBooths(eventId);
    }
  }, [fabricCanvas, currentFloorPlanId, eventId]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `floor-plan-${Date.now()}.${fileExt}`;
      const filePath = `floor-plans/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("event_assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("event_assets")
        .getPublicUrl(filePath);

      // Create or update floor plan record
      if (currentFloorPlanId) {
        const { error } = await supabase
          .from("floor_plans")
          .update({ background_image_url: publicUrl })
          .eq("id", currentFloorPlanId);

        if (error) throw error;
      } else {
        // Get venue_id from event
        const { data: eventData } = await supabase
          .from("events")
          .select("venue_id")
          .eq("id", eventId)
          .single();

        const { data: newFloorPlan, error } = await supabase
          .from("floor_plans")
          .insert({
            venue_id: eventData?.venue_id,
            floor_number: 1,
            floor_name: "Main Floor",
            background_image_url: publicUrl,
            canvas_width: 1200,
            canvas_height: 800,
          })
          .select()
          .single();

        if (error) throw error;
        if (newFloorPlan) {
          setCurrentFloorPlanId(newFloorPlan.id);
          onFloorPlanCreated?.(newFloorPlan.id);
        }
      }

      // Load the image into canvas
      await loadFloorPlanBackground(publicUrl);
      toast.success("Floor plan image uploaded");
    } catch (error) {
      console.error("Error uploading floor plan:", error);
      toast.error("Failed to upload floor plan");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!currentFloorPlanId) {
      toast.error("Please upload a floor plan image first");
      return;
    }
    await saveBooths(eventId);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Floor Plan Editor</h2>
            <p className="text-muted-foreground">Design and configure booth layout</p>
          </div>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload Floor Plan
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !currentFloorPlanId}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <FloorPlanToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onAddBooth={() => addBooth(100, 100)}
          onDeleteBooth={deleteBooth}
          hasSelectedBooth={!!selectedBooth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
          <div className="lg:col-span-3">
            <Card className="p-4 bg-muted/50">
              <canvas
                ref={canvasRef}
                className="border border-border rounded-lg w-full"
                style={{ maxHeight: "600px" }}
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BoothPropertiesPanel
              selectedBooth={selectedBooth}
              eventId={eventId}
              onBoothUpdated={() => {
                if (currentFloorPlanId) {
                  loadBooths(eventId);
                }
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
