import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Booth } from "@/hooks/useBooths";
import { BoothFavorite } from "@/hooks/useBoothFavorites";

interface BoothListProps {
  booths: Booth[];
  onBoothClick: (boothId: string) => void;
  favorites: BoothFavorite[];
  onToggleFavorite: (boothId: string) => void;
}

export const BoothList = ({
  booths,
  onBoothClick,
  favorites,
  onToggleFavorite,
}: BoothListProps) => {
  const isFavorite = (boothId: string) => favorites.some(f => f.booth_id === boothId);

  return (
    <div className="space-y-3">
      {booths.map((booth) => (
        <Card
          key={booth.id}
          className="p-4 hover:border-primary transition-colors cursor-pointer"
          onClick={() => onBoothClick(booth.id)}
        >
          <div className="flex items-start gap-4">
            {booth.logo_url && (
              <img
                src={booth.logo_url}
                alt={booth.org_name}
                className="w-16 h-16 object-contain rounded-lg border bg-white"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-lg truncate">{booth.org_name}</h3>
                  {booth.table_no && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      Table {booth.table_no}
                      {booth.zone && ` • Zone ${booth.zone}`}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(booth.id);
                  }}
                >
                  <Star className={isFavorite(booth.id) ? "fill-warning text-warning" : ""} />
                </Button>
              </div>

              {booth.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {booth.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {booth.org_type && (
                  <Badge variant="secondary">{booth.org_type}</Badge>
                )}
                {booth.offers_on_spot_admission && (
                  <Badge className="bg-success text-success-foreground">
                    On-Spot Admission
                  </Badge>
                )}
                {booth.waives_application_fee && (
                  <Badge className="bg-info text-info-foreground">
                    Fee Waiver
                  </Badge>
                )}
              </div>
            </div>

            {booth.website_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(booth.website_url!, "_blank");
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}

      {booths.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No booths found matching your search</p>
        </Card>
      )}
    </div>
  );
};
