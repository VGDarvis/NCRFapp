import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price_usd: number;
    images: any;
    colors?: any;
    stock_quantity: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const primaryImage = product.images?.front || Object.values(product.images || {})[0] || "";
  const colors = Array.isArray(product.colors) ? product.colors : [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-dark rounded-xl overflow-hidden cursor-pointer group border border-gray-800/50 hover:border-primary/30 transition-all"
      onClick={() => navigate(`/shop/product/${product.id}`)}
    >
      <div className="relative aspect-square bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300 product-glow"
          />
        </div>
        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold z-10">
            Only {product.stock_quantity} left!
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white font-semibold text-lg">View Details</div>
        </div>
      </div>

      <div className="p-4 bg-gray-900/80">
        <h3 className="font-semibold mb-1 line-clamp-2 text-white group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-primary">
            ${product.price_usd.toFixed(2)}
          </span>
          
          {colors.length > 0 && (
            <div className="flex gap-1">
              {colors.slice(0, 3).map((color: any, idx: number) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-gray-700"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {colors.length > 3 && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  +{colors.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          className="w-full mt-4"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/shop/product/${product.id}`);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Quick View
        </Button>
      </div>
    </motion.div>
  );
}
