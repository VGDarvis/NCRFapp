import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export const MapTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-12 text-center">
        <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Interactive Map</h2>
        <p className="text-muted-foreground">
          La Verne-style event map with venue markers, booth locations, and real-time updates.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Coming in Phase 2: Mapbox integration with event switcher, filters, and booth clustering.
        </p>
      </Card>
    </div>
  );
};
