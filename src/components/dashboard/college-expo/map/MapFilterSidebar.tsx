import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MapFilters {
  orgTypes: string[];
  sortBy: 'asc' | 'desc' | 'featured' | 'university' | 'college';
}

interface MapFilterSidebarProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  className?: string;
}

export const MapFilterSidebar = ({
  filters,
  onFiltersChange,
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

  const handleOrgTypeToggle = (value: string) => {
    const newOrgTypes = filters.orgTypes.includes(value)
      ? filters.orgTypes.filter((t) => t !== value)
      : [...filters.orgTypes, value];
    onFiltersChange({ ...filters, orgTypes: newOrgTypes });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value as MapFilters['sortBy'] });
  };

  const resetFilters = () => {
    onFiltersChange({
      orgTypes: [],
      sortBy: 'asc',
    });
  };

  const hasActiveFilters =
    filters.orgTypes.length > 0 ||
    filters.sortBy !== 'asc';

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

          {/* Sort Order */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort Order</Label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A-Z (Alphabetical)</SelectItem>
                <SelectItem value="desc">Z-A (Reverse)</SelectItem>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="university">Universities First</SelectItem>
                <SelectItem value="college">Colleges First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
