import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search } from "lucide-react";
import { SearchFilters } from "@/hooks/useAISearch";

interface SearchStatsProps {
  totalResults: number;
  duration: number;
  filters: SearchFilters;
}

export function SearchStats({ totalResults, duration, filters }: SearchStatsProps) {
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof SearchFilters] !== undefined
  ).length;

  return (
    <Card className="p-4 glass-light border-border/40">
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span className="font-medium text-foreground">
            {totalResults.toLocaleString()}
          </span>
          <span>results found</span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{(duration / 1000).toFixed(2)}s</span>
        </div>

        {activeFiltersCount > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
              </Badge>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
