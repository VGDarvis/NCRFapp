import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Hand, MousePointer, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useFloorPlanEditor } from "@/hooks/useFloorPlanEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEvents } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";

export const FloorPlanEditorTab = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { events } = useEvents();

  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];

  const {
    fabricCanvas,
    selectedBooth,
    booths,
    isLoading,
    saveBooths,
  } = useFloorPlanEditor(floorPlanId, canvasRef, isPanMode, selectedEventId || undefined);

  // Load floor plan for selected event
  useEffect(() => {
    if (!selectedEventId) {
      if (collegeExpos.length > 0) {
        setSelectedEventId(collegeExpos[0].id);
      }
      return;
    }

    loadFloorPlan(selectedEventId);
  }, [selectedEventId, collegeExpos]);

  const loadFloorPlan = async (eventId: string) => {
    try {
      const { data: event } = await supabase
        .from("events")
        .select("venue_id")
        .eq("id", eventId)
        .single();

      if (!event?.venue_id) {
        toast.error("No venue found for this event");
        return;
      }

      const { data: floorPlan } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("venue_id", event.venue_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (floorPlan) {
        setFloorPlanId(floorPlan.id);
      }
    } catch (error) {
      console.error("Error loading floor plan:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedEventId) return;
    await saveBooths(selectedEventId);
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (!fabricCanvas) return;
    
    let newZoom = zoom;
    if (direction === "in") newZoom = Math.min(zoom * 1.2, 3);
    else if (direction === "out") newZoom = Math.max(zoom / 1.2, 0.5);
    else newZoom = 1;
    
    fabricCanvas.setZoom(newZoom);
    setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const positionedBooths = booths.filter(b => b.boothData?.id).length;
  const unpositionedBooths = booths.filter(b => !b.boothData?.id).length;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Floor Plan Editor</h2>
            <p className="text-sm text-muted-foreground">
              Drag and drop booth numbers to position them on the floor plan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select event..." />
              </SelectTrigger>
              <SelectContent>
                {collegeExpos.map((expo) => (
                  <SelectItem key={expo.id} value={expo.id}>
                    {expo.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={isPanMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPanMode(!isPanMode)}
            >
              {isPanMode ? <Hand className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
              {isPanMode ? "Pan" : "Select"}
            </Button>

            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleSave} disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Positions
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            Total: {positionedBooths + unpositionedBooths} booths
          </Badge>
          <Badge variant="default">
            Positioned: {positionedBooths}
          </Badge>
          {unpositionedBooths > 0 && (
            <Badge variant="destructive">
              Not Positioned: {unpositionedBooths}
            </Badge>
          )}
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(255, 215, 0, 0.7)" }} />
            Gold Sponsor
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(192, 192, 192, 0.7)" }} />
            Silver Sponsor
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(205, 127, 50, 0.7)" }} />
            Bronze Sponsor
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(59, 130, 246, 0.7)" }} />
            Standard
          </div>
        </div>

        {selectedBooth?.boothData && (
          <Card className="p-3 mb-4 bg-primary/5">
            <div className="flex flex-col gap-1">
              <div className="font-semibold">Selected Booth: {selectedBooth.boothData.table_no}</div>
              <div className="text-sm text-muted-foreground">{selectedBooth.boothData.org_name}</div>
              <div className="text-xs text-muted-foreground">
                Position: X: {Math.round(selectedBooth.rect.left || 0)}, Y: {Math.round(selectedBooth.rect.top || 0)} | 
                Size: {Math.round((selectedBooth.rect.width || 0) * (selectedBooth.rect.scaleX || 1))} × {Math.round((selectedBooth.rect.height || 0) * (selectedBooth.rect.scaleY || 1))}
              </div>
            </div>
          </Card>
        )}

        <div className="border rounded-lg overflow-auto bg-muted/20" style={{ maxHeight: "calc(100vh - 350px)" }}>
          <canvas ref={canvasRef} />
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm">
          <p className="font-semibold mb-1">💡 How to use:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click and drag booth numbers to reposition them</li>
            <li>Positions auto-save 2 seconds after you stop dragging</li>
            <li>Use Pan mode to navigate large floor plans</li>
            <li>Zoom in/out for precise positioning</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
