import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { useExhibitors } from '@/hooks/useExhibitors';
import { ExhibitorCard } from './ExhibitorCard';
import { StatsCard } from '@/components/admin/shared/StatsCard';

export const ExhibitorDirectory = () => {
  const [search, setSearch] = useState('');
  const [orgTypeFilter, setOrgTypeFilter] = useState<string | undefined>();
  const [showUnverified, setShowUnverified] = useState(false);

  const { exhibitors, isLoading } = useExhibitors({
    search: search || undefined,
    orgType: orgTypeFilter,
    isVerified: showUnverified ? false : undefined,
  });

  const totalExhibitors = exhibitors.length;
  const verifiedCount = exhibitors.filter((e) => e.is_verified).length;
  const withScholarships = exhibitors.filter((e) => e.scholarship_info).length;
  const withOnSpotAdmission = exhibitors.filter((e) => e.offers_on_spot_admission).length;

  const orgTypes = [
    "college",
    "university",
    "hbcu",
    "community_college",
    "trade_school",
    "military",
    "corporate",
    "nonprofit",
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Exhibitors"
          value={totalExhibitors}
          icon={Building2}
        />
        <StatsCard
          title="Verified"
          value={verifiedCount}
          icon={CheckCircle2}
        />
        <StatsCard
          title="With Scholarships"
          value={withScholarships}
        />
        <StatsCard
          title="On-Spot Admission"
          value={withOnSpotAdmission}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exhibitor Directory</CardTitle>
          <CardDescription>
            Master directory of all organizations across all events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exhibitors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showUnverified ? "default" : "outline"}
              onClick={() => setShowUnverified(!showUnverified)}
              className="gap-2"
            >
              {showUnverified ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {showUnverified ? "Show All" : "Show Unverified"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={!orgTypeFilter ? "default" : "outline"}
              size="sm"
              onClick={() => setOrgTypeFilter(undefined)}
            >
              All Types
            </Button>
            {orgTypes.map((type) => (
              <Button
                key={type}
                variant={orgTypeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter(type)}
              >
                {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading exhibitors...
            </div>
          ) : exhibitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No exhibitors found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exhibitors.map((exhibitor) => (
                <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
