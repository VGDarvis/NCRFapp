import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Building2 } from "lucide-react";
import { VendorCard } from "./vendors/VendorCard";
import { VendorFilters } from "./vendors/VendorFilters";
import { useBooths } from "@/hooks/useBooths";
import { useBoothFavorites } from "@/hooks/useBoothFavorites";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { toast } from "sonner";

interface VendorsTabV2Props {
  onSwitchToFloorPlan?: (boothId: string) => void;
}

export const VendorsTabV2 = ({ onSwitchToFloorPlan }: VendorsTabV2Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgType, setSelectedOrgType] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showSpecialFeatures, setShowSpecialFeatures] = useState(false);

  // Use activeEvent hook for real-time updates
  const { activeEvent } = useActiveEvent();
  const eventId = activeEvent?.id || null;

  const { data: booths, isLoading } = useBooths(eventId, {
    search: searchTerm,
    org_type: selectedOrgType ? [selectedOrgType] : undefined,
    tier: selectedTier ? [selectedTier] : undefined,
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

  // Sort to show featured/platinum sponsors first
  const sortedBooths = [...filteredBooths].sort((a, b) => {
    const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
    const aTier = a.sponsor_tier?.toLowerCase() as keyof typeof tierOrder;
    const bTier = b.sponsor_tier?.toLowerCase() as keyof typeof tierOrder;
    return (tierOrder[aTier] ?? 999) - (tierOrder[bTier] ?? 999);
  });

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
        <h2 className="text-3xl font-bold mb-2">Exhibitors & Vendors</h2>
        <p className="text-muted-foreground">
          Explore {sortedBooths.length} colleges, universities, and organizations attending the expo
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
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              showSpecialFeatures={showSpecialFeatures}
              onToggleSpecialFeatures={() => setShowSpecialFeatures(!showSpecialFeatures)}
            />
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {sortedBooths.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedBooths.map(booth => (
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
