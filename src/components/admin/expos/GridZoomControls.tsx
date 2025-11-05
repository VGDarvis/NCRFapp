import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface GridZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const GridZoomControls = ({ onZoomIn, onZoomOut, onResetZoom }: GridZoomControlsProps) => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2 md:hidden z-10">
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomIn}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomOut}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        onClick={onResetZoom}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>
    </div>
  );
};
