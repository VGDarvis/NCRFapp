import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Zap, Gift, CreditCard, Star } from 'lucide-react';

interface ShopTabProps {
  user: User | null;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price_xp: number;
  price_usd: number;
  rarity: string;
  is_limited: boolean;
  stock_quantity: number;
  image_url: string;
}

export const ShopTab = ({ user }: ShopTabProps) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      fetchShopData();
    }
  }, [user]);

  const fetchShopData = async () => {
    if (!user) return;

    try {
      // Fetch shop items
      const { data: items } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Fetch user XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp_balance')
        .eq('user_id', user.id)
        .single();

      setShopItems(items || []);
      setUserXP(profile?.xp_balance || 0);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-blue-400 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white';
      case 'uncommon': return 'bg-gradient-to-r from-green-400 to-emerald-400 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const categories = ['all', 'cosmetics', 'boosters', 'merchandise', 'exclusive'];
  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-6">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          <span className="text-primary cyber-text-glow">XP Shop</span>
        </h1>
        <p className="text-muted-foreground">
          Spend your XP on exclusive HBCU merchandise and items
        </p>
      </div>

      {/* XP Balance */}
      <Card className="glass-cyber border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 glass-light rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-2xl font-bold text-foreground">{userXP.toLocaleString()} XP</p>
              </div>
            </div>
            <Button variant="outline" className="glass-light border-primary/20">
              <CreditCard className="h-4 w-4 mr-2" />
              Buy XP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="glass-light w-full">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="capitalize data-[state=active]:glass-cyber data-[state=active]:text-primary"
            >
              {category === 'all' ? 'All Items' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          {/* Featured Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Featured Items
            </h3>
            
            {filteredItems.length === 0 ? (
              <Card className="glass-light">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No items available in this category</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="glass-light border-primary/10 hover:glass-medium transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Item Image Placeholder */}
                        <div className="w-16 h-16 glass-cyber rounded-lg flex items-center justify-center">
                          <Gift className="h-8 w-8 text-primary" />
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {item.price_xp > 0 && (
                                <div className="flex items-center gap-1">
                                  <Zap className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-foreground">
                                    {item.price_xp.toLocaleString()} XP
                                  </span>
                                </div>
                              )}
                              {item.price_usd > 0 && (
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4 text-accent" />
                                  <span className="font-medium text-foreground">
                                    ${item.price_usd}
                                  </span>
                                </div>
                              )}
                            </div>

                            {item.is_limited && (
                              <Badge variant="outline" className="text-xs">
                                Limited: {item.stock_quantity} left
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-4 glass-light border-primary/20 hover:glass-cyber"
                        disabled={item.price_xp > userXP || (item.is_limited && item.stock_quantity === 0)}
                      >
                        {item.price_xp > userXP ? 'Insufficient XP' : 
                         item.is_limited && item.stock_quantity === 0 ? 'Out of Stock' : 
                         'Purchase'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Payout Section */}
      <Card className="glass-light border-primary/10">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            Cash Out XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Convert your XP to real money. Minimum payout: 5,000 XP ($5.00)
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">{userXP.toLocaleString()} XP</p>
              <p className="text-sm text-muted-foreground">≈ ${(userXP * 0.001).toFixed(2)} USD</p>
            </div>
            <Button 
              variant="outline" 
              className="glass-light border-accent/20 hover:bg-accent/10"
              disabled={userXP < 5000}
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};