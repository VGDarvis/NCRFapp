import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MapFilters {
  orgTypes: string[];
  tiers: string[];
  distanceRadius: number;
}

interface MapFilterSidebarProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  className?: string;
}

export const MapFilterSidebar = ({
  filters,
  onFiltersChange,
  userLocation,
  className,
}: MapFilterSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const orgTypes = [
    { value: "university", label: "Universities" },
    { value: "community_college", label: "Community Colleges" },
    { value: "trade_school", label: "Trade Schools" },
    { value: "military", label: "Military" },
    { value: "corporate", label: "Corporate" },
  ];

  const tiers = [
    { value: "platinum", label: "Platinum" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
  ];

  const handleOrgTypeToggle = (value: string) => {
    const newOrgTypes = filters.orgTypes.includes(value)
      ? filters.orgTypes.filter((t) => t !== value)
      : [...filters.orgTypes, value];
    onFiltersChange({ ...filters, orgTypes: newOrgTypes });
  };

  const handleTierToggle = (value: string) => {
    const newTiers = filters.tiers.includes(value)
      ? filters.tiers.filter((t) => t !== value)
      : [...filters.tiers, value];
    onFiltersChange({ ...filters, tiers: newTiers });
  };

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({ ...filters, distanceRadius: value[0] });
  };

  const resetFilters = () => {
    onFiltersChange({
      orgTypes: [],
      tiers: [],
      distanceRadius: 100,
    });
  };

  const hasActiveFilters =
    filters.orgTypes.length > 0 ||
    filters.tiers.length > 0 ||
    filters.distanceRadius < 100;

  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Organization Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Organization Type</Label>
            <div className="space-y-2">
              {orgTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={filters.orgTypes.includes(type.value)}
                    onCheckedChange={() => handleOrgTypeToggle(type.value)}
                  />
                  <label
                    htmlFor={type.value}
                    className="text-sm cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsor Tier */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sponsor Tier</Label>
            <div className="space-y-2">
              {tiers.map((tier) => (
                <div key={tier.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={tier.value}
                    checked={filters.tiers.includes(tier.value)}
                    onCheckedChange={() => handleTierToggle(tier.value)}
                  />
                  <label htmlFor={tier.value} className="text-sm cursor-pointer">
                    {tier.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Distance */}
          {userLocation && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Distance: {filters.distanceRadius}mi
              </Label>
              <Slider
                value={[filters.distanceRadius]}
                onValueChange={handleDistanceChange}
                min={10}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10mi</span>
                <span>100mi</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
