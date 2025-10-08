import { useState } from "react";
import { SearchBar } from "@/components/school-finder/SearchBar";
import { FilterPanel } from "@/components/school-finder/FilterPanel";
import { SearchStats } from "@/components/school-finder/SearchStats";
import { EmptyState } from "@/components/school-finder/EmptyState";
import { useAISearch, SearchFilters } from "@/hooks/useAISearch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminResultCard } from "./AdminResultCard";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { Search, AlertCircle } from "lucide-react";

export function SchoolFinderTab() {
  const { results, isLoading, error, search } = useAISearch();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const handleSearch = (query: string) => {
    setSelectedResults(new Set());
    search(query);
  };

  const handleSelectResult = (id: string, selected: boolean) => {
    setSelectedResults(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (!results) return;
    
    const allIds = [
      ...(results.schools || []).map(s => s.id),
      ...(results.high_schools || []).map(s => s.id),
    ];

    setSelectedResults(selected ? new Set(allIds) : new Set());
  };

  const handleClearSelection = () => {
    setSelectedResults(new Set());
  };

  const allSchools = results ? [
    ...(results.schools || []),
    ...(results.high_schools || [])
  ] : [];

  return (
    <div className="space-y-6">
      <div className="glass-light p-6 rounded-lg border border-border/40">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">School Search</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Find schools, colleges, and youth services to add to your CRM and outreach campaigns
        </p>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <FilterPanel filters={filters} onFilterChange={setFilters} />

      {selectedResults.size > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedResults.size}
          selectedIds={Array.from(selectedResults)}
          allResults={allSchools}
          onClearSelection={handleClearSelection}
        />
      )}

      {error && (
        <Alert variant={error.includes('simplified') ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {error.includes('busy') && (
              <span className="block mt-2 text-xs">
                The AI search is temporarily unavailable. Results are based on keyword matching.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {results && results.total_results > 0 && (
        <SearchStats
          totalResults={results.total_results}
          duration={results.duration_ms}
          filters={results.filters}
        />
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      )}

      {!isLoading && !results && (
        <EmptyState message="Start searching for schools and organizations" />
      )}

      {!isLoading && results && results.total_results === 0 && (
        <EmptyState message="No results found for your search" />
      )}

      {!isLoading && results && results.total_results > 0 && (
        <div className="space-y-8">
          {results.schools && results.schools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Colleges & Universities ({results.schools.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.schools.map((school) => (
                  <AdminResultCard
                    key={school.id}
                    type="school"
                    data={school}
                    isSelected={selectedResults.has(school.id)}
                    onSelect={(selected) => handleSelectResult(school.id, selected)}
                  />
                ))}
              </div>
            </div>
          )}

          {results.high_schools && results.high_schools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                High Schools ({results.high_schools.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.high_schools.map((school) => (
                  <AdminResultCard
                    key={school.id}
                    type="school"
                    data={school}
                    isSelected={selectedResults.has(school.id)}
                    onSelect={(selected) => handleSelectResult(school.id, selected)}
                  />
                ))}
              </div>
            </div>
          )}

          {results.youth_services && results.youth_services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Youth Services ({results.youth_services.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.youth_services.map((service) => (
                  <AdminResultCard
                    key={service.id}
                    type="youth_service"
                    data={service}
                    isSelected={selectedResults.has(service.id)}
                    onSelect={(selected) => handleSelectResult(service.id, selected)}
                  />
                ))}
              </div>
            </div>
          )}

          {results.scholarships && results.scholarships.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Scholarships ({results.scholarships.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.scholarships.map((scholarship) => (
                  <AdminResultCard
                    key={scholarship.id}
                    type="scholarship"
                    data={scholarship}
                    isSelected={selectedResults.has(scholarship.id)}
                    onSelect={(selected) => handleSelectResult(scholarship.id, selected)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
