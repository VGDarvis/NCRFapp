import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VendorCard } from "./vendors/VendorCard";
import { VendorFilters } from "./vendors/VendorFilters";
import { useBooths } from "@/hooks/useBooths";
import { useBoothFavorites } from "@/hooks/useBoothFavorites";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "sonner";
import { format } from "date-fns";

interface VendorsTabV2Props {
  onSwitchToFloorPlan?: (boothId: string) => void;
}

export const VendorsTabV2 = ({ onSwitchToFloorPlan }: VendorsTabV2Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgType, setSelectedOrgType] = useState<string | null>(null);
  const [showSpecialFeatures, setShowSpecialFeatures] = useState(false);
  const [overrideEventId, setOverrideEventId] = useState<string | null>(null);

  const { activeEvent } = useActiveEvent();
  const { events: allEvents } = useEvents();

  const expoEvents = allEvents?.filter(e => 
    e.event_type === 'college_expo' || e.event_type === 'expo' || e.category?.includes('expo')
  ) || [];

  const overrideEvent = overrideEventId ? expoEvents.find(e => e.id === overrideEventId) : null;
  const eventId = overrideEvent?.id || activeEvent?.id || null;

  // Normalized display values
  const displayName = overrideEvent?.title || (activeEvent as any)?.name || "Expo";
  const startAt = overrideEvent?.start_at || activeEvent?.start_at || null;
  const endAt = overrideEvent?.end_at || activeEvent?.end_at || null;
  const isEventPast = endAt ? new Date(endAt) < new Date() : false;

  const { data: booths, isLoading } = useBooths(eventId, {
    search: searchTerm,
    org_type: selectedOrgType ? [selectedOrgType] : undefined,
  });

  const { favorites, addFavorite, removeFavorite, isFavorite } = useBoothFavorites(eventId);

  const handleToggleFavorite = async (boothId: string) => {
    if (!eventId) {
      toast.error("No event selected");
      return;
    }
    if (isFavorite(boothId)) {
      await removeFavorite.mutateAsync({ boothId, eventId });
    } else {
      await addFavorite.mutateAsync({ boothId, eventId });
    }
  };

  const filteredBooths = booths?.filter(booth => {
    if (showSpecialFeatures) {
      return booth.offers_on_spot_admission || booth.waives_application_fee;
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading exhibitors...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {/* Event header with expo selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          {expoEvents.length > 1 ? (
            <Select
              value={eventId || ""}
              onValueChange={(val) => setOverrideEventId(val)}
            >
              <SelectTrigger className="w-full sm:w-[320px]">
                <SelectValue placeholder="Select an expo" />
              </SelectTrigger>
              <SelectContent>
                {expoEvents.map((event) => {
                  const isPast = event.end_at ? new Date(event.end_at) < new Date() : false;
                  return (
                    <SelectItem key={event.id} value={event.id}>
                      <div className="flex items-center gap-2">
                        <span>{event.title}</span>
                        {isPast && <Badge variant="outline" className="text-xs">Past</Badge>}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <h2 className="text-2xl font-bold">{displayName}</h2>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {isEventPast ? (
              <Badge variant="outline" className="text-muted-foreground">Past Event</Badge>
            ) : (
              <Badge className="bg-primary text-primary-foreground">Upcoming</Badge>
            )}
            {startAt && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(startAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        <p className="text-muted-foreground">
          Explore {filteredBooths.length} colleges, universities, and organizations attending {displayName}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <VendorFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrgType={selectedOrgType}
              onOrgTypeChange={setSelectedOrgType}
              showSpecialFeatures={showSpecialFeatures}
              onToggleSpecialFeatures={() => setShowSpecialFeatures(!showSpecialFeatures)}
            />
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {filteredBooths.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredBooths.map(booth => (
                <VendorCard
                  key={booth.id}
                  booth={booth}
                  isFavorite={isFavorite(booth.id)}
                  onToggleFavorite={() => handleToggleFavorite(booth.id)}
                  onViewFloorPlan={() => onSwitchToFloorPlan?.(booth.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Vendors Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};