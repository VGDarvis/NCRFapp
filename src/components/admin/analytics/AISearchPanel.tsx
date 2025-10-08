import { useState } from 'react';
import { Search, Sparkles, GraduationCap, School, Trophy, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAISearch } from '@/hooks/useAISearch';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ExportButton } from './shared/ExportButton';

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const REGIONS = ["West", "South", "Midwest", "Northeast"];

export function AISearchPanel() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const { results, isLoading, error, search } = useAISearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const examples = [
    'HBCUs in California with engineering programs',
    'High schools in Texas with basketball programs',
    'Youth sports programs in Atlanta for ages 10-14',
    'Scholarships for women in STEM under $10,000',
  ];

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" />Unverified</Badge>;
    }
  };

  const filterByLocation = (items: any[]) => {
    if (!items) return [];
    let filtered = items;
    if (stateFilter !== "all") {
      filtered = filtered.filter(item => item.state === stateFilter);
    }
    if (regionFilter !== "all") {
      filtered = filtered.filter(item => item.region === regionFilter);
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <Card className="glass-premium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI-Powered Educational Search</CardTitle>
          </div>
          <CardDescription>
            Search for colleges, high schools, scholarships, and youth sports programs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'High schools in Texas with basketball' or 'Youth leagues in Atlanta'"
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {US_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                {results.filters.institution_type && (
                  <Badge>Institution: {results.filters.institution_type}</Badge>
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
                {results.filters.sports_programs && results.filters.sports_programs.length > 0 && (
                  <Badge>Sports: {results.filters.sports_programs.join(', ')}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Results</CardTitle>
                <ExportButton
                  data={[...results.schools, ...results.high_schools, ...results.scholarships, ...results.youth_services]}
                  filename="ai-search-all-results"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">
                    All ({results.total_results})
                  </TabsTrigger>
                  <TabsTrigger value="colleges">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Colleges ({filterByLocation(results.schools).length})
                  </TabsTrigger>
                  <TabsTrigger value="high_schools">
                    <School className="h-4 w-4 mr-1" />
                    High Schools ({filterByLocation(results.high_schools).length})
                  </TabsTrigger>
                  <TabsTrigger value="youth">
                    <Trophy className="h-4 w-4 mr-1" />
                    Youth Sports ({filterByLocation(results.youth_services).length})
                  </TabsTrigger>
                  <TabsTrigger value="scholarships">
                    Scholarships ({results.scholarships.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {filterByLocation(results.schools).map((school: any) => (
                    <Card key={school.id} className="glass">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{school.school_name}</CardTitle>
                            <CardDescription>
                              {school.city}, {school.state} • {school.school_type}
                            </CardDescription>
                          </div>
                          {school.verification_status && getVerificationBadge(school.verification_status)}
                        </div>
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
                  {filterByLocation(results.high_schools).map((school: any) => (
                    <Card key={school.id} className="glass">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{school.school_name}</CardTitle>
                            <CardDescription>
                              {school.city}, {school.state} • High School
                            </CardDescription>
                          </div>
                          {school.verification_status && getVerificationBadge(school.verification_status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {school.athletic_programs?.map((sport: string, i: number) => (
                            <Badge key={i} variant="outline">{sport}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filterByLocation(results.youth_services).map((service: any) => (
                    <Card key={service.id} className="glass">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{service.service_name}</CardTitle>
                            <CardDescription>
                              {service.organization_name} • {service.city}, {service.state}
                            </CardDescription>
                          </div>
                          {getVerificationBadge(service.verification_status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {service.sports_offered && service.sports_offered.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {service.sports_offered.map((sport: string, i: number) => (
                              <Badge key={i} variant="outline">{sport}</Badge>
                            ))}
                          </div>
                        )}
                        {service.cost_info && (
                          <p className="text-sm text-muted-foreground">Cost: {service.cost_info}</p>
                        )}
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

                <TabsContent value="colleges" className="space-y-4 mt-4">
                  {filterByLocation(results.schools).map((school: any) => (
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

                <TabsContent value="high_schools" className="space-y-4 mt-4">
                  {filterByLocation(results.high_schools).map((school: any) => (
                    <Card key={school.id} className="glass">
                      <CardHeader>
                        <CardTitle className="text-base">{school.school_name}</CardTitle>
                        <CardDescription>
                          {school.city}, {school.state}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {school.athletic_programs && school.athletic_programs.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Sports Programs:</p>
                            <div className="flex flex-wrap gap-2">
                              {school.athletic_programs.map((sport: string, i: number) => (
                                <Badge key={i} variant="outline">{sport}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {school.website && (
                          <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Visit Website →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="youth" className="space-y-4 mt-4">
                  {filterByLocation(results.youth_services).map((service: any) => (
                    <Card key={service.id} className="glass">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{service.service_name}</CardTitle>
                            <CardDescription>
                              {service.organization_name}
                            </CardDescription>
                          </div>
                          {getVerificationBadge(service.verification_status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">{service.city}, {service.state}</p>
                        {service.sports_offered && service.sports_offered.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Sports Offered:</p>
                            <div className="flex flex-wrap gap-2">
                              {service.sports_offered.map((sport: string, i: number) => (
                                <Badge key={i} variant="outline">{sport}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {service.age_ranges && service.age_ranges.length > 0 && (
                          <p className="text-sm">Ages: {service.age_ranges.join(', ')}</p>
                        )}
                        {service.cost_info && (
                          <p className="text-sm">Cost: {service.cost_info}</p>
                        )}
                        {service.website && (
                          <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
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