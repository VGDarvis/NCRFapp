import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Move, MousePointer } from "lucide-react";
import { Canvas as FabricCanvas } from "fabric";
import { Badge } from "@/components/ui/badge";

interface MobileCanvasControlsProps {
  canvas: FabricCanvas | null;
  isPanMode: boolean;
  onTogglePanMode: () => void;
  zoom?: number;
}

export const MobileCanvasControls = ({ canvas, isPanMode, onTogglePanMode, zoom = 1 }: MobileCanvasControlsProps) => {
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
    <div className="fixed bottom-4 left-0 right-0 md:hidden z-50 px-4">
      <div className="bg-background/95 backdrop-blur-sm border rounded-2xl shadow-2xl p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Mode Toggle */}
          <Button
            variant={isPanMode ? "default" : "secondary"}
            size="lg"
            onClick={onTogglePanMode}
            className="h-14 flex-1 text-base font-medium"
          >
            {isPanMode ? (
              <>
                <Move className="h-5 w-5 mr-2" />
                Pan
              </>
            ) : (
              <>
                <MousePointer className="h-5 w-5 mr-2" />
                Select
              </>
            )}
          </Button>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              className="h-14 w-14 rounded-xl"
            >
              <ZoomOut className="h-6 w-6" />
            </Button>
            
            <Badge 
              variant="secondary" 
              className="h-14 min-w-[60px] flex items-center justify-center text-base font-semibold px-3"
            >
              {Math.round(zoom * 100)}%
            </Badge>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              className="h-14 w-14 rounded-xl"
            >
              <ZoomIn className="h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetZoom}
              className="h-14 w-14 rounded-xl"
              title="Fit to Screen"
            >
              <Maximize2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
