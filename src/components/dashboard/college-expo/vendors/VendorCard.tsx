import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Star, ExternalLink, Heart, Map, Award, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface VendorCardProps {
  booth: {
    id: string;
    org_name: string;
    org_type: string;
    logo_url?: string;
    description?: string;
    table_no?: string;
    sponsor_tier?: string;
    website_url?: string;
    offers_on_spot_admission?: boolean;
    waives_application_fee?: boolean;
    scholarship_info?: string;
    contact_email?: string;
    sponsor?: {
      id: string;
      name: string;
      logo_url: string | null;
      website_url: string | null;
      contact_email: string | null;
      tier: string | null;
      org_type: string | null;
      city?: string;
      state?: string;
    };
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewFloorPlan: () => void;
}

export const VendorCard = ({ 
  booth, 
  isFavorite, 
  onToggleFavorite,
  onViewFloorPlan 
}: VendorCardProps) => {
  const getTierColor = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'bg-gradient-to-r from-slate-400 to-slate-200';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-200';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-200';
      case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-400';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {booth.sponsor_tier && (
        <div className={`h-2 ${getTierColor(booth.sponsor_tier)}`} />
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          {booth.logo_url ? (
            <img 
              src={booth.logo_url} 
              alt={booth.org_name}
              className="w-16 h-16 object-contain rounded-lg border"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-lg leading-tight">{booth.org_name}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFavorite}
                className="flex-shrink-0"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">{booth.org_type}</Badge>
              {booth.table_no && (
                <Badge variant="outline">Booth {booth.table_no}</Badge>
              )}
            </div>
            
            {booth.sponsor?.city && booth.sponsor?.state && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {booth.sponsor.city}, {booth.sponsor.state}
              </div>
            )}
          </div>
        </div>

        {booth.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {booth.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {booth.offers_on_spot_admission && (
            <Badge variant="default" className="gap-1">
              <Award className="w-3 h-3" />
              On-Spot Admission
            </Badge>
          )}
          {booth.waives_application_fee && (
            <Badge variant="default" className="gap-1">
              <DollarSign className="w-3 h-3" />
              Fee Waiver
            </Badge>
          )}
          {booth.scholarship_info && (
            <Badge variant="default" className="gap-1">
              <Star className="w-3 h-3" />
              Scholarships
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewFloorPlan}
            className="flex-1"
          >
            <Map className="w-4 h-4 mr-2" />
            View on Map
          </Button>
          {booth.website_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(booth.website_url, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Website
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
