import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X, Route, MapPin, Smartphone } from "lucide-react";
import { BoothFavorite } from "@/hooks/useBoothFavorites";
import { Booth } from "@/hooks/useBooths";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MyFavoritesPanelProps {
  eventId: string;
  favorites: BoothFavorite[];
  booths: Booth[];
  onBoothClick: (boothId: string) => void;
  onRemoveFavorite: (boothId: string) => void;
  isGuest?: boolean;
}

export const MyFavoritesPanel = ({
  favorites,
  booths,
  onBoothClick,
  onRemoveFavorite,
  isGuest = false,
}: MyFavoritesPanelProps) => {
  const favoriteBooths = favorites
    .map(fav => booths.find(b => b.id === fav.booth_id))
    .filter(Boolean) as Booth[];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-warning text-warning" />
          <h3 className="font-semibold">My Favorites</h3>
          {isGuest && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1">
                    <Smartphone className="w-3 h-3" />
                    Device
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Saved on this device only</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Badge variant="secondary">{favorites.length}</Badge>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            No favorites yet. Click the star icon to save booths you want to visit.
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {favoriteBooths.map((booth) => (
                <Card
                  key={booth.id}
                  className="p-3 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onBoothClick(booth.id)}
                >
                  <div className="flex items-start gap-2">
                    {booth.logo_url && (
                      <img
                        src={booth.logo_url}
                        alt={booth.org_name}
                        className="w-10 h-10 object-contain rounded border bg-white"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{booth.org_name}</h4>
                      {booth.table_no && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          Table {booth.table_no}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(booth.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {favorites.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full gap-2" disabled>
                <Route className="w-4 h-4" />
                Optimize Route (Coming Soon)
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                AI-powered route optimization will help you visit all your favorites efficiently
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
