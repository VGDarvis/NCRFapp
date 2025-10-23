import { MapPin, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VenuePopupProps {
  type: "venue";
  name: string;
  address: string;
  eventCount?: number;
  onViewDetails: () => void;
}

interface BoothPopupProps {
  type: "booth";
  name: string;
  tier: string | null;
  boothNumber: string | null;
  description?: string | null;
  onViewDetails: () => void;
}

type MapMarkerPopupProps = VenuePopupProps | BoothPopupProps;

export const MapMarkerPopup = (props: MapMarkerPopupProps) => {
  if (props.type === "venue") {
    return (
      <div className="p-3 min-w-[250px]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{props.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{props.address}</p>
            {props.eventCount && (
              <Badge variant="secondary" className="text-xs">
                {props.eventCount} {props.eventCount === 1 ? "event" : "events"}
              </Badge>
            )}
          </div>
        </div>
        <Button
          size="sm"
          className="w-full mt-3"
          onClick={props.onViewDetails}
        >
          View Event Details
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 min-w-[250px]">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${
            props.tier === "platinum"
              ? "from-yellow-400 to-yellow-600"
              : props.tier === "gold"
              ? "from-amber-400 to-amber-600"
              : props.tier === "silver"
              ? "from-gray-300 to-gray-500"
              : "from-blue-400 to-blue-600"
          } rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{props.name}</h4>
          <div className="flex items-center gap-2 mb-2">
            {props.tier && (
              <Badge variant="secondary" className="text-xs capitalize">
                {props.tier}
              </Badge>
            )}
            {props.boothNumber && (
              <Badge variant="outline" className="text-xs">
                Booth {props.boothNumber}
              </Badge>
            )}
          </div>
          {props.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {props.description}
            </p>
          )}
        </div>
      </div>
      <Button
        size="sm"
        className="w-full mt-3"
        onClick={props.onViewDetails}
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        View Booth Details
      </Button>
    </div>
  );
};
