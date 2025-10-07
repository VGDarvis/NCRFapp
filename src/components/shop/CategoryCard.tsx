import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
    color: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/shop/category/${category.id}`)}
    >
      <div className={`h-48 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {category.description}
        </p>
        
        <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
          Shop Now
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
