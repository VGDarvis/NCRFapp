import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useExhibitors } from '@/hooks/useExhibitors';
import { ExhibitorCard } from './ExhibitorCard';
import { StatsCard } from '@/components/admin/shared/StatsCard';

export const ExhibitorDirectory = () => {
  const [search, setSearch] = useState('');
  const [orgTypeFilter, setOrgTypeFilter] = useState<string>('');
  const { events } = useEvents();

  const houstonEvent = events?.find(e => 
    e.event_type === 'college_fair' && 
    e.start_at && new Date(e.start_at) > new Date()
  );

  const { exhibitors, isLoading } = useExhibitors(houstonEvent?.id || null, {
    search: search || undefined,
    orgType: orgTypeFilter || undefined,
  });

  const stats = {
    total: exhibitors.length,
    assigned: exhibitors.filter(e => e.x_position !== null).length,
    unassigned: exhibitors.filter(e => e.x_position === null).length,
    specialFeatures: exhibitors.filter(
      e => e.offers_on_spot_admission || e.waives_application_fee || e.scholarship_info
    ).length,
  };

  const orgTypes = ['hbcu', 'university', 'military', 'corporate', 'ncrf', 'other'];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Exhibitors"
          value={stats.total.toString()}
        />
        <StatsCard
          title="Assigned Booths"
          value={stats.assigned.toString()}
        />
        <StatsCard
          title="Unassigned"
          value={stats.unassigned.toString()}
        />
        <StatsCard
          title="Special Features"
          value={stats.specialFeatures.toString()}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exhibitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={orgTypeFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOrgTypeFilter('')}
            >
              All Types
            </Button>
            {orgTypes.map(type => (
              <Button
                key={type}
                variant={orgTypeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrgTypeFilter(type)}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Exhibitor List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Loading exhibitors...
          </div>
        ) : exhibitors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No exhibitors found. Import exhibitors to get started.
          </div>
        ) : (
          exhibitors.map(exhibitor => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))
        )}
      </div>
    </div>
  );
};
