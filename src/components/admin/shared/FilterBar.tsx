import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    key: string;
    label: string;
    options: FilterOption[];
  }[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="glass-medium border-primary/20 gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear all
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 p-4 rounded-lg glass-medium border border-primary/20 animate-fade-in">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-sm font-medium text-foreground">{filter.label}</label>
              <Select
                value={activeFilters[filter.key] || ""}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="glass-medium border-primary/20">
                  <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="glass-premium">
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
