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

export const useFloorPlanEditor = (floorPlanId: string | null, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<BoothObject | null>(null);
  const [booths, setBooths] = useState<BoothObject[]>([]);
  const [activeTool, setActiveTool] = useState<"select" | "draw">("select");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: "#f8f9fa",
      selection: true,
    });

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
      
      toast.success("Floor plan loaded");
    } catch (error) {
      console.error("Error loading floor plan:", error);
      toast.error("Failed to load floor plan");
    }
  }, [fabricCanvas]);

  // Load existing booths from database
  const loadBooths = useCallback(async (eventId: string) => {
    if (!fabricCanvas || !floorPlanId) return;

    setIsLoading(true);
    try {
      const { data: boothsData, error } = await supabase
        .from("booths")
        .select("*")
        .eq("event_id", eventId)
        .eq("floor_plan_id", floorPlanId);

      if (error) throw error;

      const loadedBooths: BoothObject[] = [];

      boothsData?.forEach((booth) => {
        if (booth.x_position && booth.y_position) {
          const rect = new Rect({
            left: Number(booth.x_position),
            top: Number(booth.y_position),
            width: Number(booth.booth_width || 60),
            height: Number(booth.booth_depth || 60),
            fill: booth.sponsor_tier === "gold" ? "rgba(255, 215, 0, 0.5)" : 
                  booth.sponsor_tier === "silver" ? "rgba(192, 192, 192, 0.5)" :
                  booth.sponsor_tier === "bronze" ? "rgba(205, 127, 50, 0.5)" :
                  "rgba(59, 130, 246, 0.5)",
            stroke: "#1e40af",
            strokeWidth: 2,
            cornerColor: "#3b82f6",
            cornerSize: 10,
            transparentCorners: false,
          });

          const label = new Text(booth.table_no || "---", {
            left: Number(booth.x_position) + Number(booth.booth_width || 60) / 2,
            top: Number(booth.y_position) + Number(booth.booth_depth || 60) / 2,
            fontSize: 14,
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
      toast.success(`Loaded ${loadedBooths.length} booths`);
    } catch (error) {
      console.error("Error loading booths:", error);
      toast.error("Failed to load booths");
    } finally {
      setIsLoading(false);
    }
  }, [fabricCanvas, floorPlanId]);

  // Add new booth
  const addBooth = useCallback((x: number = 100, y: number = 100) => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: x,
      top: y,
      width: 60,
      height: 60,
      fill: "rgba(59, 130, 246, 0.5)",
      stroke: "#1e40af",
      strokeWidth: 2,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      transparentCorners: false,
    });

    const label = new Text("New", {
      left: x + 30,
      top: y + 30,
      fontSize: 14,
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
    if (!fabricCanvas || !floorPlanId) return;

    setIsLoading(true);
    try {
      const updates = booths.map((booth) => {
        const rect = booth.rect;
        return {
          id: booth.boothData?.id,
          event_id: eventId,
          floor_plan_id: floorPlanId,
          x_position: rect.left,
          y_position: rect.top,
          booth_width: rect.width! * rect.scaleX!,
          booth_depth: rect.height! * rect.scaleY!,
          table_no: booth.boothData?.table_no || booth.label.text,
          org_name: booth.boothData?.org_name || "Unassigned",
        };
      });

      for (const update of updates) {
        if (update.id) {
          const { error } = await supabase
            .from("booths")
            .update({
              x_position: update.x_position,
              y_position: update.y_position,
              booth_width: update.booth_width,
              booth_depth: update.booth_depth,
            })
            .eq("id", update.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("booths")
            .insert(update);

          if (error) throw error;
        }
      }

      toast.success("Floor plan saved successfully");
    } catch (error) {
      console.error("Error saving booths:", error);
      toast.error("Failed to save floor plan");
    } finally {
      setIsLoading(false);
    }
  }, [fabricCanvas, booths, floorPlanId]);

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
