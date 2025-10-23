import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface VendorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedOrgType: string | null;
  onOrgTypeChange: (type: string | null) => void;
  selectedTier: string | null;
  onTierChange: (tier: string | null) => void;
  showSpecialFeatures: boolean;
  onToggleSpecialFeatures: () => void;
}

const ORG_TYPES = [
  'University',
  'Community College',
  'HBCU',
  'Trade School',
  'Military',
  'Scholarship Org'
];

const SPONSOR_TIERS = [
  'Platinum',
  'Gold',
  'Silver',
  'Bronze'
];

export const VendorFilters = ({
  searchTerm,
  onSearchChange,
  selectedOrgType,
  onOrgTypeChange,
  selectedTier,
  onTierChange,
  showSpecialFeatures,
  onToggleSpecialFeatures
}: VendorFiltersProps) => {
  const hasActiveFilters = selectedOrgType || selectedTier || showSpecialFeatures;

  const clearAllFilters = () => {
    onSearchChange('');
    onOrgTypeChange(null);
    onTierChange(null);
    if (showSpecialFeatures) onToggleSpecialFeatures();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search colleges, majors, location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Organization Type</h4>
          <div className="flex flex-wrap gap-2">
            {ORG_TYPES.map(type => (
              <Badge
                key={type}
                variant={selectedOrgType === type ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
                onClick={() => onOrgTypeChange(selectedOrgType === type ? null : type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Sponsor Tier</h4>
          <div className="flex flex-wrap gap-2">
            {SPONSOR_TIERS.map(tier => (
              <Badge
                key={tier}
                variant={selectedTier === tier ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
                onClick={() => onTierChange(selectedTier === tier ? null : tier)}
              >
                {tier}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Special Features</h4>
          <Badge
            variant={showSpecialFeatures ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent"
            onClick={onToggleSpecialFeatures}
          >
            Fee Waivers & On-Spot Admission
          </Badge>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};
