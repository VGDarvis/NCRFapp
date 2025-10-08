import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchFilters } from "@/hooks/useAISearch";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleFilterUpdate = (key: keyof SearchFilters, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleClearAll = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <Card className="p-6 glass-premium">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Type */}
        <div className="space-y-2">
          <Label>Search Type</Label>
          <Select
            value={localFilters.search_type || "all"}
            onValueChange={(value) => handleFilterUpdate("search_type", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="schools">Schools</SelectItem>
              <SelectItem value="scholarships">Scholarships</SelectItem>
              <SelectItem value="youth_services">Youth Services</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Institution Type */}
        <div className="space-y-2">
          <Label>Institution Type</Label>
          <Select
            value={localFilters.institution_type || "all"}
            onValueChange={(value) => handleFilterUpdate("institution_type", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Institutions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              <SelectItem value="college">Colleges</SelectItem>
              <SelectItem value="high_school">High Schools</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            placeholder="e.g., California"
            value={localFilters.state || ""}
            onChange={(e) => handleFilterUpdate("state", e.target.value || undefined)}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            placeholder="e.g., Los Angeles"
            value={localFilters.city || ""}
            onChange={(e) => handleFilterUpdate("city", e.target.value || undefined)}
          />
        </div>

        {/* Enrollment Range */}
        <div className="space-y-2">
          <Label>Min Enrollment</Label>
          <Input
            type="number"
            placeholder="e.g., 1000"
            value={localFilters.min_enrollment || ""}
            onChange={(e) => handleFilterUpdate("min_enrollment", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Enrollment</Label>
          <Input
            type="number"
            placeholder="e.g., 10000"
            value={localFilters.max_enrollment || ""}
            onChange={(e) => handleFilterUpdate("max_enrollment", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        {/* Scholarship Amount */}
        {localFilters.search_type === "scholarships" && (
          <>
            <div className="space-y-2">
              <Label>Min Scholarship Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={localFilters.scholarship_min_amount || ""}
                onChange={(e) => handleFilterUpdate("scholarship_min_amount", e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Scholarship Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 50000"
                value={localFilters.scholarship_max_amount || ""}
                onChange={(e) => handleFilterUpdate("scholarship_max_amount", e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </>
        )}

        {/* Athletic Division */}
        <div className="space-y-2">
          <Label>Athletic Division</Label>
          <Select
            value={localFilters.athletic_division || "any"}
            onValueChange={(value) => handleFilterUpdate("athletic_division", value === "any" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Division</SelectItem>
              <SelectItem value="Division I">Division I</SelectItem>
              <SelectItem value="Division II">Division II</SelectItem>
              <SelectItem value="Division III">Division III</SelectItem>
              <SelectItem value="NAIA">NAIA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
