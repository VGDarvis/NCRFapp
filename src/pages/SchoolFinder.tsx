import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchBar } from "@/components/school-finder/SearchBar";
import { FilterPanel } from "@/components/school-finder/FilterPanel";
import { ResultsGrid } from "@/components/school-finder/ResultsGrid";
import { SearchStats } from "@/components/school-finder/SearchStats";
import { useAISearch, SearchFilters } from "@/hooks/useAISearch";

export default function SchoolFinder() {
  const navigate = useNavigate();
  const { results, isLoading, error, search } = useAISearch();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (searchQuery) {
      search(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-premium border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NCRF School Finder
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Find Your Perfect Educational Match
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Search schools, programs, scholarships, and youth services tailored to your needs
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Quick Start - Show before first search */}
          {!results && !isLoading && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Popular searches:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Texas high schools',
                  'California HBCUs',
                  'Houston colleges',
                  'Dallas schools',
                  'Florida universities'
                ].map(suggestion => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(suggestion)}
                    className="hover:bg-primary/10"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Stats */}
          {results && (
            <div className="mb-6">
              <SearchStats
                totalResults={results.total_results}
                duration={results.duration_ms}
                filters={filters}
              />
            </div>
          )}

          {/* Filter Panel & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters - Desktop Sidebar */}
            <aside className="hidden lg:block">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              <ResultsGrid
                results={results}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
