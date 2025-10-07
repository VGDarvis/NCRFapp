import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Color {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Color: <span className="text-primary">{selectedColor}</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectColor(color.name)}
            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
              selectedColor === color.name
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50"
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {selectedColor === color.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="h-6 w-6 text-white drop-shadow-lg" strokeWidth={3} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
