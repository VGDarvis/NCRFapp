import { ResultCard } from "./ResultCard";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SearchResult } from "@/hooks/useAISearch";

interface ResultsGridProps {
  results: SearchResult | null;
  isLoading: boolean;
  error: string | null;
}

export function ResultsGrid({ results, isLoading, error }: ResultsGridProps) {
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

  // No results found
  if (results.total_results === 0) {
    return <EmptyState message="No results found. Try adjusting your search or filters." />;
  }

  // Display results by type
  return (
    <div className="space-y-8">
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

      {/* High Schools */}
      {results.high_schools && results.high_schools.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            High Schools
            <span className="text-sm font-normal text-muted-foreground">
              ({results.high_schools.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.high_schools.map((school, index) => (
              <ResultCard key={school.id || index} type="school" data={school} />
            ))}
          </div>
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
