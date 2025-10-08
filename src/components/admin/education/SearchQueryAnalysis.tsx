import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportButton } from "@/components/admin/analytics/shared/ExportButton";
import { useAllSearchQueries } from "@/hooks/useEducationAnalytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SearchQueryAnalysisProps {
  dateRange: { from: Date; to: Date };
  zeroResultQueries: any[];
}

export function SearchQueryAnalysis({ dateRange, zeroResultQueries }: SearchQueryAnalysisProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: allQueries, isLoading } = useAllSearchQueries(dateRange.from, dateRange.to);

  const filteredQueries = allQueries?.filter((q) =>
    q.query_text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Zero Result Analysis Alert */}
      {zeroResultQueries.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Gap Analysis</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              <p className="font-medium">
                {zeroResultQueries.length} recent searches returned no results:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {zeroResultQueries.slice(0, 5).map((q, idx) => (
                  <li key={idx}>{q.query_text}</li>
                ))}
              </ul>
              {zeroResultQueries.length > 5 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ...and {zeroResultQueries.length - 5} more. Consider adding data for these
                  searches.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Query Table */}
      <Card className="glass-premium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Query Details
              </CardTitle>
              <CardDescription>
                Detailed analysis of all search queries with filters and results
              </CardDescription>
            </div>
            <ExportButton
              data={filteredQueries || []}
              filename={`search-queries-${format(new Date(), "yyyy-MM-dd")}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Filter queries..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead className="text-center">Results</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading queries...
                    </TableCell>
                  </TableRow>
                ) : filteredQueries?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No search queries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueries?.map((query) => (
                    <Collapsible key={query.id} asChild open={expandedRow === query.id}>
                      <>
                        <TableRow>
                          <TableCell>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(query.id)}
                              >
                                {expandedRow === query.id ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell className="font-medium">{query.query_text}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={query.results_count > 0 ? "default" : "destructive"}>
                              {query.results_count}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {query.search_duration_ms}ms
                          </TableCell>
                          <TableCell>
                            {format(new Date(query.created_at), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {query.results_count > 0 ? (
                              <Badge variant="outline" className="bg-accent/10">
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-destructive/10">
                                No Results
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/30">
                              <div className="p-4 space-y-2">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Parsed Filters:</h4>
                                  <pre className="text-xs bg-background p-3 rounded-md overflow-x-auto">
                                    {JSON.stringify(query.parsed_filters, null, 2)}
                                  </pre>
                                </div>
                                {query.user_id && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">
                                      User ID: {query.user_id}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
