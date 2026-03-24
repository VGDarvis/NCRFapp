import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EXPO_MARKETS_2026 } from './BCEPrograms';
import { ArrowLeft, MapPin, Calendar, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { format, isPast, parseISO } from 'date-fns';
import { VendorsTabV2 } from '@/components/dashboard/college-expo/VendorsTabV2';
import { FloorPlanTabWrapper } from '@/components/dashboard/college-expo/FloorPlanTabWrapper';
import { ScholarshipsTab } from '@/components/dashboard/college-expo/ScholarshipsTab';
import { Skeleton } from '@/components/ui/skeleton';
import logoGreenClean from '@/assets/logo-green-clean.png';

const BCEMarketPage = () => {
  const { marketSlug } = useParams<{ marketSlug: string }>();
  const navigate = useNavigate();

  const market = EXPO_MARKETS_2026.find(m => m.slug === marketSlug);

  const { data: matchedEvent, isLoading } = useQuery({
    queryKey: ['market-event', marketSlug],
    queryFn: async () => {
      if (!market) return null;
      const cityLower = market.city.toLowerCase();
      const { data } = await supabase
        .from('events')
        .select('id, title, start_at, end_at, status, venue_id, description, event_flyer_url')
        .order('start_at', { ascending: false });

      if (!data) return null;
      return data.find(e =>
        e.title.toLowerCase().includes(cityLower) ||
        (market.slug === 'dallas' && e.title.toLowerCase().includes('dallas')) ||
        (market.slug === 'houston' && e.title.toLowerCase().includes('houston')) ||
        (market.slug === 'seattle' && e.title.toLowerCase().includes('seattle'))
      ) || null;
    },
    enabled: !!market,
  });

  if (!market) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
          <Button onClick={() => navigate('/bce-programs')}>Back to All Events</Button>
        </div>
      </div>
    );
  }

  const eventDate = parseISO(market.date);
  const past = isPast(eventDate);
  const eventId = matchedEvent?.id || null;
  const hasData = !!eventId;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-3 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/bce-programs')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate">{market.city} {market.type}</h1>
            <p className="text-xs text-muted-foreground">{format(eventDate, 'MMMM d, yyyy')}</p>
          </div>
          {past && (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 shrink-0 text-xs">Past</Badge>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className={`border-b border-border ${past ? 'bg-muted/30' : 'bg-gradient-to-br from-primary/10 via-background to-accent/5'}`}>
        <div className="px-3 py-6 sm:py-8">
          <Badge variant={market.type === 'BCE' ? 'default' : 'secondary'} className="mb-2">
            {market.type === 'BCE' ? 'Black College Expo™' : 'HBCU Caravan'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">{market.city}</h2>
          <div className="flex flex-col gap-1.5 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0 text-primary" />
              <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <span>{market.venue}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto" onClick={() => navigate('/auth/college-expo')}>
              Register Now
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <a href="https://www.thecollegeexpo.org/ncrf-events/events" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="px-3 py-6 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : hasData ? (
        <div className="px-3 py-4">
          <Tabs defaultValue="vendors" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-3">
              <TabsTrigger value="vendors" className="text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 mr-1 hidden sm:inline" /> Participants
              </TabsTrigger>
              <TabsTrigger value="floorplan" className="text-xs sm:text-sm">Floor Plan</TabsTrigger>
              <TabsTrigger value="scholarships" className="text-xs sm:text-sm">Scholarships</TabsTrigger>
            </TabsList>

            <TabsContent value="vendors">
              <VendorsTabV2 />
            </TabsContent>
            <TabsContent value="floorplan">
              <FloorPlanTabWrapper />
            </TabsContent>
            <TabsContent value="scholarships">
              <ScholarshipsTab user={null} isGuest />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="px-3 py-10">
          <Card className="p-6 text-center border-primary/20">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Details Coming Soon</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Vendor and session details for {market.city} will be available as the event date approaches.
            </p>
            <Button className="w-full sm:w-auto" onClick={() => navigate('/auth/college-expo')}>
              Sign Up for Updates
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BCEMarketPage;
