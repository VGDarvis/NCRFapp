import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  product_id: string;
  shop_items: {
    name: string;
    price_usd: number;
    images: any;
  };
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchCartItems();
    }
  }, [open]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = localStorage.getItem("guest_session_id") || crypto.randomUUID();
      
      if (!user) {
        localStorage.setItem("guest_session_id", sessionId);
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          shop_items (
            name,
            price_usd,
            images
          )
        `)
        .or(user ? `user_id.eq.${user.id}` : `session_id.eq.${sessionId}`);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;
      await fetchCartItems();
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      await fetchCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.shop_items.price_usd * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-b from-gray-950 via-black to-gray-900 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Shopping Cart</SheetTitle>
          <SheetDescription className="text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {loading ? (
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 glass-dark p-4 rounded-lg">
                  <Skeleton className="w-20 h-20 rounded bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/5" />
                    <Skeleton className="h-7 w-32 bg-white/5" />
                  </div>
                  <Skeleton className="h-4 w-16 bg-white/5" />
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="relative mb-6">
                <ShoppingBag className="h-24 w-24 text-gray-600" />
                <Sparkles className="h-8 w-8 text-gold-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Your cart is empty</h3>
              <p className="text-gray-400 mb-8 max-w-xs">
                Start shopping and add items to your cart to get amazing apparel!
              </p>
              <Button 
                className="btn-gold"
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/shop");
                }}
              >
                Explore Shop
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const image = item.shop_items.images?.front || Object.values(item.shop_items.images || {})[0] || "";
                    return (
                      <div 
                        key={item.id} 
                        className="flex gap-4 glass-dark p-4 rounded-lg transition-all duration-300 hover:bg-white/10 animate-fade-in"
                      >
                        <div className="relative group">
                          <img
                            src={image}
                            alt={item.shop_items.name}
                            className="w-20 h-20 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 rounded bg-gold-400/0 group-hover:bg-gold-400/10 transition-colors duration-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 text-white">
                            {item.shop_items.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.selected_color} • {item.selected_size}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 touch-manipulation">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-7 sm:w-7 border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 active:scale-95"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity === 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center text-white">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-7 sm:w-7 border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 active:scale-95"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-7 sm:w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 active:scale-95"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ${(item.shop_items.price_usd * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? (
                      <span className="text-gold-400">FREE ✨</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 50 && subtotal > 0 && (
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Free shipping progress</span>
                      <span className="text-gray-400">${subtotal.toFixed(2)} / $50.00</span>
                    </div>
                    <Progress 
                      value={(subtotal / 50) * 100} 
                      className="h-2 bg-white/5"
                    />
                    <p className="text-xs text-gold-400">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping! 🚚
                    </p>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-gold-400">${total.toFixed(2)}</span>
                </div>
                
                <Button
                  className="w-full btn-gold mt-4 touch-manipulation"
                  size="lg"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/shop/checkout");
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
