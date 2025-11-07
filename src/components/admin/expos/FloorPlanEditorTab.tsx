import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Hand, MousePointer, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useFloorPlanEditor } from "@/hooks/useFloorPlanEditor";
import { MobileCanvasControls } from "@/components/admin/events/MobileCanvasControls";
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
  const [canvasScale, setCanvasScale] = useState(0.8); // CSS scale for visual zoom
  const { events } = useEvents();

  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];

  const {
    fabricCanvas,
    selectedBooth,
    booths,
    isLoading,
    saveBooths,
    fitAllBoothsToScreen,
    resetToFullView,
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

  const handleZoom = (direction: "in" | "out" | "reset" | "fitBooths") => {
    if (!fabricCanvas) return;
    
    let newZoom = zoom;
    if (direction === "in") {
      newZoom = Math.min(zoom * 1.2, 3);
      fabricCanvas.setZoom(newZoom);
      setZoom(newZoom);
    } else if (direction === "out") {
      newZoom = Math.max(zoom / 1.2, 0.5);
      fabricCanvas.setZoom(newZoom);
      setZoom(newZoom);
    } else if (direction === "reset") {
      // Reset to full floor plan view (matching attendee experience)
      if (resetToFullView) {
        resetToFullView();
        setZoom(1);
      }
    } else if (direction === "fitBooths") {
      // Fit to positioned booths only
      if (fitAllBoothsToScreen) {
        const optimalZoom = fitAllBoothsToScreen();
        setZoom(optimalZoom || 1);
      }
    }
    
    fabricCanvas.renderAll();
  };

  const positionedBooths = booths.filter(b => b.boothData?.id).length;
  const unpositionedBooths = booths.filter(b => !b.boothData?.id).length;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Floor Plan Editor</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Drag and drop booth numbers to position them on the floor plan
            </p>
          </div>

          <div className="hidden md:flex flex-wrap items-center gap-2">
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
              <Button variant="outline" size="sm" onClick={() => setCanvasScale(Math.max(0.25, canvasScale - 0.25))} title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCanvasScale(1)} title="Reset to 100%">
                <span className="text-xs font-mono">100%</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCanvasScale(Math.min(2, canvasScale + 0.25))} title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <Badge variant="outline" className="hidden lg:inline-flex">
              Scale: {Math.round(canvasScale * 100)}%
            </Badge>

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

        <div className="flex md:hidden items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Floor Plan</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{positionedBooths + unpositionedBooths}</Badge>
          </div>
        </div>

        <div 
          className="border rounded-lg bg-muted/20 relative overflow-auto"
          style={{
            width: "100%",
            maxHeight: "calc(100vh - 400px)",
            minHeight: "500px",
          }}
        >
          <div 
            className="relative mx-auto transition-transform"
            style={{
              width: "1200px",
              height: "800px",
              transform: `scale(${canvasScale})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Optional Grid Overlay */}
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: "1200px",
                height: "800px",
                opacity: 0.08,
                zIndex: 1,
              }}
            >
              {/* Vertical lines every 100px */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 100}
                  y1={0}
                  x2={i * 100}
                  y2={800}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
              {/* Horizontal lines every 100px */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 100}
                  x2={1200}
                  y2={i * 100}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
            </svg>
            
            <canvas 
              ref={canvasRef}
              style={{ 
                width: "1200px",
                height: "800px",
                display: "block",
                position: "relative",
                zIndex: 2,
              }} 
            />
          </div>
        </div>
        
        {/* Enhanced Stats Panel */}
        {fabricCanvas && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Floor Plan Status</h3>
              {positionedBooths > 0 && (
                <Badge variant="outline" className="text-xs">
                  {Math.round((positionedBooths / (positionedBooths + unpositionedBooths)) * 100)}% Complete
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Canvas Size</span>
                <span className="font-mono font-semibold">1200 × 800px</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">View Scale</span>
                <span className="font-mono font-semibold">{Math.round(canvasScale * 100)}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Total Booths</span>
                <span className="font-mono font-semibold">{positionedBooths + unpositionedBooths}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Positioned</span>
                <span className="font-mono font-semibold text-green-600">{positionedBooths}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Unpositioned</span>
                <span className="font-mono font-semibold text-orange-600">{unpositionedBooths}</span>
              </div>
            </div>
          </div>
        )}
        
        <MobileCanvasControls 
          canvas={fabricCanvas} 
          isPanMode={isPanMode}
          onTogglePanMode={() => setIsPanMode(!isPanMode)}
          zoom={canvasScale}
          onZoomIn={() => setCanvasScale(Math.min(2, canvasScale + 0.25))}
          onZoomOut={() => setCanvasScale(Math.max(0.25, canvasScale - 0.25))}
          onResetZoom={() => setCanvasScale(1)}
        />
        
        {/* Mobile Tips */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm md:hidden">
          <p className="font-semibold mb-1">📱 Mobile Editor Tips:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Use controls below to zoom and navigate</li>
            <li>• Tap booth to select, then drag to move</li>
            <li>• Toggle Pan mode to scroll the canvas</li>
            <li>• Auto-saves 3 seconds after you stop</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm hidden md:block">
          <p className="font-semibold mb-1">💡 How to use:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Canvas displays at exact 1200×800 pixels (1:1 coordinate mapping with attendee view)</li>
            <li>Click and drag booth numbers to reposition them</li>
            <li>Positions auto-save 2 seconds after you stop dragging</li>
            <li>Use +/- buttons to zoom view (doesn't affect coordinates)</li>
            <li>Grid overlay shows 100px cells matching attendee booth grid</li>
            <li>Changes automatically broadcast to all attendees in real-time</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
