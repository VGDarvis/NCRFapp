import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface EventFiltersState {
  searchQuery: string;
  distanceRadius: number;
  dateRange: 'all' | 'thisMonth' | 'next3Months' | 'thisYear';
  eventType: 'all' | 'college_fair' | 'family_night' | 'steam_expo';
  state: string;
  sortBy: 'date' | 'distance' | 'name';
}

interface EventFiltersProps {
  filters: EventFiltersState;
  onFiltersChange: (filters: EventFiltersState) => void;
  userLocation: { latitude: number; longitude: number } | null;
  availableStates: string[];
}

export const EventFilters = ({
  filters,
  onFiltersChange,
  userLocation,
  availableStates,
}: EventFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = <K extends keyof EventFiltersState>(
    key: K,
    value: EventFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      searchQuery: '',
      distanceRadius: 100,
      dateRange: 'all',
      eventType: 'all',
      state: 'all',
      sortBy: 'date',
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.dateRange !== 'all' ||
    filters.eventType !== 'all' ||
    filters.state !== 'all' ||
    (userLocation && filters.distanceRadius < 100);

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, cities, or colleges..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-10"
          />
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {isOpen ? 'Hide' : 'Show'} Filters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute z-10 mt-2 w-full">
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={filters.eventType}
                    onValueChange={(value) =>
                      handleFilterChange('eventType', value as EventFiltersState['eventType'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="college_fair">College Fair</SelectItem>
                      <SelectItem value="family_night">Family Night</SelectItem>
                      <SelectItem value="steam_expo">STEAM Expo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      handleFilterChange('dateRange', value as EventFiltersState['dateRange'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="next3Months">Next 3 Months</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Select
                    value={filters.state}
                    onValueChange={(value) => handleFilterChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {availableStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange('sortBy', value as EventFiltersState['sortBy'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      {userLocation && <SelectItem value="distance">Distance</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {userLocation && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Distance: {filters.distanceRadius} miles</Label>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Slider
                    value={[filters.distanceRadius]}
                    onValueChange={([value]) => handleFilterChange('distanceRadius', value)}
                    min={10}
                    max={500}
                    step={10}
                  />
                </div>
              )}

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};
