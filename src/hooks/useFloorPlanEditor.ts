import { useState, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Rect, Text, FabricImage } from "fabric";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface BoothObject {
  id: string;
  rect: Rect;
  label: Text;
  boothData?: any;
}

export function useFloorPlanEditor(
  floorPlanId: string | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isPanMode: boolean,
  eventId?: string
) {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<BoothObject | null>(null);
  const [booths, setBooths] = useState<BoothObject[]>([]);
  const [activeTool, setActiveTool] = useState<"select" | "draw">("select");
  const [isLoading, setIsLoading] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasRef.current.clientWidth || 1200,
      height: canvasRef.current.clientHeight || 800,
      backgroundColor: "#f8f9fa",
      selection: true,
    });

    // Enable touch gestures
    canvas.allowTouchScrolling = true;
    canvas.perPixelTargetFind = true;
    canvas.targetFindTolerance = 10;

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasRef]);

  // Load floor plan background
  const loadFloorPlanBackground = useCallback(async (imageUrl: string) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });
      
      // Scale image to fit canvas
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );
      
      img.scale(scale * 0.9);
      img.set({
        left: (fabricCanvas.width! - img.width! * scale * 0.9) / 2,
        top: (fabricCanvas.height! - img.height! * scale * 0.9) / 2,
        selectable: false,
        evented: false,
      });

      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
      
      console.log('✅ Floor plan image loaded successfully');
      toast.success("Floor plan loaded");
    } catch (error) {
      console.error("Error loading floor plan:", error);
      toast.error("Failed to load floor plan");
    }
  }, [fabricCanvas]);

  // Load existing booths from database
  const loadBooths = useCallback(async (eventId: string) => {
    if (!fabricCanvas) return;

    setIsLoading(true);
    try {
      const { data: boothsData, error } = await supabase
        .from("booths")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;

      const loadedBooths: BoothObject[] = [];

      boothsData?.forEach((booth) => {
        if (booth.x_position && booth.y_position) {
          const rect = new Rect({
            left: Number(booth.x_position),
            top: Number(booth.y_position),
            width: Number(booth.booth_width || 80),
            height: Number(booth.booth_depth || 80),
            fill: booth.sponsor_tier === "gold" ? "rgba(255, 215, 0, 0.5)" : 
                  booth.sponsor_tier === "silver" ? "rgba(192, 192, 192, 0.5)" :
                  booth.sponsor_tier === "bronze" ? "rgba(205, 127, 50, 0.5)" :
                  "rgba(59, 130, 246, 0.5)",
            stroke: "#1e40af",
            strokeWidth: 3,
            cornerColor: "#3b82f6",
            cornerSize: 12,
            transparentCorners: false,
            padding: 10,
          });

          const label = new Text(booth.table_no || "---", {
            left: Number(booth.x_position) + Number(booth.booth_width || 80) / 2,
            top: Number(booth.y_position) + Number(booth.booth_depth || 80) / 2,
            fontSize: 16,
            fill: "#1e40af",
            fontWeight: "bold",
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
          });

          fabricCanvas.add(rect);
          fabricCanvas.add(label);

          loadedBooths.push({
            id: booth.id,
            rect,
            label,
            boothData: booth,
          });

          rect.on("selected", () => {
            setSelectedBooth({ id: booth.id, rect, label, boothData: booth });
          });
        }
      });

      setBooths(loadedBooths);
      fabricCanvas.renderAll();
      
      console.log('✅ Loaded', boothsData?.length, 'booths');
      if (loadedBooths.length > 0) {
        toast.success(`Loaded ${loadedBooths.length} booth${loadedBooths.length === 1 ? '' : 's'}`);
      }
    } catch (error) {
      console.error("Error loading booths:", error);
      toast.error("Failed to load booths");
    } finally {
      setIsLoading(false);
    }
  }, [fabricCanvas, setBooths, setIsLoading]);

  // Auto-load floor plan background when floorPlanId changes
  useEffect(() => {
    if (!fabricCanvas || !floorPlanId) return;

    const autoLoadFloorPlan = async () => {
      try {
        console.log('🎨 Auto-loading floor plan:', floorPlanId);
        const { data: floorPlan, error } = await supabase
          .from("floor_plans")
          .select("background_image_url")
          .eq("id", floorPlanId)
          .single();

        if (error) throw error;
        
        if (floorPlan?.background_image_url) {
          await loadFloorPlanBackground(floorPlan.background_image_url);
        }
      } catch (error) {
        console.error("Error auto-loading floor plan:", error);
      }
    };

    autoLoadFloorPlan();
  }, [fabricCanvas, floorPlanId, loadFloorPlanBackground]);

  // Auto-load booths when canvas and eventId are ready
  useEffect(() => {
    if (!fabricCanvas || !eventId) return;
    
    console.log('📦 Auto-loading booths for event:', eventId);
    const autoLoadBooths = async () => {
      await loadBooths(eventId);
    };
    
    autoLoadBooths();
  }, [fabricCanvas, eventId, loadBooths]);

  // Handle pan mode
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.selection = !isPanMode;
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = !isPanMode;
      obj.evented = !isPanMode;
    });

    if (isPanMode) {
      fabricCanvas.defaultCursor = "grab";
      fabricCanvas.hoverCursor = "grab";
      
      const handleMouseDown = (opt: any) => {
        const evt = opt.e;
        if (isPanMode) {
          fabricCanvas.defaultCursor = "grabbing";
          setLastPanPoint({ x: evt.clientX || evt.touches?.[0].clientX, y: evt.clientY || evt.touches?.[0].clientY });
        }
      };

      const handleMouseMove = (opt: any) => {
        if (isPanMode && lastPanPoint) {
          const evt = opt.e;
          const vpt = fabricCanvas.viewportTransform!;
          const currentX = evt.clientX || evt.touches?.[0].clientX;
          const currentY = evt.clientY || evt.touches?.[0].clientY;
          
          vpt[4] += currentX - lastPanPoint.x;
          vpt[5] += currentY - lastPanPoint.y;
          
          fabricCanvas.requestRenderAll();
          setLastPanPoint({ x: currentX, y: currentY });
        }
      };

      const handleMouseUp = () => {
        fabricCanvas.defaultCursor = "grab";
        setLastPanPoint(null);
      };

      fabricCanvas.on("mouse:down", handleMouseDown);
      fabricCanvas.on("mouse:move", handleMouseMove);
      fabricCanvas.on("mouse:up", handleMouseUp);

      return () => {
        fabricCanvas.off("mouse:down", handleMouseDown);
        fabricCanvas.off("mouse:move", handleMouseMove);
        fabricCanvas.off("mouse:up", handleMouseUp);
      };
    } else {
      fabricCanvas.defaultCursor = "default";
      fabricCanvas.hoverCursor = "move";
    }
  }, [fabricCanvas, isPanMode, lastPanPoint]);

  // Add new booth
  const addBooth = useCallback((x: number = 100, y: number = 100) => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: x,
      top: y,
      width: 80,
      height: 80,
      fill: "rgba(59, 130, 246, 0.5)",
      stroke: "#1e40af",
      strokeWidth: 3,
      cornerColor: "#3b82f6",
      cornerSize: 12,
      transparentCorners: false,
      padding: 10,
    });

    const label = new Text("New", {
      left: x + 40,
      top: y + 40,
      fontSize: 16,
      fill: "#1e40af",
      fontWeight: "bold",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    });

    fabricCanvas.add(rect);
    fabricCanvas.add(label);

    const newBooth: BoothObject = {
      id: crypto.randomUUID(),
      rect,
      label,
    };

    setBooths([...booths, newBooth]);
    setSelectedBooth(newBooth);

    rect.on("selected", () => {
      setSelectedBooth(newBooth);
    });

    rect.on("modified", () => {
      label.set({
        left: rect.left! + rect.width! * rect.scaleX! / 2,
        top: rect.top! + rect.height! * rect.scaleY! / 2,
      });
      fabricCanvas.renderAll();
    });

    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  }, [fabricCanvas, booths]);

  // Delete selected booth
  const deleteBooth = useCallback(() => {
    if (!fabricCanvas || !selectedBooth) return;

    fabricCanvas.remove(selectedBooth.rect);
    fabricCanvas.remove(selectedBooth.label);
    setBooths(booths.filter((b) => b.id !== selectedBooth.id));
    setSelectedBooth(null);
    fabricCanvas.renderAll();
    toast.success("Booth deleted");
  }, [fabricCanvas, selectedBooth, booths]);

  // Save all booths to database
  const saveBooths = useCallback(async (eventId: string) => {
    if (!fabricCanvas) return;

    setIsLoading(true);
    try {
      // Only save booths that have existing database records
      const updates = booths
        .filter(booth => booth.boothData?.id)
        .map((booth) => {
          const rect = booth.rect;
          return {
            id: booth.boothData.id,
            event_id: eventId,
            org_name: booth.boothData.org_name,
            x_position: rect.left,
            y_position: rect.top,
            booth_width: rect.width! * rect.scaleX!,
            booth_depth: rect.height! * rect.scaleY!,
          };
        });

      if (updates.length > 0) {
        // Batch update for efficiency
        const { error } = await supabase
          .from("booths")
          .upsert(updates);
          
        if (error) throw error;
        toast.success(`Saved ${updates.length} booth position(s)`);
      }
      
      // Warn about unsaved new booths
      const unsavedCount = booths.length - updates.length;
      if (unsavedCount > 0) {
        toast.warning(`${unsavedCount} new booth(s) need details before saving to database`);
      }
    } catch (error) {
      console.error("Error saving booths:", error);
      toast.error("Failed to save floor plan");
    } finally {
      setIsLoading(false);
    }
  }, [fabricCanvas, booths]);

  return {
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
  };
};
