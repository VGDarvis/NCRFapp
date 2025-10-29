import { Button } from "@/components/ui/button";
import { 
  ArrowUpLeft, ArrowUp, ArrowUpRight,
  ArrowLeft, Circle, ArrowRight,
  ArrowDownLeft, ArrowDown, ArrowDownRight
} from "lucide-react";

interface BoothQuickPositionProps {
  onPositionSelect: (x: number, y: number) => void;
  disabled?: boolean;
}

export const BoothQuickPosition = ({ onPositionSelect, disabled }: BoothQuickPositionProps) => {
  // Define preset positions based on 1200x800 canvas
  const positions = {
    topLeft: { x: 100, y: 100 },
    topCenter: { x: 600, y: 100 },
    topRight: { x: 1050, y: 100 },
    middleLeft: { x: 100, y: 400 },
    center: { x: 600, y: 400 },
    middleRight: { x: 1050, y: 400 },
    bottomLeft: { x: 100, y: 650 },
    bottomCenter: { x: 600, y: 650 },
    bottomRight: { x: 1050, y: 650 },
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Quick Position:</p>
      <div className="grid grid-cols-3 gap-2 max-w-[180px]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.topLeft.x, positions.topLeft.y)}
          disabled={disabled}
          title="Top Left"
        >
          <ArrowUpLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.topCenter.x, positions.topCenter.y)}
          disabled={disabled}
          title="Top Center"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.topRight.x, positions.topRight.y)}
          disabled={disabled}
          title="Top Right"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.middleLeft.x, positions.middleLeft.y)}
          disabled={disabled}
          title="Middle Left"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.center.x, positions.center.y)}
          disabled={disabled}
          title="Center"
        >
          <Circle className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.middleRight.x, positions.middleRight.y)}
          disabled={disabled}
          title="Middle Right"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.bottomLeft.x, positions.bottomLeft.y)}
          disabled={disabled}
          title="Bottom Left"
        >
          <ArrowDownLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.bottomCenter.x, positions.bottomCenter.y)}
          disabled={disabled}
          title="Bottom Center"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPositionSelect(positions.bottomRight.x, positions.bottomRight.y)}
          disabled={disabled}
          title="Bottom Right"
        >
          <ArrowDownRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
