import { ResultCard } from "./ResultCard";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, MapPin, BarChart3, Lightbulb } from "lucide-react";
import { SearchResult } from "@/hooks/useAISearch";

interface ResultsGridProps {
  results: SearchResult | null;
  isLoading: boolean;
  error: string | null;
  onSearch?: (query: string) => void;
}

export function ResultsGrid({ results, isLoading, error, onSearch }: ResultsGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state - no search performed yet
  if (!results) {
    return <EmptyState message="Start searching to find schools, scholarships, and youth services" />;
  }

  // No results found - show helpful guidance instead of blank screen
  if (results.total_results === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full glass-premium flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Searching nearby areas...
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We couldn't find results in your exact search area, but we're looking at nearby cities and the entire state to find schools for you.
        </p>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Try searching with just a state (e.g., "Texas high schools") or city name (e.g., "Dallas") for best results.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Display results by type
  return (
    <div className="space-y-8">
      {/* Did You Mean Suggestion */}
      {results.did_you_mean && onSearch && (
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-600">Did you mean?</AlertTitle>
          <AlertDescription className="text-foreground">
            {results.did_you_mean.reason}
            <br />
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
              onClick={() => onSearch(results.did_you_mean!.suggestion)}
            >
              Search for "{results.did_you_mean.suggestion}"
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistical Summary - For "How many" queries */}
      {results.search_explanation && (
        <Alert className="bg-primary/10 border-primary/20">
          <BarChart3 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg font-bold">
            {results.search_message}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {/* Query Details */}
            {results.search_explanation.query_details && (
              <div className="mb-4 space-y-1 text-sm">
                {results.search_explanation.query_details.searched_county && (
                  <p className="font-medium">
                    📍 Searched: {results.search_explanation.query_details.searched_county}
                  </p>
                )}
                {results.search_explanation.query_details.searched_cities !== null && (
                  <p className="text-muted-foreground">
                    🏙️ Cities included: {results.search_explanation.query_details.searched_cities}
                  </p>
                )}
                {results.search_explanation.query_details.search_method && (
                  <p className="text-muted-foreground">
                    🔍 Search method: {results.search_explanation.query_details.search_method.replace('_', ' ')}
                  </p>
                )}
              </div>
            )}
            
            {/* Results Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.search_explanation.breakdown.high_schools}
                </div>
                <div className="text-xs text-muted-foreground">High Schools</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.search_explanation.breakdown.colleges}
                </div>
                <div className="text-xs text-muted-foreground">Colleges</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.search_explanation.breakdown.scholarships}
                </div>
                <div className="text-xs text-muted-foreground">Scholarships</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.search_explanation.breakdown.youth_services}
                </div>
                <div className="text-xs text-muted-foreground">Youth Services</div>
              </div>
            </div>
            <p className="text-sm mt-3 text-center">
              View the complete list of schools below ↓
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Search Expansion Notice */}
      {results.search_expanded && results.search_message && !results.search_explanation && (
        <Alert className="bg-primary/10 border-primary/20">
          <MapPin className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            {results.search_message}
          </AlertDescription>
        </Alert>
      )}
      {/* Schools */}
      {results.schools && results.schools.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Schools
            <span className="text-sm font-normal text-muted-foreground">
              ({results.schools.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.schools.map((school, index) => (
              <ResultCard key={school.id || index} type="school" data={school} />
            ))}
          </div>
        </section>
      )}

      {/* High Schools - Grouped by Distance */}
      {results.high_schools && results.high_schools.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            High Schools
            <span className="text-sm font-normal text-muted-foreground">
              ({results.high_schools.length})
            </span>
          </h2>
          
          {(() => {
            const inCity = results.high_schools.filter(s => !s.search_expanded);
            const stateWide = results.high_schools.filter(s => s.distance_category === 'state_wide' || s.distance_category === 'state_wide_all');
            const national = results.high_schools.filter(s => s.distance_category === 'national');
            
            return (
              <>
                {inCity.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">
                      📍 In Your Area ({inCity.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {inCity.map((school, index) => (
                        <ResultCard key={school.id || index} type="school" data={school} />
                      ))}
                    </div>
                  </div>
                )}
                
                {stateWide.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                      🗺️ Nearby in {results.filters?.state || 'State'} ({stateWide.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stateWide.map((school, index) => (
                        <ResultCard key={school.id || index} type="school" data={school} />
                      ))}
                    </div>
                  </div>
                )}
                
                {national.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                      🌎 Popular Schools Nationwide ({national.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {national.map((school, index) => (
                        <ResultCard key={school.id || index} type="school" data={school} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}

      {/* Scholarships */}
      {results.scholarships && results.scholarships.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Scholarships
            <span className="text-sm font-normal text-muted-foreground">
              ({results.scholarships.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.scholarships.map((scholarship, index) => (
              <ResultCard key={scholarship.id || index} type="scholarship" data={scholarship} />
            ))}
          </div>
        </section>
      )}

      {/* Youth Services */}
      {results.youth_services && results.youth_services.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Youth Services
            <span className="text-sm font-normal text-muted-foreground">
              ({results.youth_services.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.youth_services.map((service, index) => (
              <ResultCard key={service.id || index} type="youth_service" data={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
