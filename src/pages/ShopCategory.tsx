import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartIcon } from "@/components/shop/CartIcon";
import { Home, ShoppingBag } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  images: any;
  colors: any;
  category: string;
  product_type: string;
  stock_quantity: number;
}

export default function ShopCategory() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("shop_items")
        .select("*")
        .gt("stock_quantity", 0);

      if (categoryName !== "all") {
        query = query.eq("category", categoryName);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price_usd - b.price_usd;
      case "price-high":
        return b.price_usd - a.price_usd;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categoryTitle = categoryName === "all" 
    ? "All Products" 
    : `${categoryName?.toUpperCase()} Products`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-dark border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                aria-label="Go to home"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </button>
              <div className="hidden sm:flex items-center">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors">
                        Home
                      </button>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <button onClick={() => navigate("/shop")} className="text-gray-400 hover:text-white transition-colors">
                        Shop
                      </button>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white">{categoryTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h1 className="text-base sm:text-xl font-bold text-white truncate">{categoryTitle}</h1>
            </div>
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-300">
            {products.length} products found
          </p>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-dark rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-20 w-20 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2 text-white">No products found</h3>
            <p className="text-gray-300">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
