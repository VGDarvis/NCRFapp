import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isPast, parseISO } from 'date-fns';

export interface ExpoMarket {
  slug: string;
  city: string;
  venue: string;
  date: string; // ISO date
  type: 'BCE' | 'HBCU Caravan';
  state: string;
}

export const EXPO_MARKETS_2026: ExpoMarket[] = [
  { slug: 'miami', city: 'Miami', venue: 'William H. Turner Technical Arts High School', date: '2026-01-24', type: 'BCE', state: 'FL' },
  { slug: 'bakersfield', city: 'Bakersfield', venue: 'Bakersfield College', date: '2026-02-02', type: 'HBCU Caravan', state: 'CA' },
  { slug: 'fresno', city: 'Fresno', venue: 'Fresno Convention Center - Valdez Hall', date: '2026-02-03', type: 'BCE', state: 'CA' },
  { slug: 'monterey', city: 'Monterey Peninsula', venue: 'Oldmeyer Community Center', date: '2026-02-04', type: 'HBCU Caravan', state: 'CA' },
  { slug: 'mount-diablo', city: 'Mount Diablo', venue: 'Mount Diablo High School', date: '2026-02-05', type: 'HBCU Caravan', state: 'CA' },
  { slug: 'stockton', city: 'Stockton', venue: 'Stagg High School (Library)', date: '2026-02-05', type: 'BCE', state: 'CA' },
  { slug: 'oakland-usd', city: 'Oakland USD', venue: 'Oakland Technical High School', date: '2026-02-06', type: 'HBCU Caravan', state: 'CA' },
  { slug: 'pomona', city: 'Pomona', venue: 'Garey High School', date: '2026-02-10', type: 'HBCU Caravan', state: 'CA' },
  { slug: 'oakland', city: 'Oakland', venue: 'Oakland Marriott City Center', date: '2026-02-07', type: 'BCE', state: 'CA' },
  { slug: 'san-diego', city: 'San Diego', venue: 'Bayview Church', date: '2026-02-12', type: 'BCE', state: 'CA' },
  { slug: 'los-angeles', city: 'Los Angeles', venue: 'Pomona Fairplex', date: '2026-02-14', type: 'BCE', state: 'CA' },
  { slug: 'houston', city: 'Houston', venue: 'NRG Center', date: '2026-02-21', type: 'BCE', state: 'TX' },
  { slug: 'dallas', city: 'Dallas-Fort Worth', venue: 'Arlington Convention Center', date: '2026-02-28', type: 'BCE', state: 'TX' },
  { slug: 'north-carolina', city: 'North Carolina', venue: 'Johnson C. Smith University', date: '2026-03-05', type: 'BCE', state: 'NC' },
  { slug: 'atlanta', city: 'Atlanta', venue: 'Cobb Galleria Centre', date: '2026-03-07', type: 'BCE', state: 'GA' },
  { slug: 'seattle', city: 'Seattle', venue: 'Seattle Convention Center', date: '2026-03-14', type: 'BCE', state: 'WA' },
  { slug: 'dc', city: 'DC / Maryland', venue: 'Walter E. Washington Convention Center', date: '2026-03-28', type: 'BCE', state: 'DC' },
  { slug: 'chicago', city: 'Chicago', venue: 'Chicago State University', date: '2026-04-04', type: 'BCE', state: 'IL' },
];

const BCEPrograms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Black College Expo™</h1>
            <p className="text-sm text-muted-foreground">2026 Expo Calendar</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary/15 via-background to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-3"
          >
            2026 Expo Season
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            {EXPO_MARKETS_2026.length} events across the nation. Find a Black College Expo or HBCU Caravan near you.
          </p>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-4 md:gap-5 max-w-4xl mx-auto">
          {EXPO_MARKETS_2026.map((market, index) => {
            const eventDate = parseISO(market.date);
            const past = isPast(eventDate);

            return (
              <motion.button
                key={market.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => navigate(`/bce-programs/${market.slug}`)}
                className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-xl border text-left transition-all duration-200 group hover:shadow-lg ${
                  past
                    ? 'border-border/40 bg-muted/30 opacity-70 hover:opacity-90'
                    : 'border-primary/30 bg-card hover:border-primary/60 hover:shadow-[var(--glow-blue)]'
                }`}
              >
                {/* Date block */}
                <div className={`shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center ${
                  past ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'
                }`}>
                  <span className="text-xs font-medium uppercase">{format(eventDate, 'MMM')}</span>
                  <span className="text-xl font-bold leading-none">{format(eventDate, 'd')}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-foreground text-base md:text-lg">{market.city}</span>
                    <Badge variant={market.type === 'BCE' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0">
                      {market.type}
                    </Badge>
                    {past && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0 text-muted-foreground border-muted-foreground/30">
                        Past
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{market.venue}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BCEPrograms;
