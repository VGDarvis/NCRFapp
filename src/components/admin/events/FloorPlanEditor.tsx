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
import { useBooths } from "@/hooks/useBooths";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useRealtimeFloorPlan } from "@/hooks/useRealtimeFloorPlan";

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
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const isMobile = useIsMobile();

  // Get venue_id for floor plans
  const [venueId, setVenueId] = useState<string | null>(null);

  console.log("🎨 FloorPlanEditor mounted", { eventId, floorPlanId });

  // Use React Query hooks for real-time data
  const { data: realtimeBooths = [], isLoading: boothsLoading, refetch: refetchBooths } = useBooths(eventId);
  const { data: floorPlans = [], isLoading: floorPlansLoading } = useFloorPlans(venueId);
  const floorPlan = floorPlans.find(fp => fp.id === floorPlanId);

  // Subscribe to real-time updates
  useRealtimeFloorPlan(eventId);

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

  // Load venue_id from event
  useEffect(() => {
    const loadVenueId = async () => {
      const { data: eventData } = await supabase
        .from("events")
        .select("venue_id")
        .eq("id", eventId)
        .single();
      
      if (eventData?.venue_id) {
        setVenueId(eventData.venue_id);
      }
    };
    
    loadVenueId();
  }, [eventId]);

  // Update sync timestamp when booth data changes (triggers re-render of FloorPlanViewer)
  useEffect(() => {
    if (realtimeBooths && realtimeBooths.length > 0) {
      setLastSync(new Date());
      console.log("✅ Booth data synced:", realtimeBooths.length, "booths");
    }
  }, [realtimeBooths]);

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
            <h2 className="text-xl md:text-2xl font-bold">Floor Plan - Attendee View</h2>
            <p className="text-sm text-muted-foreground">
              This is what attendees see. Click any booth to view details. Edit booths in the "Edit Booths" tab.
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md mb-4 flex items-center justify-between">
          <span>
            👁️ <strong>Attendee View:</strong> Changes made in "Edit Booths" will appear here automatically.
          </span>
          <span className="text-xs opacity-70">
            Last sync: {lastSync.toLocaleTimeString()}
          </span>
        </div>

        <div>
          {floorPlansLoading || boothsLoading ? (
            <Card className="p-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading floor plan...</p>
              </div>
            </Card>
          ) : floorPlan && realtimeBooths.length > 0 ? (
            <FloorPlanViewer
              key={`viewer-${lastSync.getTime()}`}
              floorPlan={floorPlan}
              booths={realtimeBooths}
              onBoothClick={(boothId) => {
                const booth = realtimeBooths.find(b => b.id === boothId);
                console.log("📍 Admin clicked booth:", booth);
                if (booth) {
                  toast.info(`Booth ${booth.table_no}: ${booth.org_name || 'No organization'}`, {
                    description: "Go to Edit Booths tab to make changes"
                  });
                }
              }}
            />
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No booths configured yet. Go to "Edit Booths" to add booths.</p>
              </div>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};
