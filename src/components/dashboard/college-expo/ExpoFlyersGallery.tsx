import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

import expoHouston from '@/assets/expo-flyers/expo-houston.png';
import expoFortWorth from '@/assets/expo-flyers/expo-fortworth.png';
import expoSeattle from '@/assets/expo-flyers/expo-seattle.png';
import expoMiami from '@/assets/expo-flyers/expo-miami.png';
import expoFresno from '@/assets/expo-flyers/expo-fresno.png';
import expoOakland from '@/assets/expo-flyers/expo-oakland.png';
import expoSanDiego from '@/assets/expo-flyers/expo-sandiego.png';
import expoLosAngeles from '@/assets/expo-flyers/expo-los-angeles.png';
import expoNorthCarolina from '@/assets/expo-flyers/expo-north-carolina.png';
import expoAtlanta from '@/assets/expo-flyers/expo-atlanta.png';

interface ExpoFlyer {
  id: string;
  city: string;
  image: string;
  alt: string;
}

const expoFlyers: ExpoFlyer[] = [
  { id: 'houston', city: 'Houston, TX', image: expoHouston, alt: 'Black College Expo - Houston' },
  { id: 'fortworth', city: 'Fort Worth, TX', image: expoFortWorth, alt: 'Black College Expo - Fort Worth' },
  { id: 'seattle', city: 'Seattle, WA', image: expoSeattle, alt: 'Black College Expo - Seattle' },
  { id: 'miami', city: 'Miami, FL', image: expoMiami, alt: 'Black College Expo - Miami' },
  { id: 'fresno', city: 'Fresno, CA', image: expoFresno, alt: 'Black College Expo - Fresno' },
  { id: 'oakland', city: 'Oakland, CA', image: expoOakland, alt: 'Black College Expo - Oakland' },
  { id: 'sandiego', city: 'San Diego, CA', image: expoSanDiego, alt: 'Black College Expo - San Diego' },
  { id: 'losangeles', city: 'Los Angeles, CA', image: expoLosAngeles, alt: 'Black College Expo - Los Angeles' },
  { id: 'northcarolina', city: 'North Carolina', image: expoNorthCarolina, alt: 'Black College Expo - North Carolina' },
  { id: 'atlanta', city: 'Atlanta, GA', image: expoAtlanta, alt: 'Black College Expo - Atlanta' },
];

export const ExpoFlyersGallery = () => {
  const [selectedFlyer, setSelectedFlyer] = useState<ExpoFlyer | null>(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">Black College Expo Events Across the Country</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expoFlyers.map((flyer, index) => (
          <motion.div
            key={flyer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => setSelectedFlyer(flyer)}
          >
            <div className="glass-premium rounded-xl overflow-hidden border border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <div className="relative aspect-[3/4]">
                <img
                  src={flyer.image}
                  alt={flyer.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{flyer.city}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedFlyer} onOpenChange={() => setSelectedFlyer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedFlyer && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">{selectedFlyer.city}</h3>
              </div>
              <img
                src={selectedFlyer.image}
                alt={selectedFlyer.alt}
                className="w-full h-auto rounded-lg"
              />
              <div className="flex gap-4">
                <Button className="flex-1">Register Now</Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={selectedFlyer.image} download={`${selectedFlyer.id}-flyer.png`}>
                    Download Flyer
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
