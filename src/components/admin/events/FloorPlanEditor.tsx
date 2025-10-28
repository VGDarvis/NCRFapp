import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Save, Upload, FileSpreadsheet } from "lucide-react";
import { useFloorPlanEditor } from "@/hooks/useFloorPlanEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BoothPropertiesPanel } from "./BoothPropertiesPanel";
import { BoothPropertiesDrawer } from "./BoothPropertiesDrawer";
import { FloorPlanToolbar } from "./FloorPlanToolbar";
import { MobileCanvasControls } from "./MobileCanvasControls";
import { BoothCSVImporter } from "./BoothCSVImporter";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPanMode, setIsPanMode] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const isMobile = useIsMobile();

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
  } = useFloorPlanEditor(currentFloorPlanId, canvasRef, isPanMode, eventId);

  // Open drawer when booth is selected on mobile
  useEffect(() => {
    if (isMobile && selectedBooth) {
      setDrawerOpen(true);
    }
  }, [selectedBooth, isMobile]);

  // Update currentFloorPlanId when prop changes (only for new floor plans)
  useEffect(() => {
    if (floorPlanId && !currentFloorPlanId) {
      setCurrentFloorPlanId(floorPlanId);
    }
  }, [floorPlanId]);

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

  if (!currentFloorPlanId) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No floor plan found for this event</p>
          <p className="text-sm text-muted-foreground">Please contact a technical administrator to upload the floor plan image and import booth data</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-3 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Event Day Floor Plan</h2>
            <p className="text-sm text-muted-foreground">
              Tap any booth to edit information • Drag booths to reposition
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              size={isMobile ? "sm" : "default"}
              className="h-11 min-w-[44px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin md:mr-2" />
              ) : (
                <Save className="w-4 h-4 md:mr-2" />
              )}
              <span className="hidden md:inline">Save Changes</span>
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
          <div className="lg:col-span-3 relative">
            <Card className="p-2 md:p-4 bg-muted/50">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading floor plan...</p>
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="border border-border rounded-lg w-full touch-none"
                style={{ 
                  height: isMobile ? "calc(100vh - 350px)" : "600px",
                  minHeight: "400px"
                }}
              />
            </Card>
            
            {isMobile && (
              <MobileCanvasControls 
                canvas={fabricCanvas}
                isPanMode={isPanMode}
                onTogglePanMode={() => setIsPanMode(!isPanMode)}
              />
            )}
          </div>

          {!isMobile && (
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
          )}
        </div>
      </Card>

      {isMobile && (
        <BoothPropertiesDrawer
          selectedBooth={selectedBooth}
          eventId={eventId}
          onBoothUpdated={() => {
            if (currentFloorPlanId) {
              loadBooths(eventId);
            }
          }}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </div>
  );
};
