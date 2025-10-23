import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export const VendorsTab = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-12 text-center">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Exhibitors & Vendors</h2>
        <p className="text-muted-foreground">
          Explore colleges, universities, and organizations attending the expo.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Coming in Phase 2: Searchable booth directory with filters and featured colleges.
        </p>
      </Card>
    </div>
  );
};
