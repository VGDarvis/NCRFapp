import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAISearch } from '@/hooks/useAISearch';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ExportButton } from './shared/ExportButton';

export function AISearchPanel() {
  const [query, setQuery] = useState('');
  const { results, isLoading, error, search } = useAISearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const examples = [
    'HBCUs in California with engineering programs',
    'Scholarships for women in STEM under $10,000',
    'Public universities in the South with D1 athletics',
    'HBCU scholarships with GPA requirement under 3.0',
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-premium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI-Powered Search</CardTitle>
          </div>
          <CardDescription>
            Natural language search for schools and scholarships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: 'HBCUs in Georgia with business programs'"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Examples:</span>
            {examples.map((example, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setQuery(example)}
              >
                {example}
              </Badge>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="glass-premium">
          <CardContent className="py-12">
            <LoadingSpinner text="AI is analyzing your query..." />
          </CardContent>
        </Card>
      )}

      {results && !isLoading && (
        <div className="space-y-4">
          <Card className="glass-premium">
            <CardHeader>
              <CardTitle className="text-lg">AI Understanding</CardTitle>
              <CardDescription>
                Found {results.total_results} results in {results.duration_ms}ms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.filters.search_type && (
                  <Badge variant="default">Type: {results.filters.search_type}</Badge>
                )}
                {results.filters.school_type && (
                  <Badge>School: {results.filters.school_type}</Badge>
                )}
                {results.filters.state && (
                  <Badge>State: {results.filters.state}</Badge>
                )}
                {results.filters.region && (
                  <Badge>Region: {results.filters.region}</Badge>
                )}
                {results.filters.programs && results.filters.programs.length > 0 && (
                  <Badge>Programs: {results.filters.programs.join(', ')}</Badge>
                )}
                {results.filters.demographics && results.filters.demographics.length > 0 && (
                  <Badge>Demographics: {results.filters.demographics.join(', ')}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Results</CardTitle>
                <ExportButton
                  data={[...results.schools, ...results.scholarships]}
                  filename="ai-search-results"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All ({results.total_results})
                  </TabsTrigger>
                  <TabsTrigger value="schools">
                    Schools ({results.schools.length})
                  </TabsTrigger>
                  <TabsTrigger value="scholarships">
                    Scholarships ({results.scholarships.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {results.schools.map((school: any) => (
                    <Card key={school.id} className="glass">
                      <CardHeader>
                        <CardTitle className="text-base">{school.school_name}</CardTitle>
                        <CardDescription>
                          {school.city}, {school.state} • {school.school_type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {school.programs_offered?.map((program: string, i: number) => (
                            <Badge key={i} variant="outline">{program}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {results.scholarships.map((scholarship: any) => (
                    <Card key={scholarship.id} className="glass">
                      <CardHeader>
                        <CardTitle className="text-base">{scholarship.title}</CardTitle>
                        <CardDescription>
                          {scholarship.provider_name} • ${scholarship.amount_min}-${scholarship.amount_max}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="schools" className="space-y-4 mt-4">
                  {results.schools.map((school: any) => (
                    <Card key={school.id} className="glass">
                      <CardHeader>
                        <CardTitle className="text-base">{school.school_name}</CardTitle>
                        <CardDescription>
                          {school.city}, {school.state} • {school.school_type} • {school.total_enrollment?.toLocaleString()} students
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {school.acceptance_rate && (
                          <p className="text-sm">Acceptance Rate: {school.acceptance_rate}%</p>
                        )}
                        {school.athletic_division && (
                          <p className="text-sm">Division {school.athletic_division} Athletics</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {school.programs_offered?.map((program: string, i: number) => (
                            <Badge key={i} variant="outline">{program}</Badge>
                          ))}
                        </div>
                        {school.website && (
                          <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Visit Website →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="scholarships" className="space-y-4 mt-4">
                  {results.scholarships.map((scholarship: any) => (
                    <Card key={scholarship.id} className="glass">
                      <CardHeader>
                        <CardTitle className="text-base">{scholarship.title}</CardTitle>
                        <CardDescription>
                          {scholarship.provider_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-lg font-semibold text-primary">
                          ${scholarship.amount_min?.toLocaleString()} - ${scholarship.amount_max?.toLocaleString()}
                        </p>
                        <p className="text-sm">{scholarship.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                        </p>
                        {scholarship.gpa_requirement > 0 && (
                          <p className="text-sm">Min GPA: {scholarship.gpa_requirement}</p>
                        )}
                        {scholarship.eligibility_criteria && (
                          <p className="text-sm text-muted-foreground">{scholarship.eligibility_criteria}</p>
                        )}
                        {scholarship.application_url && (
                          <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Apply Now →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}