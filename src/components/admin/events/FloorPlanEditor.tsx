import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Save, Upload, FileSpreadsheet, Eye, Edit3 } from "lucide-react";
import { useFloorPlanEditor } from "@/hooks/useFloorPlanEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BoothPropertiesPanel } from "./BoothPropertiesPanel";
import { BoothPropertiesDrawer } from "./BoothPropertiesDrawer";
import { FloorPlanToolbar } from "./FloorPlanToolbar";
import { MobileCanvasControls } from "./MobileCanvasControls";
import { BoothCSVImporter } from "./BoothCSVImporter";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloorPlanViewer } from "@/components/dashboard/college-expo/floor-plan/FloorPlanViewer";

interface FloorPlanEditorProps {
  eventId: string;
  floorPlanId: string | null;
  onFloorPlanCreated?: (floorPlanId: string) => void;
}

export const FloorPlanEditor = ({ eventId, floorPlanId, onFloorPlanCreated }: FloorPlanEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPanMode, setIsPanMode] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');
  const [floorPlanData, setFloorPlanData] = useState<any>(null);
  const [boothsData, setBoothsData] = useState<any[]>([]);
  const isMobile = useIsMobile();

  console.log("🎨 FloorPlanEditor mounted", { eventId, floorPlanId, viewMode });

  const {
    fabricCanvas,
    selectedBooth,
    booths,
    activeTool,
    isLoading,
    setActiveTool,
    loadFloorPlanBackground,
    loadBooths,
    addBooth,
    deleteBooth,
    saveBooths,
    setSelectedBooth,
  } = useFloorPlanEditor(floorPlanId, canvasRef, isPanMode, eventId);

  // Load floor plan data for view mode
  useEffect(() => {
    if (floorPlanId && viewMode === 'view') {
      loadFloorPlanData();
    }
  }, [floorPlanId, viewMode]);

  const loadFloorPlanData = async () => {
    try {
      console.log("📊 Loading floor plan data for view mode...");
      const { data: floorPlan, error: fpError } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("id", floorPlanId)
        .single();

      if (fpError) throw fpError;
      setFloorPlanData(floorPlan);

      const { data: booths, error: boothError } = await supabase
        .from("booths")
        .select("*")
        .eq("event_id", eventId);

      if (boothError) throw boothError;
      setBoothsData(booths || []);
      console.log("✅ Loaded floor plan and", booths?.length || 0, "booths for view mode");
    } catch (error) {
      console.error("❌ Error loading floor plan data:", error);
    }
  };

  // Open drawer when booth is selected on mobile
  useEffect(() => {
    if (isMobile && selectedBooth) {
      setDrawerOpen(true);
    }
  }, [selectedBooth, isMobile]);


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
      if (floorPlanId) {
        const { error } = await supabase
          .from("floor_plans")
          .update({ background_image_url: publicUrl })
          .eq("id", floorPlanId);

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
    if (!floorPlanId) {
      toast.error("Please upload a floor plan image first");
      return;
    }
    await saveBooths(eventId);
  };

  const handleAddBooth = () => {
    addBooth(100, 100);
  };

  if (!floorPlanId) {
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
              variant={viewMode === 'view' ? 'default' : 'outline'}
              onClick={() => {
                const newMode = viewMode === 'edit' ? 'view' : 'edit';
                setViewMode(newMode);
                console.log("🔄 Switched to", newMode, "mode");
              }}
              size={isMobile ? "sm" : "default"}
              className="h-11 min-w-[44px]"
            >
              {viewMode === 'edit' ? (
                <>
                  <Eye className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">View Mode</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Edit Mode</span>
                </>
              )}
            </Button>
            {viewMode === 'edit' && (
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
            )}
          </div>
        </div>

        {viewMode === 'edit' && (
          <div className="space-y-2">
            <FloorPlanToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onAddBooth={handleAddBooth}
              onDeleteBooth={deleteBooth}
              hasSelectedBooth={!!selectedBooth}
            />
            {floorPlanId && (
              <div className="text-sm text-muted-foreground px-4 py-2 bg-muted/50 rounded-md">
                {isLoading ? "Loading booths..." : `${booths.length} booth${booths.length === 1 ? '' : 's'} loaded`}
              </div>
            )}
          </div>
        )}

        {viewMode === 'view' && (
          <div className="text-sm text-muted-foreground px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
            👁️ <strong>View Mode:</strong> This is exactly what attendees see. Switch to Edit Mode to make changes.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
          <div className="lg:col-span-3 relative">
            {viewMode === 'edit' ? (
              <>
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
              </>
            ) : (
              <div>
                {floorPlanData && boothsData.length > 0 ? (
                  <FloorPlanViewer
                    floorPlan={floorPlanData}
                    booths={boothsData}
                    onBoothClick={(boothId) => {
                      const booth = boothsData.find(b => b.id === boothId);
                      console.log("📍 Admin clicked booth:", booth);
                      if (booth) {
                        toast.info(`Booth ${booth.table_no}: ${booth.org_name || 'No organization'}`);
                      }
                    }}
                  />
                ) : (
                  <Card className="p-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading attendee view...</p>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          {!isMobile && (
            <div className="lg:col-span-1">
              <BoothPropertiesPanel
                selectedBooth={selectedBooth}
                eventId={eventId}
                onBoothUpdated={() => {
                  if (floorPlanId) {
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
            if (floorPlanId) {
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
