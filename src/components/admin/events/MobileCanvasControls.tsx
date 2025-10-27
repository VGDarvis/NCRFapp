import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { Canvas as FabricCanvas } from "fabric";

interface MobileCanvasControlsProps {
  canvas: FabricCanvas | null;
  isPanMode: boolean;
  onTogglePanMode: () => void;
}

export const MobileCanvasControls = ({ canvas, isPanMode, onTogglePanMode }: MobileCanvasControlsProps) => {
  const handleZoomIn = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.2);
    canvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 0.8);
    canvas.renderAll();
  };

  const handleResetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.renderAll();
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2 md:hidden z-10">
      <Button
        variant={isPanMode ? "default" : "secondary"}
        size="icon"
        onClick={onTogglePanMode}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <Move className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={handleZoomIn}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={handleZoomOut}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={handleResetZoom}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>
    </div>
  );
};
