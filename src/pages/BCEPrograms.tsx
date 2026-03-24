import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { format, isPast, parseISO } from 'date-fns';
import calendarImage from '@/assets/expo-calendar-2026.png';
import logoGreenClean from '@/assets/logo-green-clean.png';

export interface ExpoMarket {
  slug: string;
  city: string;
  venue: string;
  date: string;
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
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-3 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img src={logoGreenClean} alt="BCE Logo" className="w-8 h-8 rounded-md object-contain" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Black College Expo™</h1>
            <p className="text-xs text-muted-foreground">2026 Expo Calendar</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/15 via-background to-accent/10 border-b border-border">
        <div className="px-3 py-6 sm:py-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2"
          >
            2026 Expo Season
          </motion.h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {EXPO_MARKETS_2026.length} events across the nation. Find a Black College Expo or HBCU Caravan near you.
          </p>
        </div>
      </div>

      {/* Calendar Image Card */}
      <div className="px-3 py-4">
        <button
          onClick={() => setCalendarOpen(true)}
          className="w-full rounded-xl border border-primary/30 overflow-hidden bg-card hover:border-primary/60 transition-all group"
        >
          <img
            src={calendarImage}
            alt="2026 Black College Expo Calendar"
            className="w-full object-contain"
            loading="lazy"
          />
          <div className="flex items-center justify-center gap-2 p-3 text-sm text-primary font-medium border-t border-border">
            <ImageIcon className="w-4 h-4" />
            Tap to view full calendar
          </div>
        </button>
      </div>

      {/* Calendar Full-Screen Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 sm:p-4 overflow-auto">
          <DialogTitle className="sr-only">2026 Expo Calendar</DialogTitle>
          <img
            src={calendarImage}
            alt="2026 Black College Expo Calendar"
            className="w-full h-auto object-contain"
          />
        </DialogContent>
      </Dialog>

      {/* Markets List */}
      <div className="px-3 pb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          All Events
        </h3>
        <div className="space-y-3">
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
                className={`w-full rounded-xl border text-left transition-all duration-200 group hover:shadow-lg ${
                  past
                    ? 'border-border/40 bg-muted/30 opacity-70 hover:opacity-90'
                    : 'border-primary/30 bg-card hover:border-primary/60 hover:shadow-[var(--glow-blue)]'
                }`}
              >
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  {/* Date block */}
                  <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex flex-col items-center justify-center text-center ${
                    past ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'
                  }`}>
                    <span className="text-[10px] sm:text-xs font-medium uppercase">{format(eventDate, 'MMM')}</span>
                    <span className="text-lg sm:text-xl font-bold leading-none">{format(eventDate, 'd')}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-foreground text-sm sm:text-base">{market.city}</span>
                      <Badge variant={market.type === 'BCE' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {market.type}
                      </Badge>
                      {past && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">
                          Past
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-start gap-1 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{market.venue}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BCEPrograms;
