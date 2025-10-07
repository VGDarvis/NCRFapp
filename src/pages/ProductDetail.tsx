import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ColorSelector } from "@/components/shop/ColorSelector";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { CartIcon } from "@/components/shop/CartIcon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, ShoppingCart, Minus, Plus, Package, Truck, RotateCcw, Ruler } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      setProduct(data);
      
      // Set defaults
      const colors = Array.isArray(data.colors) ? data.colors : [];
      if (colors.length > 0 && typeof colors[0] === 'object' && colors[0] !== null && 'name' in colors[0]) {
        setSelectedColor((colors[0] as any).name);
      }
      if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    setAddingToCart(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = localStorage.getItem("guest_session_id") || crypto.randomUUID();
      
      if (!user) {
        localStorage.setItem("guest_session_id", sessionId);
      }

      // Check if item already exists in cart
      const { data: existing } = await supabase
        .from("cart_items")
        .select("*")
        .eq("product_id", productId)
        .eq("selected_size", selectedSize)
        .eq("selected_color", selectedColor)
        .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`)
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user?.id,
            session_id: !user ? sessionId : null,
            product_id: productId,
            quantity,
            selected_size: selectedSize,
            selected_color: selectedColor,
          });

        if (error) throw error;
      }

      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-dark border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group flex-shrink-0"
                aria-label="Go to home"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </button>
              <div className="hidden sm:flex items-center min-w-0">
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
                      <BreadcrumbPage className="text-white truncate max-w-[200px]">
                        {product.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
              <p className="text-4xl font-bold text-primary">${product.price_usd.toFixed(2)}</p>
            </div>

            {product.description && (
              <p className="text-gray-300">{product.description}</p>
            )}

            {/* Color Selection */}
            {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            )}

            {/* Size Selection */}
            {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center text-white">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Info */}
            {product.stock_quantity < 10 && (
              <p className="text-sm text-destructive font-medium">
                Only {product.stock_quantity} left in stock!
              </p>
            )}

            {/* Add to Cart Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full btn-gold h-14 text-lg font-semibold"
                onClick={addToCart}
                disabled={addingToCart || !selectedSize || !selectedColor}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </motion.div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
                <TabsTrigger value="size-guide" className="flex-1">Size Guide</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-6">
                <div className="glass-dark p-6 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Materials</h4>
                      <p className="text-sm text-gray-300">
                        {product.material_info || "100% Premium Cotton"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Care Instructions</h4>
                      <p className="text-sm text-gray-300">
                        Machine wash cold. Tumble dry low. Do not bleach.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4 mt-6">
                <div className="glass-dark p-6 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Shipping Info</h4>
                      <p className="text-sm text-gray-300">
                        {product.shipping_info || "Ships within 2-3 business days. Free shipping on orders over $50."}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2 text-gray-300">
                    <p>• Standard Shipping: 5-7 business days - $5.99</p>
                    <p>• Express Shipping: 2-3 business days - $12.99</p>
                    <p>• FREE Shipping on orders over $50</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="size-guide" className="space-y-4 mt-6">
                <div className="glass-dark p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-white">Size Guide</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-white">Size</th>
                          <th className="text-left py-2 text-white">Chest (inches)</th>
                          <th className="text-left py-2 text-white">Length (inches)</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-b border-gray-700"><td className="py-2">S</td><td>34-36</td><td>28</td></tr>
                        <tr className="border-b border-gray-700"><td className="py-2">M</td><td>38-40</td><td>29</td></tr>
                        <tr className="border-b border-gray-700"><td className="py-2">L</td><td>42-44</td><td>30</td></tr>
                        <tr className="border-b border-gray-700"><td className="py-2">XL</td><td>46-48</td><td>31</td></tr>
                        <tr className="border-b border-gray-700"><td className="py-2">2XL</td><td>50-52</td><td>32</td></tr>
                        <tr><td className="py-2">3XL</td><td>54-56</td><td>33</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    * Measurements are approximate. Fits true to size.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
