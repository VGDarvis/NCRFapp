import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Rect, Text, FabricImage, Shadow, Point } from "fabric";
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
  const [isSaving, setIsSaving] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);
  const [lastUserInteraction, setLastUserInteraction] = useState(0);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,  // Fixed size to match attendee viewer SVG
      height: 800,  // Fixed size to match attendee viewer SVG
      backgroundColor: "#f8f9fa",
      selection: true,
      enablePointerEvents: true,
      stopContextMenu: true,
      renderOnAddRemove: !isMobile,
      perPixelTargetFind: !isMobile,
    });

    // Enable touch gestures
    canvas.allowTouchScrolling = true;
    canvas.targetFindTolerance = isMobile ? 15 : 10;

    // Add pinch-to-zoom for mobile using mouse wheel event as proxy
    let lastDistance = 0;
    let isPinching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching = true;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (lastDistance > 0) {
          const delta = distance - lastDistance;
          const zoom = canvas.getZoom();
          let newZoom = zoom + delta / 500;
          newZoom = Math.max(0.5, Math.min(3, newZoom));
          
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          canvas.zoomToPoint(new Point(centerX, centerY), newZoom);
        }
        lastDistance = distance;
      }
    };

    const handleTouchEnd = () => {
      isPinching = false;
      lastDistance = 0;
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvasRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvasRef.current.addEventListener('touchend', handleTouchEnd);
    }

    console.log("✅ Fabric.js canvas initialized", { width: 1200, height: 800 });
    setFabricCanvas(canvas);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', handleTouchStart);
        canvasRef.current.removeEventListener('touchmove', handleTouchMove);
        canvasRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      console.log("🧹 Cleaning up Fabric.js canvas");
      canvas.dispose();
    };
  }, [canvasRef]);

  // Load floor plan background
  const loadFloorPlanBackground = useCallback(async (imageUrl: string) => {
    if (!fabricCanvas) {
      console.warn("⚠️ Cannot load background: Canvas not ready");
      return;
    }

    console.log("🖼️ Loading floor plan image:", imageUrl);
    
    try {
      const img = await FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });

      if (!img) {
        throw new Error("Failed to load image from URL");
      }

      console.log("✅ Image loaded successfully", {
        width: img.width,
        height: img.height,
      });
      
      // Scale image to fit canvas
      const scaleX = (fabricCanvas.width || 1200) / (img.width || 1);
      const scaleY = (fabricCanvas.height || 800) / (img.height || 1);
      const scale = Math.min(scaleX, scaleY) * 0.9;
      
      img.scale(scale);
      img.set({
        left: ((fabricCanvas.width || 1200) - (img.width || 0) * scale) / 2,
        top: ((fabricCanvas.height || 800) - (img.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      });

      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
      
      console.log('✅ Floor plan background set on canvas');
      toast.success("Floor plan loaded");
    } catch (error) {
      console.error("❌ Error loading floor plan background:", error);
      toast.error("Failed to load floor plan image. Please refresh the page.");
    }
  }, [fabricCanvas]);

  // Load existing booths from database
  const loadBooths = useCallback(async (eventId: string) => {
    if (!fabricCanvas) return;
    
    // Only skip reload if user recently made changes (within 3 seconds) to allow realtime updates
    if (Date.now() - lastUserInteraction < 3000) {
      console.log("⏸️ Skipping reload - user recently made changes");
      return;
    }

    setIsLoading(true);
    try {
      const { data: boothsData, error } = await supabase
        .from("booths")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;

      const loadedBooths: BoothObject[] = [];

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      boothsData?.forEach((booth) => {
        if (booth.x_position && booth.y_position) {
          const tierColor = booth.sponsor_tier === "gold" ? "rgba(255, 215, 0, 0.7)" : 
                  booth.sponsor_tier === "silver" ? "rgba(192, 192, 192, 0.7)" :
                  booth.sponsor_tier === "bronze" ? "rgba(205, 127, 50, 0.7)" :
                  "rgba(59, 130, 246, 0.7)";
          
          const rect = new Rect({
            left: Number(booth.x_position),
            top: Number(booth.y_position),
            width: Number(booth.booth_width || 120),
            height: Number(booth.booth_depth || 120),
            fill: tierColor,
            stroke: "#1e40af",
            strokeWidth: isMobile ? 2 : 3,
            cornerColor: "#3b82f6",
            cornerSize: isMobile ? 20 : 12,
            transparentCorners: false,
            padding: isMobile ? 20 : 10,
            hasControls: true,
            hasBorders: true,
            shadow: isMobile ? undefined : new Shadow({ blur: 4, color: 'rgba(0,0,0,0.2)', offsetX: 2, offsetY: 2 }),
          });

          const label = new Text(booth.table_no || "---", {
            left: Number(booth.x_position) + Number(booth.booth_width || 100) / 2,
            top: Number(booth.y_position) + Number(booth.booth_depth || 100) / 2,
            fontSize: 20,
            fill: "#1e40af",
            fontWeight: "bold",
            stroke: "#ffffff",
            strokeWidth: 3,
            paintFirst: "stroke",
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
          });

          fabricCanvas.add(rect);
          fabricCanvas.add(label);

          const boothObject = {
            id: booth.id,
            rect,
            label,
            boothData: booth,
          };

          loadedBooths.push(boothObject);

          // Hover effect
          rect.on("mouseover", () => {
            rect.set({ strokeWidth: 5, shadow: new Shadow({ blur: 8, color: "rgba(0,0,0,0.3)", offsetX: 0, offsetY: 4 }) });
            fabricCanvas.renderAll();
          });

          rect.on("mouseout", () => {
            rect.set({ strokeWidth: 3, shadow: null });
            fabricCanvas.renderAll();
          });

          rect.on("selected", () => {
            setSelectedBooth(boothObject);
          });

          // Auto-save on position change
          rect.on("modified", () => {
            setLastUserInteraction(Date.now()); // Track user interaction for realtime sync
            
            label.set({
              left: rect.left! + (rect.width! * (rect.scaleX || 1)) / 2,
              top: rect.top! + (rect.height! * (rect.scaleY || 1)) / 2,
            });
            fabricCanvas.renderAll();
            
            // Trigger auto-save with debounce (only if not already saving)
            if (eventId && !isSaving) {
          if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const saveDelay = isMobile ? 3000 : 2000; // Longer delay on mobile
          
          autoSaveTimeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            
            // Disable object interaction during save
            loadedBooths.forEach(b => {
              b.rect.set({ selectable: false, evented: false });
            });
            fabricCanvas.renderAll();
            
            console.log("💾 Auto-saving booth positions...");
            toast.loading("Auto-saving positions...", { id: "auto-save" });
                
                // Disable object modification during save
                fabricCanvas.forEachObject((obj) => {
                  if (obj.type === "rect") {
                    obj.set({ selectable: false, evented: false });
                  }
                });
                
                // Perform save inline
                const updates = loadedBooths
                  .filter(b => b.boothData?.id)
                  .map((b) => ({
                    id: b.boothData.id,
                    event_id: eventId,
                    org_name: b.boothData.org_name,
                    x_position: b.rect.left,
                    y_position: b.rect.top,
                    booth_width: b.rect.width! * (b.rect.scaleX || 1),
                    booth_depth: b.rect.height! * (b.rect.scaleY || 1),
                  }));

                if (updates.length > 0) {
                  const { error } = await supabase
                    .from("booths")
                    .upsert(updates);
                    
                  if (error) {
                    console.error("Auto-save error:", error);
                    toast.error("Auto-save failed", { id: "auto-save" });
                  } else {
                    toast.success("Positions saved! Updates broadcasting...", { id: "auto-save" });
                  }
                }
                
                // Re-enable object modification after save
                fabricCanvas.forEachObject((obj) => {
                  if (obj.type === "rect") {
                    obj.set({ selectable: true, evented: true });
                  }
                });
                
                // Re-enable booth interaction
                loadedBooths.forEach(b => {
                  b.rect.set({ selectable: true, evented: true });
                });
                fabricCanvas.renderAll();
                
                setIsSaving(false);
              }, saveDelay);
            }
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
  }, [fabricCanvas, setBooths, setIsLoading, lastUserInteraction]);

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
